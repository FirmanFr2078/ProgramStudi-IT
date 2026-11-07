export type TanggalPenting = {
  id: string
  mulai: string // ISO, "2026-09-01"
  selesai?: string // ISO, kalau berupa rentang
  keterangan: string
}