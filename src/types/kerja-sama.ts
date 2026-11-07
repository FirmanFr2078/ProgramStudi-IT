export type KategoriMitra =
  | "Dunia Usaha & Industri"
  | "Perguruan Tinggi"
  | "Pemerintah & Instansi"
  | "Organisasi Profesi"
  | "Media & Komunitas"

export type Mitra = {
  slug: string
  nama: string
  kategori: KategoriMitra
  ringkasan: string // satu kalimat, tampil di kartu
  lingkup: string[] // tag ringkas: "Magang", "Riset Bersama", dst
  deskripsi: string[] // paragraf lengkap, tampil di detail
  mulai: string // ISO date
  berakhir?: string // ISO date, kosong = masih berjalan
  pic?: string // kontak/penanggung jawab
}