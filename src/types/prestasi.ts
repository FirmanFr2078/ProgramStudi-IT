export type TingkatPrestasi = "Internasional" | "Nasional" | "Provinsi" | "Kampus"

export type Prestasi = {
  id: string
  mahasiswa: string[] // bisa tim, lebih dari satu nama
  judul: string // nama lomba/kompetisi/hibah
  penyelenggara: string
  tingkat: TingkatPrestasi
  peringkat: string // "Juara 1", "Juara Harapan 2", "Pendanaan Nasional", dst
  tahun: number
  pembimbing?: string // dosen pembimbing, opsional
}