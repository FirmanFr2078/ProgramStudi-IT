export type FaqItem = {
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    question: "Apa saja jalur pendaftaran yang tersedia?",
    answer:
      "Ada tiga jalur: reguler (tes seleksi), prestasi (nilai rapor/sertifikat), dan mandiri (gelombang khusus di luar jadwal reguler). Info lengkap dan jadwal tiap jalur ada di halaman Info Pendaftaran.",
  },
  {
    question:
      "Apa bedanya konsentrasi Software Development, Data Sains, dan Jaringan & Keamanan?",
    answer:
      "Ketiganya adalah bidang minat yang bisa dipilih mulai semester 4–5. Software Development fokus ke pengembangan aplikasi, Data Sains ke pengolahan dan analisis data, sementara Jaringan & Keamanan fokus ke infrastruktur jaringan dan keamanan siber. Detail kurikulum tiap bidang ada di halaman Kurikulum.",
  },
  {
    question: "Apakah ada kelas karyawan atau kuliah malam?",
    answer:
      "Saat ini perkuliahan reguler berlangsung pagi–siang hari. Untuk jadwal kelas karyawan, silakan hubungi bagian akademik lewat halaman Kontak untuk info ketersediaan di tahun ajaran berjalan.",
  },
  {
    question: "Berapa lama masa studi normal di Teknik Informatika?",
    answer:
      "Masa studi normal adalah 4 tahun (8 semester), dengan beban total 144 SKS. Mahasiswa yang mengambil SKS maksimal tiap semester dimungkinkan lulus lebih cepat.",
  },
  {
    question: "Apakah ada kerja sama magang atau penyaluran kerja?",
    answer:
      "Ada, lewat program magang bersama mitra industri serta bursa kerja yang diselenggarakan secara berkala. Daftar mitra dan info magang bisa dilihat di halaman Kerja Sama.",
  },
]