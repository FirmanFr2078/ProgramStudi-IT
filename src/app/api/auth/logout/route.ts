import { NextResponse } from "next/server"

import { logout } from "@/lib/auth"

export async function POST() {
  try {
    await logout()
    return response({ success: true })
  } catch (error) {
    console.error("[AUTH_LOGOUT]", error)
    return response({ success: false, message: "Gagal menyelesaikan logout." }, 500)
  }
}

function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })
}