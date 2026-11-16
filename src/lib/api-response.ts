import "server-only"

import { NextResponse } from "next/server"
import { Prisma } from "@generated/client"

import { AuthError } from "@/lib/auth"
import { InvalidIdError } from "@/lib/ids"
import { logActivity, toJsonSafe } from "@/lib/activity-log"

export function apiResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

/**
 * Satu titik penanganan error buat SEMUA API route dashboard (bukan cuma
 * kabar) -- nerjemahin AuthError, error Prisma yang umum, id ga valid, dan
 * exception tak terduga (dicatat ke activity log sbg "error"). Dipanggil
 * dari blok catch tiap route.ts.
 */
export async function handleApiError(error: unknown, routeLabel: string) {
  if (error instanceof AuthError) {
    const status =
      error.code === "FORBIDDEN" || error.code === "ACCOUNT_DISABLED"
        ? 403
        : error.code === "UNAUTHENTICATED" || error.code === "INVALID_CREDENTIALS"
          ? 401
          : 400
    return apiResponse({ success: false, code: error.code, message: error.message }, status)
  }

  if (error instanceof InvalidIdError) {
    return apiResponse({ success: false, message: error.message }, 400)
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return apiResponse(
        { success: false, message: "Data dengan nilai unik ini sudah ada (cek slug/field unik lain)." },
        409
      )
    }
    if (error.code === "P2025") {
      return apiResponse({ success: false, message: "Data tidak ditemukan." }, 404)
    }
  }

  console.error(`[API_ERROR] ${routeLabel}`, error)
  await logActivity({
    action: "error",
    deskripsi: `Error tak terduga di ${routeLabel}.`,
    dataBaru: toJsonSafe(
      error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) }
    ),
  })
  return apiResponse({ success: false, message: "Terjadi kesalahan pada server." }, 500)
}