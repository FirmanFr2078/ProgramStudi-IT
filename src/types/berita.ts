export type Berita = {
  slug: string
  judul: string
  ringkasan: string
  kategori: "Berita" | "Pengumuman"
  tanggal: string // ISO, contoh "2026-11-02"
}