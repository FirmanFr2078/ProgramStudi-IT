import type { RisetItem } from "@/types"

const dummy: RisetItem[] = [
  { id: "1", judul: "Hak Cipta - Aplikasi Monitoring Kehadiran Berbasis QR Code (ARDEN)", ketua: "Firlian Firman Syah", tahun: 2026, sumberDana: "Mandiri" },
  { id: "2", judul: "Hak Cipta - Sistem Informasi Masjid Berbasis PHP Native (Arkan)", ketua: "Firlian Firman Syah", tahun: 2026, sumberDana: "Mandiri" },
  { id: "3", judul: "Hak Cipta - Modul Ajar Kecerdasan Komputasi Berbasis Studi Kasus", ketua: "Ahmad Rifai, M.Kom", tahun: 2025, sumberDana: "Internal Kampus" },
]

export async function getHki(): Promise<RisetItem[]> {
  return dummy
}