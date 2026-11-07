export type UnitKerja =
  | "Tata Usaha"
  | "Layanan Akademik"
  | "Laboratorium"
  | "Perpustakaan"
  | "Keuangan & Umum"

export type Tendik = {
  slug: string
  nama: string // termasuk gelar
  jabatan: string // mis. "Staf Administrasi Akademik"
  unitKerja: UnitKerja // tampil sebagai badge di kartu
  tugas: string[] // tugas pokok dan layanan
  lokasi: string // ruang staf, mis. "Ruang Tata Usaha, Gedung A lantai 1"
  jamLayanan: string
  pendidikan: string // pendidikan terakhir
  email: string
  telepon?: string // nomor kantor atau ekstensi
  foto?: string // path di public, mis. "/tendik/andi-contoh.jpg"
}