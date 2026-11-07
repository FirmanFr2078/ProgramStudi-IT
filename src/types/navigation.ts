import type { LucideIcon } from "lucide-react"
import type { Permission } from "./auth"

export type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  permission?: Permission // kosong = semua role boleh
}

export type NavGroup = { label: string; items: NavItem[] }