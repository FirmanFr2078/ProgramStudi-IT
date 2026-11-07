export type MataKuliah = {
  kode: string
  nama: string
  sks: number
  jenis: "Wajib" | "Pilihan"
  semester: number // 1–8
}