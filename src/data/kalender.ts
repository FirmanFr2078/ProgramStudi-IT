import type { Dokumen, TanggalPenting } from "@/types"

const tanggalPenting: TanggalPenting[] = [
  { id: "1", mulai: "2026-09-01", keterangan: "Awal Perkuliahan Semester Ganjil" },
  { id: "2", mulai: "2026-10-13", selesai: "2026-10-18", keterangan: "Ujian Tengah Semester (UTS)" },
  { id: "3", mulai: "2026-12-08", selesai: "2026-12-13", keterangan: "Ujian Akhir Semester (UAS)" },
  { id: "4", mulai: "2026-12-22", selesai: "2027-01-04", keterangan: "Libur Semester Ganjil" },
  { id: "5", mulai: "2027-01-05", keterangan: "Awal Perkuliahan Semester Genap" },
]

const dokumen: Dokumen[] = [
  { id: "1", label: "SK Kalender Akademik 2026/2027", url: "#", aktif: true },
  { id: "2", label: "SK Kalender Akademik 2025/2026", url: "#" },
  { id: "3", label: "SK Kalender Akademik 2024/2025", url: "#" },
]

export async function getDokumenKalender(): Promise<Dokumen[]> {
  return dokumen
}

export async function getTanggalPenting(): Promise<TanggalPenting[]> {
  return tanggalPenting
}