export type JabatanFungsional =
  | "Tenaga Pengajar"
  | "Asisten Ahli"
  | "Lektor"
  | "Lektor Kepala"
  | "Guru Besar"

export type RiwayatPendidikan = {
  jenjang: "S1" | "S2" | "S3"
  bidang: string
  kampus: string
}

export type Dosen = {
  slug: string
  nama: string // termasuk gelar, mis. "Dr. Ahmad Fauzi, M.Kom."
  nidn: string
  jabatanStruktural?: string // kosong = dosen biasa, bukan berarti error
  jabatanFungsional: JabatanFungsional
  pendidikan: RiwayatPendidikan[]
  bidangKeahlian: string[]
  mataKuliah: string[]
  email: string
  foto?: string
  sinta?: string
  googleScholar?: string
}