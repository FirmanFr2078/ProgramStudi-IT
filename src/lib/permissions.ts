import { PERMISSIONS } from "@/config/auth"
import type { Permission, Role } from "@/types"

const rolePermissions: Record<Role, readonly Permission[]> = {
  admin: PERMISSIONS,
  // contoh nanti: dosen: ["penelitian:manage"],
}

export function can(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission)
}