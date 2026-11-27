import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { AUTH_SESSION_COOKIE, verifySessionToken } from "@/lib/session"

// Lapis 1 — cuma cek signature JWT buat redirect cepat.
// Lapis sebenarnya (isActive + sessionVersion vs DB) ada di requireAdmin().
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get(AUTH_SESSION_COOKIE)?.value

  if (pathname === "/login") {
    if (!token) return NextResponse.next()
    try {
      await verifySessionToken(token)
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch {
      return NextResponse.next()
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    await verifySessionToken(token)
    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.set(AUTH_SESSION_COOKIE, "", { maxAge: 0, path: "/" })
    return response
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}