export type JenisHki =
  | "Hak Cipta"
  | "Paten"
  | "Paten Sederhana"
  | "Desain Industri"
  | "Merek"

export type HkiItem = {
  id: string
  judul: string
  jenis: JenisHki
  pencipta: string[]
  nomor: string // nomor pendaftaran/sertifikat
  tahun: number
  status: "Terdaftar" | "Dalam Proses"
}