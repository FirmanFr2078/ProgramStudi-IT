import "server-only"

import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { logActivity } from "@/lib/activity-log"
import { can } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import {
  AUTH_SESSION_COOKIE,
  AUTH_SESSION_MAX_AGE,
  SessionError,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session"
import type { Permission } from "@/types"

export type AuthenticatedUser = {
  id: string
  nama: string
  username: string
  email: string
  foto: string | null
  role: "admin"
}

export class AuthError extends Error {
  constructor(
    public readonly code: "INVALID_CREDENTIALS" | "ACCOUNT_DISABLED" | "UNAUTHENTICATED" | "FORBIDDEN",
    message: string
  ) {
    super(message)
    this.name = "AuthError"
  }
}

function toAuthenticatedUser(user: {
  id_profile: string
  nama: string
  email: string
  username: string
  foto: string | null
}): AuthenticatedUser {
  return { id: user.id_profile, nama: user.nama, username: user.username, email: user.email, foto: user.foto, role: "admin" }
}

export async function login(username: string, password: string) {
  const normalizedUsername = username.trim().toLowerCase()

  const user = await prisma.tbl_profiles.findUnique({ where: { username: normalizedUsername } })
  const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false

  if (!user || !isPasswordValid) {
    await logActivity({
      action: "login_failed",
      actorId: user?.id_profile ?? null,
      actorNama: user?.nama ?? null,
      actorUsername: user?.username ?? normalizedUsername,
      deskripsi: user
        ? `Login gagal untuk "${normalizedUsername}" — password salah.`
        : `Login gagal — username "${normalizedUsername}" tidak ditemukan.`,
    })
    throw new AuthError("INVALID_CREDENTIALS", "Username atau password salah.")
  }

  if (!user.is_active) {
    await logActivity({
      action: "login_failed",
      actorId: user.id_profile,
      actorNama: user.nama,
      actorUsername: user.username,
      deskripsi: `Login gagal untuk "${user.username}" — akun nonaktif.`,
    })
    throw new AuthError("ACCOUNT_DISABLED", "Akun ini telah dinonaktifkan.")
  }

  const token = await createSessionToken({
    userId: user.id_profile,
    role: "admin",
    sessionVersion: user.session_version,
  })

  const cookieStore = await cookies()
  cookieStore.set(AUTH_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE,
  })

  await prisma.tbl_profiles.update({
    where: { id_profile: user.id_profile },
    data: { last_login_at: new Date() },
  })

  await logActivity({
    action: "login",
    actorId: user.id_profile,
    actorNama: user.nama,
    actorUsername: user.username,
    deskripsi: `"${user.username}" login ke dashboard.`,
  })

  return toAuthenticatedUser(user)
}

export async function logout() {
  const session = await readSession()
  const cookieStore = await cookies()

  if (session) {
    const updated = await prisma.tbl_profiles.update({
      where: { id_profile: session.userId },
      data: { session_version: { increment: 1 } },
      select: { nama: true, username: true },
    })

    await logActivity({
      action: "logout",
      actorId: session.userId,
      actorNama: updated.nama,
      actorUsername: updated.username,
      deskripsi: `"${updated.username}" logout dari dashboard.`,
    })
  }

  cookieStore.set(AUTH_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

async function readSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value
  if (!token) return null

  try {
    return await verifySessionToken(token)
  } catch (error) {
    if (error instanceof SessionError && error.code === "AUTH_CONFIGURATION") throw error
    return null
  }
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
  const session = await readSession()
  if (!session) throw new AuthError("UNAUTHENTICATED", "Silakan login kembali.")

  const user = await prisma.tbl_profiles.findUnique({ where: { id_profile: session.userId } })

  if (!user || !user.is_active || user.session_version !== session.sessionVersion) {
    throw new AuthError("UNAUTHENTICATED", "Sesi sudah tidak berlaku. Silakan login kembali.")
  }

  return toAuthenticatedUser(user)
}

export async function requireAdminPage(): Promise<AuthenticatedUser> {
  try {
    return await requireAdmin()
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login")
    }
    throw error
  }
}

/**
 * Lapis enforcement permission -- wajib dipakai di tiap server action/API
 * route yang MUTASI data (create/update/delete), ganti requireAdmin() polos.
 * Gagal karena ga punya izin -> tercatat sbg 'forbidden', beda dari
 * 'login_failed' (soal autentikasi) dan 'error' (soal bug/crash).
 */
export async function requirePermission(permission: Permission): Promise<AuthenticatedUser> {
  const user = await requireAdmin()

  if (!can(user.role, permission)) {
    await logActivity({
      action: "forbidden",
      actorId: user.id,
      actorNama: user.nama,
      actorUsername: user.username,
      entity: permission,
      deskripsi: `"${user.username}" mencoba akses "${permission}" tanpa izin.`,
    })
    throw new AuthError("FORBIDDEN", "Kamu tidak punya izin untuk aksi ini.")
  }

  return user
}

/**
 * Versi requirePermission() buat Server Component/page.tsx. Beda dari
 * requireAdminPage(): belum login -> /login, sudah login tapi ga berhak
 * -> /dashboard (sesinya tetap valid, cuma ga berhak di situ).
 */
export async function requirePermissionPage(permission: Permission): Promise<AuthenticatedUser> {
  try {
    return await requirePermission(permission)
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(error.code === "FORBIDDEN" ? "/dashboard" : "/login")
    }
    throw error
  }
}