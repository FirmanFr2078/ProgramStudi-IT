import type { Mitra } from "@/types"

const dummy: Mitra[] = [
  {
    slug: "pt-teknologi-nusantara",
    nama: "PT Teknologi Nusantara",
    kategori: "Dunia Usaha & Industri",
    ringkasan: "Penyedia tempat magang dan proyek pengembangan aplikasi bagi mahasiswa.",
    lingkup: ["Magang", "Proyek Bersama", "Rekrutmen Lulusan"],
    deskripsi: [
      "Kerja sama mencakup program magang bersertifikat untuk mahasiswa semester akhir, dengan fokus pada pengembangan aplikasi web dan mobile.",
      "Perusahaan turut memberikan masukan kurikulum agar lulusan lebih siap kerja, serta membuka jalur rekrutmen khusus bagi alumni berprestasi.",
    ],
    mulai: "2024-02-01",
    pic: "Tim HRD & Talent Development",
  },
  {
    slug: "pt-cipta-data-indonesia",
    nama: "PT Cipta Data Indonesia",
    kategori: "Dunia Usaha & Industri",
    ringkasan: "Kolaborasi riset data dan pelatihan data science untuk mahasiswa dan dosen.",
    lingkup: ["Riset Bersama", "Pelatihan", "Sertifikasi"],
    deskripsi: [
      "Program ini menghadirkan pelatihan data science dan sertifikasi kompetensi bagi mahasiswa bidang minat Data Sains.",
      "Dosen dan praktisi perusahaan juga melakukan riset bersama di bidang analitik data untuk sektor UMKM.",
    ],
    mulai: "2025-01-15",
    pic: "Divisi Data & Analytics",
  },
  {
    slug: "universitas-mitra-malang",
    nama: "Universitas Mitra Malang",
    kategori: "Perguruan Tinggi",
    ringkasan: "Pertukaran mahasiswa dan dosen tamu lintas kampus.",
    lingkup: ["Pertukaran Mahasiswa", "Dosen Tamu", "Penelitian Bersama"],
    deskripsi: [
      "Kerja sama memungkinkan mahasiswa mengikuti program pertukaran satu semester melalui skema MBKM.",
      "Kedua kampus juga saling mengirim dosen tamu untuk kuliah umum dan kolaborasi penelitian antar-program studi.",
    ],
    mulai: "2023-08-01",
    berakhir: "2027-08-01",
    pic: "Kantor Kerja Sama Internasional",
  },
  {
    slug: "dinas-kominfo-blitar",
    nama: "Dinas Komunikasi dan Informatika Kabupaten Blitar",
    kategori: "Pemerintah & Instansi",
    ringkasan: "Pengabdian masyarakat dan digitalisasi layanan desa.",
    lingkup: ["Pengabdian Masyarakat", "Digitalisasi Desa", "KKN Tematik"],
    deskripsi: [
      "Mahasiswa dilibatkan dalam program KKN Tematik untuk mendampingi digitalisasi layanan administrasi di desa-desa binaan.",
      "Program ini menjadi sarana implementasi langsung ilmu rekayasa perangkat lunak untuk kebutuhan pelayanan publik.",
    ],
    mulai: "2024-06-01",
    pic: "Bidang Aplikasi Informatika",
  },
  {
    slug: "aptikom",
    nama: "Asosiasi Perguruan Tinggi Informatika dan Komputer (APTIKOM)",
    kategori: "Organisasi Profesi",
    ringkasan: "Penyelarasan kurikulum dan standar kompetensi nasional.",
    lingkup: ["Kurikulum", "Standar Kompetensi", "Seminar Nasional"],
    deskripsi: [
      "Keanggotaan di APTIKOM membantu program studi menyelaraskan kurikulum dengan standar nasional bidang informatika dan komputer.",
      "Program studi juga rutin mengikutsertakan dosen dan mahasiswa dalam seminar serta kompetisi yang diselenggarakan asosiasi.",
    ],
    mulai: "2022-01-01",
    pic: "Sekretariat APTIKOM Wilayah",
  },
  {
    slug: "radio-komunitas-blitar",
    nama: "Radio Komunitas Blitar FM",
    kategori: "Media & Komunitas",
    ringkasan: "Publikasi kegiatan prodi dan edukasi literasi digital masyarakat.",
    lingkup: ["Publikasi", "Edukasi Publik", "Siaran Bersama"],
    deskripsi: [
      "Kerja sama meliputi siaran rutin bertema literasi digital yang diisi oleh dosen dan mahasiswa program studi.",
      "Kegiatan dan pencapaian program studi juga dipublikasikan secara berkala melalui media ini.",
    ],
    mulai: "2025-03-01",
    pic: "Bagian Siaran & Produksi",
  },
]

// Nanti isi fungsi ini diganti query database; pemanggilnya tidak berubah.
export async function getKerjaSama(): Promise<Mitra[]> {
  return dummy
}