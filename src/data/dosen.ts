import type { Dosen } from "@/types"

const dummy: Dosen[] = [
  {
    slug: "bambang-setiawan",
    nama: "Dr. Bambang Setiawan, M.Kom.",
    nidn: "0012345601",
    jabatanStruktural: "Ketua Program Studi",
    jabatanFungsional: "Lektor Kepala",
    pendidikan: [
      { jenjang: "S1", bidang: "Teknik Informatika", kampus: "Universitas Brawijaya" },
      { jenjang: "S2", bidang: "Ilmu Komputer", kampus: "Institut Teknologi Sepuluh Nopember" },
      { jenjang: "S3", bidang: "Ilmu Komputer", kampus: "Universitas Gadjah Mada" },
    ],
    bidangKeahlian: ["Rekayasa Perangkat Lunak", "Manajemen Proyek TI"],
    mataKuliah: ["Rekayasa Perangkat Lunak", "Manajemen Proyek TI", "Metodologi Penelitian"],
    email: "bambang.setiawan@unisba.ac.id",
    sinta: "https://sinta.kemdikbud.go.id/authors/profile/000000",
    googleScholar: "https://scholar.google.com/citations?user=000000",
  },
  {
    slug: "siti-nurhaliza",
    nama: "Siti Nurhaliza, M.T.",
    nidn: "0023456702",
    jabatanStruktural: "Sekretaris Program Studi",
    jabatanFungsional: "Lektor",
    pendidikan: [
      { jenjang: "S1", bidang: "Teknik Informatika", kampus: "Universitas Islam Balitar" },
      { jenjang: "S2", bidang: "Teknik Elektro", kampus: "Institut Teknologi Sepuluh Nopember" },
    ],
    bidangKeahlian: ["Jaringan Komputer", "Keamanan Siber"],
    mataKuliah: ["Jaringan Komputer", "Keamanan Siber", "Administrasi Jaringan"],
    email: "siti.nurhaliza@unisba.ac.id",
  },
  {
    slug: "agus-prasetyo",
    nama: "Agus Prasetyo, M.Kom.",
    nidn: "0034567803",
    jabatanFungsional: "Asisten Ahli",
    pendidikan: [
      { jenjang: "S1", bidang: "Teknik Informatika", kampus: "Universitas Islam Balitar" },
      { jenjang: "S2", bidang: "Ilmu Komputer", kampus: "Universitas Brawijaya" },
    ],
    bidangKeahlian: ["Kecerdasan Buatan", "Machine Learning"],
    mataKuliah: ["Kecerdasan Buatan", "Pembelajaran Mesin", "Pengolahan Citra Digital"],
    email: "agus.prasetyo@unisba.ac.id",
    sinta: "https://sinta.kemdikbud.go.id/authors/profile/000001",
  },
  {
    slug: "dewi-lestari",
    nama: "Dewi Lestari, M.Kom.",
    nidn: "0045678904",
    jabatanFungsional: "Lektor",
    pendidikan: [
      { jenjang: "S1", bidang: "Sistem Informasi", kampus: "Universitas Islam Balitar" },
      { jenjang: "S2", bidang: "Ilmu Komputer", kampus: "Universitas Gadjah Mada" },
    ],
    bidangKeahlian: ["Data Sains", "Basis Data"],
    mataKuliah: ["Basis Data", "Data Mining", "Visualisasi Data"],
    email: "dewi.lestari@unisba.ac.id",
  },
  {
    slug: "rizal-maulana",
    nama: "Rizal Maulana, M.T.",
    nidn: "0056789005",
    jabatanFungsional: "Tenaga Pengajar",
    pendidikan: [
      { jenjang: "S1", bidang: "Teknik Informatika", kampus: "Universitas Islam Balitar" },
      { jenjang: "S2", bidang: "Teknik Informatika", kampus: "Universitas Brawijaya" },
    ],
    bidangKeahlian: ["Pengembangan Game", "Grafika Komputer"],
    mataKuliah: ["Pemrograman Game", "Grafika Komputer", "Interaksi Manusia dan Komputer"],
    email: "rizal.maulana@unisba.ac.id",
  },
]

export async function getAllDosen(): Promise<Dosen[]> {
  return dummy
}

export async function getDosenBySlug(slug: string): Promise<Dosen | undefined> {
  return dummy.find((d) => d.slug === slug)
}