import type { Dokumen, MataKuliah } from "@/types"

const matkul: MataKuliah[] = [
  { kode: "TI101", nama: "Pengantar Teknik Informatika", sks: 3, jenis: "Wajib", semester: 1 },
  { kode: "TI102", nama: "Matematika Diskrit", sks: 3, jenis: "Wajib", semester: 1 },
  { kode: "TI103", nama: "Algoritma dan Pemrograman", sks: 4, jenis: "Wajib", semester: 1 },
  { kode: "TI104", nama: "Bahasa Inggris", sks: 2, jenis: "Wajib", semester: 1 },

  { kode: "TI201", nama: "Struktur Data", sks: 4, jenis: "Wajib", semester: 2 },
  { kode: "TI202", nama: "Basis Data", sks: 3, jenis: "Wajib", semester: 2 },
  { kode: "TI203", nama: "Statistika", sks: 2, jenis: "Wajib", semester: 2 },

  { kode: "TI301", nama: "Pemrograman Web", sks: 3, jenis: "Wajib", semester: 3 },
  { kode: "TI302", nama: "Jaringan Komputer", sks: 3, jenis: "Wajib", semester: 3 },
  { kode: "TI303", nama: "Sistem Operasi", sks: 3, jenis: "Wajib", semester: 3 },

  { kode: "TI401", nama: "Pemrograman Web Lanjut", sks: 3, jenis: "Wajib", semester: 4 },
  { kode: "TI402", nama: "Rekayasa Perangkat Lunak", sks: 3, jenis: "Wajib", semester: 4 },
  { kode: "TI403", nama: "Kecerdasan Komputasi", sks: 3, jenis: "Wajib", semester: 4 },
  { kode: "TI404", nama: "Kewirausahaan", sks: 2, jenis: "Wajib", semester: 4 },

  { kode: "TI501", nama: "Pembelajaran Mesin", sks: 3, jenis: "Pilihan", semester: 5 },
  { kode: "TI502", nama: "Keamanan Jaringan", sks: 3, jenis: "Pilihan", semester: 5 },
  { kode: "TI503", nama: "Metodologi Penelitian", sks: 2, jenis: "Wajib", semester: 5 },

  { kode: "TI601", nama: "Pemrograman Mobile", sks: 3, jenis: "Pilihan", semester: 6 },
  { kode: "TI602", nama: "Komputasi Awan", sks: 3, jenis: "Pilihan", semester: 6 },
  { kode: "TI603", nama: "Praktik Kerja Lapangan", sks: 2, jenis: "Wajib", semester: 6 },

  { kode: "TI701", nama: "Seminar Proposal", sks: 2, jenis: "Wajib", semester: 7 },
  { kode: "TI702", nama: "Mata Kuliah Pilihan Lanjut", sks: 3, jenis: "Pilihan", semester: 7 },

  { kode: "TI801", nama: "Skripsi", sks: 6, jenis: "Wajib", semester: 8 },
]

const dokumen: Dokumen[] = [
  { id: "1", label: "Buku Kurikulum 2025", url: "#", aktif: true },
  { id: "2", label: "Panduan Transisi Kurikulum", url: "#" },
]

export async function getMataKuliah(): Promise<MataKuliah[]> {
  return matkul
}

export async function getDokumenKurikulum(): Promise<Dokumen[]> {
  return dokumen
}