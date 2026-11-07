import type { JadwalItem } from "@/types"

const dummy: JadwalItem[] = [
  { id: "1", hari: "Senin", jamMulai: "07:00", jamSelesai: "09:30", mataKuliah: "Pemrograman Web Lanjut", sks: 3, kelas: "TI 4A", dosen: "Saiful Nur Budiman, M.Kom", ruang: "Lab Aplikasi" },
  { id: "2", hari: "Senin", jamMulai: "09:40", jamSelesai: "11:20", mataKuliah: "Jaringan Komputer", sks: 3, kelas: "TI 4B", dosen: "—", ruang: "Lab Jaringan" },
  { id: "3", hari: "Selasa", jamMulai: "08:00", jamSelesai: "10:30", mataKuliah: "Rekayasa Perangkat Lunak", sks: 3, kelas: "TI 4B", dosen: "—", ruang: "Ruang J.3.1" },
  { id: "4", hari: "Rabu", jamMulai: "07:00", jamSelesai: "08:40", mataKuliah: "Statistika", sks: 2, kelas: "TI 4A", dosen: "—", ruang: "Ruang J.3.2" },
  { id: "5", hari: "Kamis", jamMulai: "13:00", jamSelesai: "15:30", mataKuliah: "Kewirausahaan", sks: 2, kelas: "TI 4A", dosen: "—", ruang: "Aula" },
  { id: "6", hari: "Jumat", jamMulai: "07:00", jamSelesai: "09:30", mataKuliah: "Aplikasi Pemrograman Web Lanjut", sks: 3, kelas: "TI 4B", dosen: "—", ruang: "Lab Aplikasi" },
]

// Nanti isi fungsi ini diganti query database/SIAKAD; pemanggilnya tidak berubah.
export async function getJadwal(): Promise<JadwalItem[]> {
  return dummy
}