import type { FooterGroup, SiteNavItem } from "@/types"

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
  { label: "Beranda", href: "/" },
  {
    label: "Profil",
    children: [
      { label: "Profil Prodi", href: "/profil/profil-prodi" },
      { label: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
      { label: "Kerja Sama", href: "/profil/kerja-sama" },
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
      { label: "Hasil Penelitian", href: "/riset/penelitian" },
      { label: "Hasil Pengabdian", href: "/riset/pengabdian" },
      { label: "HKI", href: "/riset/hki" },
    ],
  },
  {
    label: "Mahasiswa",
    children: [
      { label: "Prestasi", href: "/mahasiswa/prestasi" },
      { label: "Organisasi Mahasiswa", href: "/mahasiswa/organisasi" },
      { label: "Alumni", href: "/mahasiswa/alumni" },
    ],
  },
  {
    label: "Fasilitas",
    children: [
      { label: "Laboratorium", href: "/fasilitas/laboratorium" },
      { label: "Ruang Kelas", href: "/fasilitas/ruang-kelas" },
      { label: "Gedung", href: "/fasilitas/gedung" },
      { label: "Perpustakaan", href: "/fasilitas/perpustakaan" },
      { label: "Sarana Administrasi", href: "/fasilitas/sarana-administrasi" },
    ],
  },
  {
    label: "Informasi",
    children: [
      { label: "Kabar", href: "/informasi/kabar" },
      { label: "Event Prodi", href: "/informasi/event" },
      { label: "Info Pendaftaran", href: "/informasi/pendaftaran" },
      { label: "Kontak", href: "/informasi/kontak" },
    ],
  },
]

export const footerNav: FooterGroup[] = [
  {
    title: "Jelajahi",
    links: [
      { label: "Profil Prodi", href: "/profil/profil-prodi" },
      { label: "Dosen", href: "/sdm/dosen" },
      { label: "Kurikulum", href: "/pendidikan/kurikulum" },
      { label: "Kabar", href: "/informasi/kabar" },
    ],
  },
  {
    title: "Akademik",
    links: [
      { label: "Jadwal", href: "/pendidikan/jadwal" },
      { label: "Kalender Akademik", href: "/pendidikan/kalender" },
      { label: "MBKM", href: "/pendidikan/mbkm" },
      { label: "Penelitian", href: "/riset/penelitian" },
    ],
  },
]