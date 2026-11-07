import type { LucideIcon } from "lucide-react"

export type SiteNavLink = { label: string; href: string }

export type SiteNavItem = {
  label: string
  href?: string // untuk menu tanpa submenu
  children?: SiteNavLink[] // untuk menu dengan submenu
}

export type FooterGroup = { title: string; links: SiteNavLink[] }

export type QuickLink = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}