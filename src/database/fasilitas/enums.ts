import type {
  JenisBerkasFasilitas as PrismaJenisBerkas,
  KepemilikanAset as PrismaKepemilikan,
  KondisiAset as PrismaKondisi,
  StatusFasilitas as PrismaStatus,
} from "@generated/enums"

import type {
  JenisBerkasFasilitas,
  KepemilikanAset,
  KondisiAset,
  StatusFasilitas,
} from "@/types"

function invert<K extends string, V extends string>(map: Record<K, V>): Record<V, K> {
  return Object.fromEntries(
    Object.entries<V>(map).map(([key, value]) => [value, key]),
  ) as Record<V, K>
}

export const KEPEMILIKAN_TO_LABEL: Record<PrismaKepemilikan, KepemilikanAset> = {
  MilikSendiri: "Milik Sendiri",
  Sewa: "Sewa",
  Pinjam: "Pinjam",
}
export const LABEL_TO_KEPEMILIKAN = invert(KEPEMILIKAN_TO_LABEL)

export const KONDISI_TO_LABEL: Record<PrismaKondisi, KondisiAset> = {
  Baik: "Baik",
  RusakRingan: "Rusak Ringan",
  RusakBerat: "Rusak Berat",
}
export const LABEL_TO_KONDISI = invert(KONDISI_TO_LABEL)

export const STATUS_TO_LABEL: Record<PrismaStatus, StatusFasilitas> = {
  Aktif: "Aktif",
  Renovasi: "Renovasi",
  TidakDigunakan: "Tidak Digunakan",
}
export const LABEL_TO_STATUS = invert(STATUS_TO_LABEL)

export const JENIS_BERKAS_TO_LABEL: Record<PrismaJenisBerkas, JenisBerkasFasilitas> = {
  Foto: "Foto",
  SertifikatKalibrasi: "Sertifikat Kalibrasi",
  DokumenInventaris: "Dokumen Inventaris",
  Lainnya: "Lainnya",
}
export const LABEL_TO_JENIS_BERKAS = invert(JENIS_BERKAS_TO_LABEL)