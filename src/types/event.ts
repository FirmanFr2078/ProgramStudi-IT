export type Event = {
  slug: string
  judul: string
  ringkasan: string
  konten: string[]
  kategori: "Seminar" | "Workshop" | "Lomba" | "Kuliah Umum" | "Lainnya"
  tanggalMulai: string // ISO
  tanggalSelesai?: string // ISO, kalau acara berlangsung lebih dari 1 hari
  waktu?: string // contoh "09:00 - 12:00 WIB"
  lokasi: string
  tautanDaftar?: string
  gambar?: string
}