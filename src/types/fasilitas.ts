export type KategoriFasilitas =
  | "Laboratorium"
  | "Ruang Kelas"
  | "Gedung"
  | "Perpustakaan"
  | "sarana administrasi"

export type Fasilitas = {
  slug: string
  nama: string
  kategori: KategoriFasilitas
  foto?: string // path di public, mis. "/fasilitas/lab-jaringan.jpg"
  lokasi: string // mis. "Gedung A, Lantai 2"
  deskripsi: string
  kapasitas?: number // jumlah orang/kursi; tidak semua kategori punya ini
  fitur: string[]
}