import type { PERMISSIONS, ROLES } from "@/config/auth"

export type Role = (typeof ROLES)[number]
export type Permission = (typeof PERMISSIONS)[number]

export type SessionUser = {
  name: string
  email: string
  role: Role
  avatar?: string
}