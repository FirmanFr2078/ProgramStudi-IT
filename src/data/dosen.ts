import type { Dosen } from "@/types"

// PLACEHOLDER. Seluruh identitas (nama, NIDN, email, tautan publikasi) belum data resmi.
// Ganti dengan data prodi sebelum dipublikasikan.
const dummy: Dosen[] = [
  {
    slug: "dosen-1",
    nama: "Nama Dosen 1",
    nidn: "0000000001",
    jabatanStruktural: "Ketua Program Studi",
    jabatanFungsional: "Lektor",
    pendidikan: [
      { jenjang: "S1", bidang: "Bidang S1", kampus: "Perguruan Tinggi" },
      { jenjang: "S2", bidang: "Bidang S2", kampus: "Perguruan Tinggi" },
      { jenjang: "S3", bidang: "Bidang S3", kampus: "Perguruan Tinggi" },
    ],
    bidangKeahlian: ["Bidang Keahlian 1", "Bidang Keahlian 2"],
    mataKuliah: ["Mata Kuliah 1", "Mata Kuliah 2", "Mata Kuliah 3"],
    email: "email.dosen1@unisba.ac.id",
  },
  {
    slug: "dosen-2",
    nama: "Nama Dosen 2",
    nidn: "0000000002",
    jabatanStruktural: "Sekretaris Program Studi",
    jabatanFungsional: "Lektor",
    pendidikan: [
      { jenjang: "S1", bidang: "Bidang S1", kampus: "Perguruan Tinggi" },
      { jenjang: "S2", bidang: "Bidang S2", kampus: "Perguruan Tinggi" },
    ],
    bidangKeahlian: ["Bidang Keahlian 1", "Bidang Keahlian 2"],
    mataKuliah: ["Mata Kuliah 1", "Mata Kuliah 2", "Mata Kuliah 3"],
    email: "email.dosen2@unisba.ac.id",
  },
  {
    slug: "dosen-3",
    nama: "Nama Dosen 3",
    nidn: "0000000003",
    jabatanFungsional: "Lektor",
    pendidikan: [
      { jenjang: "S1", bidang: "Bidang S1", kampus: "Perguruan Tinggi" },
      { jenjang: "S2", bidang: "Bidang S2", kampus: "Perguruan Tinggi" },
    ],
    bidangKeahlian: ["Bidang Keahlian 1", "Bidang Keahlian 2"],
    mataKuliah: ["Mata Kuliah 1", "Mata Kuliah 2", "Mata Kuliah 3"],
    email: "email.dosen3@unisba.ac.id",
  },
  {
    slug: "dosen-4",
    nama: "Nama Dosen 4",
    nidn: "0000000004",
    jabatanFungsional: "Lektor",
    pendidikan: [
      { jenjang: "S1", bidang: "Bidang S1", kampus: "Perguruan Tinggi" },
      { jenjang: "S2", bidang: "Bidang S2", kampus: "Perguruan Tinggi" },
    ],
    bidangKeahlian: ["Bidang Keahlian 1", "Bidang Keahlian 2"],
    mataKuliah: ["Mata Kuliah 1", "Mata Kuliah 2", "Mata Kuliah 3"],
    email: "email.dosen4@unisba.ac.id",
  },
  {
    slug: "dosen-5",
    nama: "Nama Dosen 5",
    nidn: "0000000005",
    jabatanFungsional: "Lektor",
    pendidikan: [
      { jenjang: "S1", bidang: "Bidang S1", kampus: "Perguruan Tinggi" },
      { jenjang: "S2", bidang: "Bidang S2", kampus: "Perguruan Tinggi" },
    ],
    bidangKeahlian: ["Bidang Keahlian 1", "Bidang Keahlian 2"],
    mataKuliah: ["Mata Kuliah 1", "Mata Kuliah 2", "Mata Kuliah 3"],
    email: "email.dosen5@unisba.ac.id",
  },
]

export async function getAllDosen(): Promise<Dosen[]> {
  return dummy
}

export async function getDosenBySlug(slug: string): Promise<Dosen | undefined> {
  return dummy.find((d) => d.slug === slug)
}
