import type { Event } from "@/types"

const dummy: Event[] = [
  {
    slug: "hackathon-informatika-2027",
    judul: "Hackathon Teknik Informatika 2027",
    ringkasan: "Kompetisi coding 24 jam untuk mahasiswa se-Jawa Timur, tema smart city.",
    konten: [
      "HMPS Teknik Informatika kembali menggelar Hackathon tahunan, kali ini mengangkat tema Smart City untuk mendorong peserta membangun solusi berbasis teknologi bagi permasalahan perkotaan.",
      "Terbuka untuk mahasiswa aktif program studi Informatika dan sejenis se-Jawa Timur, berkelompok maksimal 3 orang.",
    ],
    kategori: "Lomba",
    tanggalMulai: "2027-01-17",
    tanggalSelesai: "2027-01-18",
    waktu: "08:00 WIB - selesai",
    lokasi: "Gedung J, Universitas Islam Balitar",
    tautanDaftar: "#",
  },
  {
    slug: "workshop-ai-untuk-pemula",
    judul: "Workshop: Membangun Aplikasi AI untuk Pemula",
    ringkasan: "Pelatihan praktis membangun aplikasi berbasis AI menggunakan Python.",
    konten: [
      "Workshop sehari khusus mahasiswa semester awal yang ingin mengenal dasar pengembangan aplikasi berbasis kecerdasan buatan secara langsung dan praktis.",
    ],
    kategori: "Workshop",
    tanggalMulai: "2026-12-05",
    waktu: "13:00 - 16:00 WIB",
    lokasi: "Lab Aplikasi, Gedung J Lt. 3",
    tautanDaftar: "#",
  },
  {
    slug: "seminar-nasional-keamanan-siber",
    judul: "Seminar Nasional Keamanan Siber",
    ringkasan: "Menghadirkan praktisi keamanan siber dari industri nasional.",
    konten: [
      "Seminar membahas tren ancaman siber terkini dan peluang karier di bidang keamanan informasi, menghadirkan pembicara dari kalangan industri dan akademisi.",
    ],
    kategori: "Seminar",
    tanggalMulai: "2026-11-22",
    waktu: "09:00 - 12:00 WIB",
    lokasi: "Aula Universitas Islam Balitar",
    tautanDaftar: "#",
  },
  {
    slug: "kuliah-umum-karier-di-industri-teknologi",
    judul: "Kuliah Umum: Karier di Industri Teknologi",
    ringkasan: "Berbagi pengalaman dari alumni yang berkarier di perusahaan teknologi.",
    konten: [
      "Kuliah umum menghadirkan alumni Program Studi Teknik Informatika yang kini berkarier sebagai profesional di industri teknologi, berbagi pengalaman dan tips memasuki dunia kerja.",
    ],
    kategori: "Kuliah Umum",
    tanggalMulai: "2026-10-14",
    waktu: "10:00 - 12:00 WIB",
    lokasi: "Aula Universitas Islam Balitar",
  },
  {
    slug: "workshop-modul-ai-smk-mitra",
    judul: "Workshop Modul Pembelajaran Berbasis AI",
    ringkasan: "Pelatihan bagi guru SMK mitra dalam menyusun modul ajar berbasis AI.",
    konten: [
      "Prodi TI menggelar workshop bagi guru-guru SMK mitra untuk membekali penyusunan modul pembelajaran yang memanfaatkan teknologi AI di kelas.",
    ],
    kategori: "Workshop",
    tanggalMulai: "2026-08-29",
    waktu: "08:00 - 15:00 WIB",
    lokasi: "SMK Ali Utsman, Gondanglegi",
  },
]

export async function getAllEvent(): Promise<Event[]> {
  return dummy
}

export async function getEvent(limit?: number): Promise<Event[]> {
  return limit ? dummy.slice(0, limit) : dummy
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  return dummy.find((e) => e.slug === slug)
}