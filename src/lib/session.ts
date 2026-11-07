import type { SessionUser } from "@/types"

// SEMENTARA: data palsu. Diganti login sungguhan di fase auth.
export async function getSessionUser(): Promise<SessionUser> {
  return { name: "Admin Prodi", email: "admin@prodi.local", role: "admin" }
}