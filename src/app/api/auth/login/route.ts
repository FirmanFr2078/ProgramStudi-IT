import { NextResponse } from "next/server"

import { logActivity } from "@/lib/activity-log"
import { login, AuthError } from "@/lib/auth"

export async function POST(request: Request) {
  let body: Partial<{ username: string; password: string }>
  try {
    body = await request.json()
  } catch {
    return response({ success: false, message: "Format request tidak valid." }, 400)
  }

  if (typeof body.username !== "string" || typeof body.password !== "string") {
    return response({ success: false, message: "Username dan password wajib diisi." }, 400)
  }

  try {
    const user = await login(body.username, body.password)
    return response({ success: true, data: { user } })
  } catch (error) {
    if (error instanceof AuthError) {
      const status =
        error.code === "ACCOUNT_DISABLED" ? 403 : error.code === "INVALID_CREDENTIALS" ? 401 : 400

      return response({ success: false, code: error.code, message: error.message }, status)
    }

    console.error("[AUTH_LOGIN]", error)
    await logActivity({
      action: "error",
      deskripsi: "Error tak terduga di /api/auth/login.",
      dataBaru: { message: error instanceof Error ? error.message : String(error) },
    })
    return response({ success: false, message: "Terjadi kesalahan pada server." }, 500)
  }
}

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })
}