import type { LucideIcon } from "lucide-react"
import {
  CodeXmlIcon,
  CpuIcon,
  DatabaseIcon,
  ShieldCheckIcon,
} from "lucide-react"

export type FocusArea = {
  name: string
  description: string
  icon: LucideIcon
  href: string
  featured?: boolean
}

export const focusAreas: FocusArea[] = [
  {
    name: "Sistem Cerdas & Game",
    description: "AI, machine learning, dan pengembangan game",
    icon: CpuIcon,
    href: "/pendidikan/kurikulum",
    featured: true,
  },
  {
    name: "Software Development",
    description: "Rancang & bangun aplikasi",
    icon: CodeXmlIcon,
    href: "/pendidikan/kurikulum",
  },
  {
    name: "Data Sains",
    description: "Olah data jadi keputusan",
    icon: DatabaseIcon,
    href: "/pendidikan/kurikulum",
  },
  {
    name: "Jaringan & Keamanan",
    description: "Lindungi dunia digital",
    icon: ShieldCheckIcon,
    href: "/pendidikan/kurikulum",
  },
]