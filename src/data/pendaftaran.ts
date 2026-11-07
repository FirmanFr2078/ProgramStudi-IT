import type { JalurPendaftaran, LangkahMbkm } from "@/types"

const jalur: JalurPendaftaran[] = [
  {
    nama: "Reguler",
    deskripsi:
      "Jalur seleksi melalui tes tertulis dan wawancara, dibuka setiap gelombang pendaftaran.",
    syarat: [
      "Lulusan SMA/SMK/MA sederajat",
      "Mengikuti tes seleksi masuk",
      "Mengisi formulir pendaftaran online",
    ],
  },
  {
    nama: "Prestasi",
    deskripsi:
      "Jalur tanpa tes bagi calon mahasiswa dengan nilai rapor atau prestasi akademik/non-akademik yang memenuhi syarat.",
    syarat: [
      "Nilai rapor rata-rata minimal sesuai ketentuan",
      "Melampirkan bukti prestasi (jika ada)",
      "Verifikasi berkas oleh panitia",
    ],
  },
  {
    nama: "Mandiri",
    deskripsi:
      "Jalur gelombang khusus di luar jadwal reguler, untuk melengkapi kuota program studi.",
    syarat: [
      "Lulusan SMA/SMK/MA sederajat",
      "Mengikuti tes seleksi mandiri",
      "Kuota terbatas",
    ],
  },
]

const tahapan: LangkahMbkm[] = [
  {
    id: "1",
    judul: "Pendaftaran Online",
    deskripsi: "Isi formulir dan unggah berkas melalui portal PMB.",
  },
  {
    id: "2",
    judul: "Seleksi",
    deskripsi:
      "Tes tertulis/wawancara atau verifikasi berkas, sesuai jalur yang dipilih.",
  },
  {
    id: "3",
    judul: "Pengumuman",
    deskripsi:
      "Hasil seleksi diumumkan melalui portal PMB dan email terdaftar.",
  },
  {
    id: "4",
    judul: "Daftar Ulang",
    deskripsi:
      "Mahasiswa yang diterima melakukan daftar ulang dan pembayaran biaya kuliah.",
  },
]

export async function getJalurPendaftaran(): Promise<JalurPendaftaran[]> {
  return jalur
}

export async function getTahapPendaftaran(): Promise<LangkahMbkm[]> {
  return tahapan
}