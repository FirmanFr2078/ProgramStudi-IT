import { jwtVerify, SignJWT } from "jose"

export const AUTH_SESSION_COOKIE = "web_prodi_session"
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 // 1 hari

const AUTH_ISSUER = "web-prodi"
const AUTH_AUDIENCE = "web-prodi-dashboard"

export type SessionPayload = {
  userId: string
  role: "admin"
  sessionVersion: number
}

export type AuthSession = SessionPayload & {
  issuedAt: Date
  expiresAt: Date
}

export class SessionError extends Error {
  constructor(
    public readonly code: "INVALID_SESSION" | "AUTH_CONFIGURATION",
    message: string
  ) {
    super(message)
    this.name = "SessionError"
  }
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ role: payload.role, sessionVersion: payload.sessionVersion })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.userId)
    .setIssuer(AUTH_ISSUER)
    .setAudience(AUTH_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${AUTH_SESSION_MAX_AGE}s`)
    .sign(getSessionSecret())
}

export async function verifySessionToken(token: string): Promise<AuthSession> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      issuer: AUTH_ISSUER,
      audience: AUTH_AUDIENCE,
    })

    if (
      !payload.sub ||
      payload.role !== "admin" ||
      typeof payload.sessionVersion !== "number" ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      throw new SessionError("INVALID_SESSION", "Sesi tidak memiliki identitas lengkap.")
    }

    return {
      userId: payload.sub,
      role: payload.role,
      sessionVersion: payload.sessionVersion,
      issuedAt: new Date(payload.iat * 1000),
      expiresAt: new Date(payload.exp * 1000),
    }
  } catch (error) {
    if (error instanceof SessionError) throw error
    throw new SessionError("INVALID_SESSION", "Sesi tidak valid atau sudah berakhir.")
  }
}

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new SessionError(
      "AUTH_CONFIGURATION",
      "AUTH_SESSION_SECRET belum dikonfigurasi (minimal 32 karakter)."
    )
  }
  return new TextEncoder().encode(secret)
}