import {
  BookOpenIcon,
  GraduationCapIcon,
  HandshakeIcon,
  UsersIcon,
} from "lucide-react"
import type { FooterGroup, QuickLink, SiteNavItem } from "@/types"

export const siteConfig = {
  name: "Prodi TI", // nama sementara, ganti kapan saja
  fullName: "Program Studi Teknik Informatika",
  faculty: "Fakultas Teknik dan Informatika",
  university: "Universitas Islam Balitar",
  tagline: "Belajar informatika, kami temani tiap langkahnya.",
  address: "[Alamat kampus], Blitar, Jawa Timur",
  email: "[email prodi]",
  phone: "[nomor telepon]",
  copyrightYear: 2026,
  social: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
  ],
}

export const mainNav: SiteNavItem[] = [
  {
    label: "Profil",
    children: [
      { label: "Profil Prodi", href: "/profil" },
      { label: "Struktur Organisasi", href: "/organisasi" },
      { label: "Kerja Sama", href: "/kerja-sama" },
    ],
  },
  {
    label: "SDM",
    children: [
      { label: "Dosen", href: "/sdm/dosen" },
      { label: "Tenaga Kependidikan", href: "/sdm/tendik" },
    ],
  },
  {
    label: "Pendidikan",
    children: [
      { label: "Jadwal", href: "/pendidikan/jadwal" },
      { label: "Kalender Akademik", href: "/pendidikan/kalender" },
      { label: "Kurikulum", href: "/pendidikan/kurikulum" },
      { label: "MBKM", href: "/pendidikan/mbkm" },
    ],
  },
  {
    label: "Riset",
    children: [
      { label: "Hasil Penelitian", href: "/penelitian" },
      { label: "Hasil Pengabdian", href: "/penelitian/pengabdian" },
      { label: "HKI", href: "/penelitian/hki" },
    ],
  },
  {
  label: "Mahasiswa",
  children: [
    { label: "Prestasi", href: "/mahasiswa/prestasi" },
    { label: "Organisasi Mahasiswa", href: "/mahasiswa/organisasi" },
    { label: "Alumni", href: "/alumni" },   // baris baru
  ],
  },
  {
    label: "Fasilitas",
    children: [
      { label: "Laboratorium", href: "/fasilitas/laboratorium" },
      { label: "Ruang Kelas", href: "/fasilitas/ruang-kelas" },
      { label: "Gedung", href: "/fasilitas/gedung" },
      { label: "Perpustakaan", href: "/fasilitas/perpustakaan" },
    ],
  },
  {
    label: "Informasi",
    children: [
      { label: "Berita", href: "/berita" },
      { label: "Pengumuman", href: "/berita?kategori=pengumuman" },
      { label: "Event Prodi", href: "/event" },
      { label: "Info Pendaftaran", href: "/pendaftaran" },
    ],
  },
]

export const quickLinks: QuickLink[] = [
  {
    title: "Calon Mahasiswa",
    description: "Informasi pendaftaran, jalur masuk, dan biaya kuliah.",
    href: "/pendaftaran",
    icon: GraduationCapIcon,
  },
  {
    title: "Mahasiswa",
    description: "Jadwal kuliah, kalender akademik, dan panduan MBKM.",
    href: "/pendidikan/jadwal",
    icon: BookOpenIcon,
  },
  {
    title: "Dosen",
    description: "Profil dosen, bidang keahlian, dan tautan publikasi.",
    href: "/sdm/dosen",
    icon: UsersIcon,
  },
  {
    title: "Mitra & Alumni",
    description: "Kerja sama industri, kampus mitra, dan jejaring alumni.",
    href: "/kerja-sama",
    icon: HandshakeIcon,
  },
]

export const footerNav: FooterGroup[] = [
  {
    title: "Jelajahi",
    links: [
      { label: "Profil Prodi", href: "/profil" },
      { label: "Dosen", href: "/sdm/dosen" },
      { label: "Kurikulum", href: "/pendidikan/kurikulum" },
      { label: "Berita", href: "/berita" },
    ],
  },
  {
    title: "Akademik",
    links: [
      { label: "Jadwal", href: "/pendidikan/jadwal" },
      { label: "Kalender Akademik", href: "/pendidikan/kalender" },
      { label: "MBKM", href: "/pendidikan/mbkm" },
      { label: "Penelitian", href: "/penelitian" },
    ],
  },
]