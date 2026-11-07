export type Kabar = {
  slug: string
  judul: string
  ringkasan: string
  konten: string[] // paragraf isi berita, untuk halaman detail
  kategori: "Berita" | "Pengumuman"
  tanggal: string // ISO, contoh "2026-11-02"
  gambar?: string // opsional — kalau kosong, kartu pakai latar gradasi
}