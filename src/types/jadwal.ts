export type Hari = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat"

export type JadwalItem = {
  id: string
  hari: Hari
  jamMulai: string // "07:00"
  jamSelesai: string // "08:40"
  mataKuliah: string
  sks: number
  kelas: string // "TI 4A"
  dosen: string
  ruang: string
}

export const HARI_URUT: Hari[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]