// Role baru: tambahkan di ROLES, lalu isi izinnya di src/lib/permissions.ts
export const ROLES = ["admin"] as const

export const PERMISSIONS = [
  "berita:manage",
  "event:manage",
  "sdm:manage",
  "pendidikan:manage",
  "kerja-sama:manage",
  "fasilitas:manage",
  "penelitian:manage",
  "mahasiswa:manage",
  "pengguna:manage",
  "pengaturan:manage",
] as const