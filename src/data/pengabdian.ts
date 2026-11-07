import type { RisetItem } from "@/types"

const dummy: RisetItem[] = [
  { id: "1", judul: "Workshop Modul Pembelajaran Berbasis AI di SMK Ali Utsman Gondanglegi", ketua: "Budi Santoso, M.T", anggota: ["Dewi Lestari, M.Kom"], tahun: 2026, sumberDana: "Internal Kampus" },
  { id: "2", judul: "Pelatihan Digital Marketing bagi UMKM Desa Garum", ketua: "Siti Nurhaliza, M.Kom", tahun: 2026, sumberDana: "Mandiri" },
  { id: "3", judul: "Pendampingan Literasi Digital untuk Perangkat Desa", ketua: "Agus Prasetyo, M.T", anggota: ["Fajar Nugroho, M.T"], tahun: 2025, sumberDana: "Internal Kampus" },
  { id: "4", judul: "Pelatihan Pembuatan Website Sederhana bagi Guru SMA/SMK", ketua: "Rina Wulandari, M.Kom", tahun: 2024, sumberDana: "Hibah Kemendikbud" },
]

export async function getPengabdian(): Promise<RisetItem[]> {
  return dummy
}