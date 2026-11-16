import {
  BookOpenIcon,
  BookUserIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarClockIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClipboardListIcon,
  FlaskConicalIcon,
  HandshakeIcon,
  HeartHandshakeIcon,
  LayoutDashboardIcon,
  NetworkIcon,
  NewspaperIcon,
  RouteIcon,
  SettingsIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UserCheckIcon,
  UserCogIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react"
import type { NavGroup } from "@/types"

export const navGroups: NavGroup[] = [
  {
    label: "Utama",
    items: [{ title: "Ringkasan", url: "/dashboard", icon: LayoutDashboardIcon }],
  },
  {
    label: "Lembaga",
    items: [
      { title: "Profil", url: "/dashboard/profil", icon: BookUserIcon, permission: "profil:manage" },
      { title: "Struktur", url: "/dashboard/profil/struktur", icon: NetworkIcon, permission: "profil:manage" },
      { title: "Kerja Sama", url: "/dashboard/kerja-sama", icon: HandshakeIcon, permission: "kerja-sama:manage" },
      { title: "Fasilitas", url: "/dashboard/fasilitas", icon: Building2Icon, permission: "fasilitas:manage" },
    ],
  },
  {
    label: "Informasi",
    items: [
      { title: "Kabar", url: "/dashboard/kabar", icon: NewspaperIcon, permission: "berita:manage" },
      { title: "Acara", url: "/dashboard/acara", icon: CalendarDaysIcon, permission: "event:manage" },
      { title: "Pendaftaran", url: "/dashboard/pendaftaran", icon: ClipboardListIcon, permission: "pendaftaran:manage" },
    ],
  },
  {
    label: "Pendidikan",
    items: [
      { title: "Jadwal", url: "/dashboard/pendidikan/jadwal", icon: CalendarClockIcon, permission: "pendidikan:manage" },
      { title: "Kalender", url: "/dashboard/pendidikan/kalender", icon: CalendarIcon, permission: "pendidikan:manage" },
      { title: "Kurikulum", url: "/dashboard/pendidikan/kurikulum", icon: BookOpenIcon, permission: "pendidikan:manage" },
      { title: "MBKM", url: "/dashboard/pendidikan/mbkm", icon: RouteIcon, permission: "pendidikan:manage" },
    ],
  },
  {
    label: "SDM",
    items: [
      { title: "Dosen", url: "/dashboard/sdm/dosen", icon: UserRoundIcon, permission: "sdm:manage" },
      { title: "Tenaga Kependidikan", url: "/dashboard/sdm/tendik", icon: BriefcaseIcon, permission: "sdm:manage" },
    ],
  },
  {
    label: "Riset",
    items: [
      { title: "Penelitian", url: "/dashboard/riset/penelitian", icon: FlaskConicalIcon, permission: "penelitian:manage" },
      { title: "Pengabdian", url: "/dashboard/riset/pengabdian", icon: HeartHandshakeIcon, permission: "penelitian:manage" },
      { title: "HKI", url: "/dashboard/hki", icon: ShieldCheckIcon, permission: "penelitian:manage" },
    ],
  },
  {
    label: "Mahasiswa",
    items: [
      { title: "Prestasi", url: "/dashboard/mahasiswa/prestasi", icon: TrophyIcon, permission: "mahasiswa:manage" },
      { title: "Alumni", url: "/dashboard/mahasiswa/alumni", icon: UserCheckIcon, permission: "mahasiswa:manage" },
      { title: "Himaprodi", url: "/dashboard/mahasiswa/himaprodi", icon: UsersRoundIcon, permission: "mahasiswa:manage" },
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