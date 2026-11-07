import type { Alumni } from "@/types"

const dummy: Alumni[] = [
  { id: "1", nama: "Ilham Maulana", nim: "19650001", tahunLulus: 2023, statusKarier: "Bekerja", pekerjaan: "Software Engineer di PT Teknologi Nusantara" },
  { id: "2", nama: "Putri Ayu Lestari", nim: "19650002", tahunLulus: 2023, statusKarier: "Bekerja", pekerjaan: "QA Engineer di PT Cipta Data Indonesia" },
  { id: "3", nama: "Reza Pratama", nim: "19650003", tahunLulus: 2023, statusKarier: "Wirausaha", pekerjaan: "Pendiri studio digital \"Rekaya Kreasi\"" },
  { id: "4", nama: "Nadia Salsabila", nim: "20650001", tahunLulus: 2024, statusKarier: "Bekerja", pekerjaan: "Data Analyst di Bank Daerah Jawa Timur" },
  { id: "5", nama: "Fajar Setiawan", nim: "20650002", tahunLulus: 2024, statusKarier: "Melanjutkan Studi", pekerjaan: "Magister Ilmu Komputer, Universitas Brawijaya" },
  { id: "6", nama: "Anisa Rahma", nim: "20650003", tahunLulus: 2024, statusKarier: "Bekerja", pekerjaan: "Frontend Developer di PT Teknologi Nusantara" },
  { id: "7", nama: "Yusuf Ardiansyah", nim: "20650004", tahunLulus: 2024, statusKarier: "Mencari Kerja" },
  { id: "8", nama: "Lintang Kurniawan", nim: "21650001", tahunLulus: 2025, statusKarier: "Bekerja", pekerjaan: "Network Engineer di Dinas Kominfo Kabupaten Blitar" },
  { id: "9", nama: "Shafira Zahra", nim: "21650002", tahunLulus: 2025, statusKarier: "Wirausaha", pekerjaan: "Pendiri toko daring \"Blitar Kriya\"" },
  { id: "10", nama: "Doni Pranata", nim: "21650003", tahunLulus: 2025, statusKarier: "Bekerja", pekerjaan: "Backend Developer di PT Cipta Data Indonesia" },
  { id: "11", nama: "Melati Sukma", nim: "21650004", tahunLulus: 2025, statusKarier: "Melanjutkan Studi", pekerjaan: "Magister Teknik Informatika, Institut Teknologi Sepuluh Nopember" },
  { id: "12", nama: "Candra Wijaya", nim: "18650001", tahunLulus: 2022, statusKarier: "Bekerja", pekerjaan: "IT Support di Universitas Islam Balitar" },
  { id: "13", nama: "Ratna Dewanti", nim: "18650002", tahunLulus: 2022, statusKarier: "Bekerja", pekerjaan: "Mobile Developer di startup lokal" },
  { id: "14", nama: "Teguh Imam Santoso", nim: "18650003", tahunLulus: 2022, statusKarier: "Mencari Kerja" },
  { id: "15", nama: "Wulan Permatasari", nim: "17650001", tahunLulus: 2021, statusKarier: "Bekerja", pekerjaan: "Guru Informatika di SMK Negeri 1 Blitar" },
  { id: "16", nama: "Hendra Gunawan", nim: "17650002", tahunLulus: 2021, statusKarier: "Wirausaha", pekerjaan: "Pendiri jasa servis komputer \"Gunawan Teknik\"" },
  { id: "17", nama: "Eka Novitasari", nim: "22650001", tahunLulus: 2026, statusKarier: "Bekerja", pekerjaan: "Junior Programmer di PT Teknologi Nusantara" },
  { id: "18", nama: "Arif Budiman", nim: "22650002", tahunLulus: 2026, statusKarier: "Melanjutkan Studi", pekerjaan: "Magister Manajemen Teknologi Informasi" },
]

// Nanti isi fungsi ini diganti query database (bisa ratusan baris, paginasi tetap di client sudah siap).
export async function getAlumni(): Promise<Alumni[]> {
  return dummy
}