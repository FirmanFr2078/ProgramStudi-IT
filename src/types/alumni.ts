export type StatusKarier =
  | "Bekerja"
  | "Wirausaha"
  | "Melanjutkan Studi"
  | "Mencari Kerja"

export type Alumni = {
  id: string
  nama: string
  nim: string
  tahunLulus: number
  statusKarier: StatusKarier
  pekerjaan?: string // posisi + instansi, mis. "Software Engineer di PT Teknologi Nusantara"
}