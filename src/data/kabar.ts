import type { Kabar } from "@/types"

const dummy: Kabar[] = [
  {
    slug: "penerimaan-mahasiswa-baru-2027",
    judul: "Penerimaan Mahasiswa Baru 2027 Dibuka",
    ringkasan: "Pendaftaran gelombang pertama dibuka hingga Januari.",
    konten: [
      "Program Studi Teknik Informatika resmi membuka penerimaan mahasiswa baru tahun ajaran 2027/2028 melalui tiga jalur: reguler, prestasi, dan mandiri.",
      "Gelombang pertama dibuka mulai sekarang hingga akhir Januari 2027. Calon mahasiswa dapat mendaftar secara online melalui portal PMB dan melengkapi berkas sesuai jalur yang dipilih.",
      "Informasi lengkap mengenai syarat, biaya, dan jadwal tahapan seleksi dapat dilihat pada halaman Info Pendaftaran.",
    ],
    kategori: "Pengumuman",
    tanggal: "2026-11-02",
  },
  {
    slug: "mahasiswa-ti-juara-nasional-hackathon",
    judul: "Tim Mahasiswa TI Raih Juara Nasional Hackathon",
    ringkasan:
      "Tiga mahasiswa semester 5 berhasil membawa pulang gelar juara 1 pada ajang hackathon tingkat nasional.",
    konten: [
      "Tim mahasiswa Program Studi Teknik Informatika berhasil meraih juara 1 pada ajang hackathon tingkat nasional yang diselenggarakan secara daring akhir Oktober lalu.",
      "Tim yang beranggotakan tiga mahasiswa semester 5 ini mengangkat solusi berbasis aplikasi untuk membantu UMKM mengelola stok barang secara sederhana dan terjangkau.",
      "Prestasi ini menambah daftar capaian mahasiswa program studi di tingkat nasional sepanjang tahun ini.",
    ],
    kategori: "Berita",
    tanggal: "2026-10-28",
  },
  {
    slug: "jadwal-ujian-tengah-semester-ganjil-2026-2027",
    judul: "Jadwal Ujian Tengah Semester Ganjil 2026/2027",
    ringkasan:
      "UTS semester ganjil dilaksanakan serentak mulai minggu ketiga Oktober.",
    konten: [
      "Ujian Tengah Semester (UTS) ganjil tahun ajaran 2026/2027 dilaksanakan serentak mulai minggu ketiga bulan Oktober sesuai kalender akademik.",
      "Jadwal lengkap per mata kuliah dapat dilihat pada halaman Jadwal. Mahasiswa diharapkan memeriksa jadwal ujiannya masing-masing sebelum hari pelaksanaan.",
    ],
    kategori: "Pengumuman",
    tanggal: "2026-10-20",
  },
  {
    slug: "kunjungan-industri-ke-perusahaan-teknologi",
    judul: "Kunjungan Industri ke Perusahaan Teknologi",
    ringkasan:
      "Mahasiswa semester 7 mengikuti kunjungan industri untuk melihat langsung praktik pengembangan perangkat lunak di dunia kerja.",
    konten: [
      "Sebagai bagian dari mata kuliah Kerja Praktik, mahasiswa semester 7 mengikuti kunjungan industri ke salah satu perusahaan pengembang perangkat lunak di Jawa Timur.",
      "Kegiatan ini bertujuan memberikan gambaran nyata tentang alur kerja tim pengembang, mulai dari perencanaan produk hingga rilis aplikasi.",
    ],
    kategori: "Berita",
    tanggal: "2026-10-12",
  },
  {
    slug: "workshop-keamanan-siber-bersama-praktisi",
    judul: "Workshop Keamanan Siber bersama Praktisi Industri",
    ringkasan:
      "Program studi mengadakan workshop keamanan siber dasar untuk mahasiswa bidang minat Jaringan & Keamanan.",
    konten: [
      "Program Studi Teknik Informatika mengadakan workshop keamanan siber dasar yang diisi langsung oleh praktisi industri.",
      "Workshop ini membahas dasar-dasar keamanan jaringan, pengenalan ethical hacking, dan simulasi penanganan insiden keamanan sederhana.",
      "Kegiatan ini terbuka untuk mahasiswa bidang minat Jaringan & Keamanan maupun mahasiswa lain yang tertarik mendalami topik ini.",
    ],
    kategori: "Berita",
    tanggal: "2026-09-30",
  },
  {
    slug: "perpanjangan-masa-pengisian-krs",
    judul: "Perpanjangan Masa Pengisian KRS",
    ringkasan:
      "Masa pengisian Kartu Rencana Studi (KRS) diperpanjang hingga akhir minggu ini.",
    konten: [
      "Sehubungan dengan kendala teknis pada sistem akademik, masa pengisian Kartu Rencana Studi (KRS) semester ganjil diperpanjang hingga akhir minggu ini.",
      "Mahasiswa yang belum menyelesaikan pengisian KRS dimohon segera melakukannya sebelum batas waktu yang ditentukan.",
    ],
    kategori: "Pengumuman",
    tanggal: "2026-09-15",
  },
]

/**
 * Semua Kabar, terbaru lebih dulu.
 * Nanti isi fungsi ini diganti query database; pemanggilnya tidak berubah.
 */
export async function getAllKabar(): Promise<Kabar[]> {
  return [...dummy].sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1))
}

export async function getKabar(limit?: number): Promise<Kabar[]> {
  const all = await getAllKabar()
  return limit ? all.slice(0, limit) : all
}

export async function getKabarBySlug(slug: string): Promise<Kabar | undefined> {
  return dummy.find((b) => b.slug === slug)
}