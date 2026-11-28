import type {
  BidangKerjaSama as PrismaBidang,
  JenisBerkas as PrismaJenisBerkas,
  TingkatKerjaSama as PrismaTingkat,
} from "@generated/enums"

import type { BidangKerjaSama, JenisBerkas, TingkatKerjaSama } from "@/types"

// ============================================================
// ENUM PRISMA <-> LABEL
// Prisma mengembalikan nama tanpa spasi/garis miring ("LokalWilayah");
// @map di schema hanya mengubah nilai di kolom database. Label inilah yang
// dipakai form dan tampilan. Record<PrismaX, ...> bikin TypeScript error kalau
// enum bertambah tapi mapping-nya lupa diisi.
//
// JenisNaskah, StatusNaskah, dan StatusKegiatan tidak perlu mapping karena
// nilai Prisma dan labelnya sama persis.
// ============================================================

function invert<K extends string, V extends string>(map: Record<K, V>): Record<V, K> {
  return Object.fromEntries(
    Object.entries<V>(map).map(([key, value]) => [value, key]),
  ) as Record<V, K>
}

export const TINGKAT_TO_LABEL: Record<PrismaTingkat, TingkatKerjaSama> = {
  Internasional: "Internasional",
  Nasional: "Nasional",
  LokalWilayah: "Lokal/Wilayah",
}
export const LABEL_TO_TINGKAT = invert(TINGKAT_TO_LABEL)

export const BIDANG_TO_LABEL: Record<PrismaBidang, BidangKerjaSama> = {
  Pendidikan: "Pendidikan",
  Penelitian: "Penelitian",
  PengabdianMasyarakat: "Pengabdian Masyarakat",
  PengembanganKelembagaan: "Pengembangan Kelembagaan",
}
export const LABEL_TO_BIDANG = invert(BIDANG_TO_LABEL)

export const JENIS_BERKAS_TO_LABEL: Record<PrismaJenisBerkas, JenisBerkas> = {
  Naskah: "Naskah",
  Addendum: "Addendum",
  SuratTugas: "Surat Tugas",
  Laporan: "Laporan",
  Dokumentasi: "Dokumentasi",
  Sertifikat: "Sertifikat",
  Luaran: "Luaran",
  Lainnya: "Lainnya",
}
export const LABEL_TO_JENIS_BERKAS = invert(JENIS_BERKAS_TO_LABEL)