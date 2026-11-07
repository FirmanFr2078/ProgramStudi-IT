import {
  Building2Icon,
  CalendarDaysIcon,
  FlaskConicalIcon,
  GraduationCapIcon,
  HandshakeIcon,
  LayoutDashboardIcon,
  NewspaperIcon,
  SettingsIcon,
  TrophyIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react"
import type { NavGroup } from "@/types"

export const navGroups: NavGroup[] = [
  {
    label: "Utama",
    items: [{ title: "Ringkasan", url: "/dashboard", icon: LayoutDashboardIcon }],
  },
  {
    label: "Konten",
    items: [
      { title: "Berita & Pengumuman", url: "/dashboard/berita", icon: NewspaperIcon, permission: "berita:manage" },
      { title: "Event Prodi", url: "/dashboard/event", icon: CalendarDaysIcon, permission: "event:manage" },
    ],
  },
  {
    label: "Akademik",
    items: [
      { title: "Dosen & Tendik", url: "/dashboard/sdm", icon: UsersIcon, permission: "sdm:manage" },
      { title: "Pendidikan", url: "/dashboard/pendidikan", icon: GraduationCapIcon, permission: "pendidikan:manage" },
      { title: "Penelitian & HKI", url: "/dashboard/penelitian", icon: FlaskConicalIcon, permission: "penelitian:manage" },
      { title: "Mahasiswa", url: "/dashboard/mahasiswa", icon: TrophyIcon, permission: "mahasiswa:manage" },
    ],
  },
  {
    label: "Lembaga",
    items: [
      { title: "Kerja Sama", url: "/dashboard/kerja-sama", icon: HandshakeIcon, permission: "kerja-sama:manage" },
      { title: "Fasilitas", url: "/dashboard/fasilitas", icon: Building2Icon, permission: "fasilitas:manage" },
    ],
  },
  {
    label: "Sistem",
    items: [
      { title: "Pengguna", url: "/dashboard/pengguna", icon: UserCogIcon, permission: "pengguna:manage" },
      { title: "Pengaturan", url: "/dashboard/pengaturan", icon: SettingsIcon, permission: "pengaturan:manage" },
    ],
  },
]