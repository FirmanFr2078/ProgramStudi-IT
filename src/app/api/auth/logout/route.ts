import { NextResponse } from "next/server"

import { logActivity } from "@/lib/activity-log"
import { logout } from "@/lib/auth"

export async function POST() {
  try {
    await logout()
    return response({ success: true })
  } catch (error) {
    console.error("[AUTH_LOGOUT]", error)
    await logActivity({
      action: "error",
      deskripsi: "Error tak terduga di /api/auth/logout.",
      dataBaru: { message: error instanceof Error ? error.message : String(error) },
    })
    return response({ success: false, message: "Gagal menyelesaikan logout." }, 500)
  }
}

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })
}