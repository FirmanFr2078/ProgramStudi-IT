import "server-only"

import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import {
  AUTH_SESSION_COOKIE,
  AUTH_SESSION_MAX_AGE,
  SessionError,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session"

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
    public readonly code: "INVALID_CREDENTIALS" | "ACCOUNT_DISABLED" | "UNAUTHENTICATED",
    message: string
  ) {
    super(message)
    this.name = "AuthError"
  }
}

// password / session_version / is_active SENGAJA ga ikut ke sini —
// batas data penting yang ga boleh nyampe ke client.
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
  // Defense in depth -- client udah maksa lowercase, tapi server ga boleh
  // percaya itu doang (bisa aja request ditembak langsung lewat Postman).
  const normalizedUsername = username.trim().toLowerCase()

  const user = await prisma.tbl_profiles.findUnique({ where: { username: normalizedUsername } })
  const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false

  if (!user || !isPasswordValid) {
    throw new AuthError("INVALID_CREDENTIALS", "Username atau password salah.")
  }

  if (!user.is_active) {
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

  return toAuthenticatedUser(user)
}

export async function logout() {
  const session = await readSession()
  const cookieStore = await cookies()

  if (session) {
    await prisma.tbl_profiles.update({
      where: { id_profile: session.userId },
      data: { session_version: { increment: 1 } },
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

/**
 * Lapis 2 — wajib jadi baris pertama di SETIAP Server Action / Server
 * Component yang nyentuh data. Selalu query ulang ke database.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const session = await readSession()
  if (!session) throw new AuthError("UNAUTHENTICATED", "Silakan login kembali.")

  const user = await prisma.tbl_profiles.findUnique({ where: { id_profile: session.userId } })

  if (!user || !user.is_active || user.session_version !== session.sessionVersion) {
    throw new AuthError("UNAUTHENTICATED", "Sesi sudah tidak berlaku. Silakan login kembali.")
  }

  return toAuthenticatedUser(user)
}

/**
 * Pembungkus requireAdmin() buat Server Component/page.
 * requireAdmin() tetap jadi sumber kebenaran (lapis 2), fungsi ini cuma
 * nangkep AuthError-nya dan redirect ke /login, biar page ga crash.
 */
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