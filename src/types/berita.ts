export type Berita = {
  slug: string
  judul: string
  ringkasan: string
  kategori: "Berita" | "Pengumuman"
  tanggal: string // ISO, contoh "2026-11-02"
  gambar?: string // opsional — kalau kosong, kartu pakai latar gradasi
}