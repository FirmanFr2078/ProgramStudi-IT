import type { Tendik } from "@/types"

// DUMMY: nama dan kontak sengaja diberi "Contoh". Satu unit satu orang.
const dummy: Tendik[] = [
  {
    slug: "andi-contoh",
    nama: "Andi Contoh, S.Kom.",
    jabatan: "Koordinator Administrasi",
    unitKerja: "Tata Usaha",
    tugas: [
      "Mengoordinasikan layanan administrasi program studi",
      "Mengelola arsip surat masuk dan keluar",
      "Menjadi penghubung antara prodi, fakultas, dan mahasiswa",
    ],
    lokasi: "Ruang Tata Usaha, Gedung A lantai 1",
    jamLayanan: "Senin–Jumat, 08.00–15.00",
    pendidikan: "S1 Sistem Informasi",
    email: "andi@contoh.ac.id",
    telepon: "(0342) 000-001",
  },
  {
    slug: "rina-contoh",
    nama: "Rina Contoh, S.Pd.",
    jabatan: "Staf Administrasi Akademik",
    unitKerja: "Layanan Akademik",
    tugas: [
      "Melayani legalisir dan surat keterangan mahasiswa",
      "Mengelola data nilai dan jadwal perkuliahan",
      "Membantu proses pendaftaran ujian dan yudisium",
    ],
    lokasi: "Ruang Layanan Akademik, Gedung A lantai 1",
    jamLayanan: "Senin–Jumat, 08.00–15.00",
    pendidikan: "S1 Pendidikan",
    email: "rina@contoh.ac.id",
    telepon: "(0342) 000-002",
  },
  {
    slug: "budi-contoh",
    nama: "Budi Contoh, S.T.",
    jabatan: "Laboran",
    unitKerja: "Laboratorium",
    tugas: [
      "Menyiapkan dan merawat perangkat laboratorium komputer",
      "Mendampingi praktikum mahasiswa",
      "Mengelola jadwal penggunaan laboratorium",
    ],
    lokasi: "Ruang Laboran, Gedung B lantai 2",
    jamLayanan: "Senin–Sabtu, 08.00–16.00",
    pendidikan: "S1 Teknik Informatika",
    email: "budi@contoh.ac.id",
  },
  {
    slug: "sari-contoh",
    nama: "Sari Contoh, S.I.Pust.",
    jabatan: "Pustakawan",
    unitKerja: "Perpustakaan",
    tugas: [
      "Melayani peminjaman dan pengembalian koleksi",
      "Mengelola katalog dan koleksi jurnal",
      "Membimbing pengunjung menelusuri sumber referensi",
    ],
    lokasi: "Perpustakaan Fakultas, Gedung C lantai 1",
    jamLayanan: "Senin–Jumat, 08.00–16.00",
    pendidikan: "S1 Ilmu Perpustakaan",
    email: "sari@contoh.ac.id",
    telepon: "(0342) 000-004",
  },
  {
    slug: "dedi-contoh",
    nama: "Dedi Contoh, S.E.",
    jabatan: "Staf Keuangan",
    unitKerja: "Keuangan & Umum",
    tugas: [
      "Melayani administrasi pembayaran kuliah",
      "Menyusun laporan keuangan prodi",
      "Mengelola inventaris sarana dan prasarana",
    ],
    lokasi: "Ruang Keuangan, Gedung A lantai 1",
    jamLayanan: "Senin–Jumat, 08.00–15.00",
    pendidikan: "S1 Akuntansi",
    email: "dedi@contoh.ac.id",
  },
]

export async function getAllTendik(): Promise<Tendik[]> {
  return dummy
}

export async function getTendikBySlug(slug: string): Promise<Tendik | undefined> {
  return dummy.find((t) => t.slug === slug)
}