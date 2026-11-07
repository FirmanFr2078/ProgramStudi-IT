import type { Fasilitas } from "@/types"

const dummy: Fasilitas[] = [
  // Laboratorium
  {
    slug: "lab-jaringan",
    nama: "Laboratorium Jaringan Komputer",
    kategori: "Laboratorium",
    lokasi: "Gedung A, Lantai 2",
    deskripsi: "Laboratorium praktikum jaringan komputer, administrasi server, dan keamanan siber.",
    kapasitas: 30,
    fitur: ["20 unit PC", "Rak server & switch", "Proyektor", "AC"],
  },
  {
    slug: "lab-aplikasi",
    nama: "Laboratorium Pemrograman & Aplikasi",
    kategori: "Laboratorium",
    lokasi: "Gedung A, Lantai 2",
    deskripsi: "Laboratorium praktikum pemrograman web, mobile, dan rekayasa perangkat lunak.",
    kapasitas: 35,
    fitur: ["35 unit PC", "Proyektor", "Whiteboard", "AC"],
  },
  {
    slug: "lab-multimedia",
    nama: "Laboratorium Multimedia & Game",
    kategori: "Laboratorium",
    lokasi: "Gedung A, Lantai 3",
    deskripsi: "Laboratorium produksi multimedia, grafika komputer, dan pengembangan game.",
    kapasitas: 25,
    fitur: ["PC spesifikasi tinggi (GPU dedicated)", "Tablet grafis", "Proyektor"],
  },

  // Ruang Kelas
  {
    slug: "ruang-j31",
    nama: "Ruang Kuliah J.3.1",
    kategori: "Ruang Kelas",
    lokasi: "Gedung J, Lantai 3",
    deskripsi: "Ruang kuliah reguler untuk perkuliahan teori.",
    kapasitas: 40,
    fitur: ["Proyektor", "AC", "Whiteboard"],
  },
  {
    slug: "ruang-j32",
    nama: "Ruang Kuliah J.3.2",
    kategori: "Ruang Kelas",
    lokasi: "Gedung J, Lantai 3",
    deskripsi: "Ruang kuliah reguler untuk perkuliahan teori.",
    kapasitas: 40,
    fitur: ["Proyektor", "AC", "Whiteboard"],
  },
  {
    slug: "aula",
    nama: "Aula Program Studi",
    kategori: "Ruang Kelas",
    lokasi: "Gedung A, Lantai 1",
    deskripsi: "Ruang serbaguna untuk kuliah umum, seminar, dan kegiatan kemahasiswaan.",
    kapasitas: 100,
    fitur: ["Sound system", "Proyektor", "Panggung kecil", "AC"],
  },

  // Gedung
  {
    slug: "gedung-a",
    nama: "Gedung A",
    kategori: "Gedung",
    lokasi: "Kampus Utama Universitas Islam Balitar",
    deskripsi: "Gedung utama Program Studi Teknik Informatika — berisi laboratorium, ruang dosen, dan aula.",
    fitur: ["3 lantai", "Laboratorium", "Ruang dosen", "Aula"],
  },
  {
    slug: "gedung-j",
    nama: "Gedung J",
    kategori: "Gedung",
    lokasi: "Kampus Utama Universitas Islam Balitar",
    deskripsi: "Gedung perkuliahan bersama lintas program studi di lingkungan Fakultas Teknik dan Informatika.",
    fitur: ["3 lantai", "Ruang kuliah reguler"],
  },

  // Perpustakaan
  {
    slug: "perpustakaan-prodi",
    nama: "Ruang Baca Program Studi",
    kategori: "Perpustakaan",
    lokasi: "Gedung A, Lantai 1",
    deskripsi: "Ruang baca dan koleksi referensi khusus bidang informatika, pelengkap Perpustakaan Pusat universitas.",
    kapasitas: 20,
    fitur: ["Koleksi buku & jurnal cetak", "Area baca", "Wi-Fi"],
  },

  // ruang sarana administrasi
  {
    slug: "ruang-kaprodi",
    nama: "Ruang Ketua Program Studi",
    kategori: "sarana administrasi",
    lokasi: "Gedung A, Lantai 1",
    deskripsi: "Ruang kerja Ketua Program Studi untuk konsultasi dan administrasi akademik.",
    fitur: ["Ruang tamu", "AC"],
  },
  {
    slug: "ruang-tata-usaha",
    nama: "Ruang Tata Usaha",
    kategori: "sarana administrasi",
    lokasi: "Gedung A, Lantai 1",
    deskripsi: "Pusat layanan administrasi akademik dan kemahasiswaan program studi.",
    fitur: ["Loket layanan", "AC"],
  },
]

export async function getFasilitas(
  kategori?: Fasilitas["kategori"]
): Promise<Fasilitas[]> {
  if (!kategori) return dummy
  return dummy.filter((f) => f.kategori === kategori)
}