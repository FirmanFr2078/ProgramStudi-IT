import type { HkiItem } from "@/types"

const dummy: HkiItem[] = [
  {
    id: "1",
    judul: "Aplikasi Monitoring Kehadiran Berbasis QR Code (ARDEN)",
    jenis: "Hak Cipta",
    pencipta: ["Firlian Firman Syah"],
    nomor: "EC00202412345",
    tahun: 2026,
    status: "Terdaftar",
  },
  {
    id: "2",
    judul: "Sistem Informasi Masjid Berbasis PHP Native (Arkan)",
    jenis: "Hak Cipta",
    pencipta: ["Firlian Firman Syah"],
    nomor: "EC00202412346",
    tahun: 2026,
    status: "Terdaftar",
  },
  {
    id: "3",
    judul: "Modul Ajar Kecerdasan Komputasi Berbasis Studi Kasus",
    jenis: "Hak Cipta",
    pencipta: ["Ahmad Rifai, M.Kom"],
    nomor: "EC00202312000",
    tahun: 2025,
    status: "Terdaftar",
  },
]

export async function getHki(): Promise<HkiItem[]> {
  return dummy
}