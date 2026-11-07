import type { Berita } from "@/types"

const dummy: Berita[] = [
  {
    slug: "penerimaan-mahasiswa-baru-2027",
    judul: "Penerimaan Mahasiswa Baru 2027 Dibuka",
    ringkasan: "Pendaftaran gelombang pertama dibuka hingga Januari.",
    kategori: "Pengumuman",
    tanggal: "2026-11-02",
  },
  // ...
]

// Nanti isi fungsi ini diganti query database; pemanggilnya tidak berubah.
export async function getBerita(limit?: number): Promise<Berita[]> {
  return limit ? dummy.slice(0, limit) : dummy
}