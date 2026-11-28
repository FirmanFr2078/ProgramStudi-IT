import { z } from "zod"

import {
  idSchema,
  optionalIdSchema,
  optionalText,
  paragraphListSchema,
  slugSchema,
} from "@/types/shared-schema"

// ============================================================
// KONSTANTA & LABEL
// Mapping ke enum Prisma ada di src/database/fasilitas/enums.ts.
// ============================================================

export const KEPEMILIKAN_ASET = ["Milik Sendiri", "Sewa", "Pinjam"] as const
export type KepemilikanAset = (typeof KEPEMILIKAN_ASET)[number]

export const KONDISI_ASET = ["Baik", "Rusak Ringan", "Rusak Berat"] as const
export type KondisiAset = (typeof KONDISI_ASET)[number]

export const STATUS_FASILITAS = ["Aktif", "Renovasi", "Tidak Digunakan"] as const
export type StatusFasilitas = (typeof STATUS_FASILITAS)[number]

export const JENIS_BERKAS_FASILITAS = [
  "Foto",
  "Sertifikat Kalibrasi",
  "Dokumen Inventaris",
  "Lainnya",
] as const
export type JenisBerkasFasilitas = (typeof JENIS_BERKAS_FASILITAS)[number]

/** Berkas jenis "Foto" masuk bucket images; selain itu masuk bucket documents. */
export const JENIS_BERKAS_FOTO: readonly JenisBerkasFasilitas[] = ["Foto"]
export const JENIS_BERKAS_DOKUMEN: readonly JenisBerkasFasilitas[] = [
  "Sertifikat Kalibrasi",
  "Dokumen Inventaris",
  "Lainnya",
]

/** Folder di bucket "images". */
export const FASILITAS_FOTO_FOLDER = "fasilitas"
export const FASILITAS_GALERI_FOLDER = "fasilitas-galeri"
/** Folder di bucket "documents". */
export const FASILITAS_DOKUMEN_FOLDER = "fasilitas-dokumen"

export const FASILITAS_BERKAS_MAX_SIZE = 10 * 1024 * 1024 // 10 MB

const urutanSchema = z
  .number({ message: "Urutan harus berupa angka" })
  .int("Urutan harus bilangan bulat")
  .min(0, "Urutan minimal 0")
  .max(9999, "Urutan maksimal 9999")
  .default(0)

// ============================================================
// VALIDASI INPUT -- REFERENSI KATEGORI
// ============================================================

export const kategoriFasilitasInputSchema = z.object({
  slug: slugSchema,
  nama: z
    .string()
    .trim()
    .min(1, "Nama kategori wajib diisi")
    .max(100, "Nama kategori maksimal 100 karakter"),
  urutan: urutanSchema,
  aktif: z.boolean().default(true),
})
export type KategoriFasilitasInput = z.infer<typeof kategoriFasilitasInputSchema>

// ============================================================
// VALIDASI INPUT -- FASILITAS (ruang/gedung/area)
// ============================================================

const FOTO_PATH_PATTERN = new RegExp(`^${FASILITAS_FOTO_FOLDER}/[A-Za-z0-9._-]+$`)

const fotoSchema = optionalText(255, "Path foto").refine(
  (value) => value === null || FOTO_PATH_PATTERN.test(value),
  "Path foto tidak valid",
)

export const fasilitasInputSchema = z.object({
  slug: slugSchema,
  nama: z.string().trim().min(1, "Nama fasilitas wajib diisi").max(200, "Nama maksimal 200 karakter"),
  kategoriId: idSchema("Kategori"),
  gedungId: optionalIdSchema("Gedung"),
  lantai: optionalText(20, "Lantai"),

  deskripsi: paragraphListSchema("Deskripsi", 10, 2000).default([]),
  foto: fotoSchema,

  luasM2: z
    .number({ message: "Luas harus berupa angka" })
    .positive("Luas harus lebih dari 0")
    .max(999_999, "Luas terlalu besar")
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  kapasitas: z
    .number({ message: "Kapasitas harus berupa angka" })
    .int("Kapasitas harus bilangan bulat")
    .min(0, "Kapasitas minimal 0")
    .max(100_000, "Kapasitas terlalu besar")
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  kepemilikan: z.enum(KEPEMILIKAN_ASET, { message: "Kepemilikan tidak valid" }).default("Milik Sendiri"),
  kondisi: z.enum(KONDISI_ASET, { message: "Kondisi tidak valid" }).default("Baik"),
  status: z.enum(STATUS_FASILITAS, { message: "Status tidak valid" }).default("Aktif"),
  aksesibelDifabel: z.boolean().default(false),
  penggunaanJamPerMinggu: z
    .number({ message: "Jam penggunaan harus berupa angka" })
    .int()
    .min(0)
    .max(168, "Maksimal 168 jam per minggu")
    .nullable()
    .optional()
    .transform((value) => value ?? null),

  tampilPublik: z.boolean().default(false),
  unggulan: z.boolean().default(false),
  urutan: urutanSchema,
})
export type FasilitasInput = z.infer<typeof fasilitasInputSchema>

// ============================================================
// VALIDASI INPUT -- ALAT (peralatan/sarana per ruang)
// ============================================================

const TAHUN_MIN = 1980

export const alatInputSchema = z.object({
  fasilitasId: idSchema("Fasilitas"),
  nama: z.string().trim().min(1, "Nama alat wajib diisi").max(150, "Nama maksimal 150 karakter"),
  jumlahUnit: z
    .number({ message: "Jumlah unit harus berupa angka" })
    .int("Jumlah unit harus bilangan bulat")
    .min(1, "Jumlah unit minimal 1")
    .max(100_000, "Jumlah unit terlalu besar")
    .default(1),
  tahunPerolehan: z
    .number({ message: "Tahun harus berupa angka" })
    .int()
    .min(TAHUN_MIN, `Tahun minimal ${TAHUN_MIN}`)
    .max(new Date().getFullYear() + 1, "Tahun tidak valid")
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  kepemilikan: z.enum(KEPEMILIKAN_ASET, { message: "Kepemilikan tidak valid" }).default("Milik Sendiri"),
  kondisi: z.enum(KONDISI_ASET, { message: "Kondisi tidak valid" }).default("Baik"),
  spesifikasi: optionalText(1000, "Spesifikasi"),
  tampilPublik: z.boolean().default(true),
})
export type AlatInput = z.infer<typeof alatInputSchema>

// ============================================================
// VALIDASI INPUT -- BERKAS (metadata, setelah file diunggah)
// ============================================================

const BERKAS_PATH_PATTERN = new RegExp(
  `^(?:${FASILITAS_GALERI_FOLDER}|${FASILITAS_DOKUMEN_FOLDER})/[A-Za-z0-9._-]+$`,
)

export const berkasFasilitasInputSchema = z
  .object({
    fasilitasId: idSchema("Fasilitas"),
    jenis: z.enum(JENIS_BERKAS_FASILITAS, { message: "Jenis berkas tidak valid" }),
    label: z.string().trim().min(1, "Label wajib diisi").max(150, "Label maksimal 150 karakter"),
    path: z.string().trim().min(1, "Path berkas wajib diisi").max(255),
    mime: optionalText(100, "Tipe berkas"),
    ukuran: z
      .number()
      .int()
      .min(0)
      .max(FASILITAS_BERKAS_MAX_SIZE, "Ukuran berkas maksimal 10 MB")
      .nullable()
      .optional()
      .transform((value) => value ?? null),
    urutan: urutanSchema,
  })
  .refine((value) => BERKAS_PATH_PATTERN.test(value.path), {
    message: "Path berkas tidak valid.",
    path: ["path"],
  })
  .refine(
    (value) => {
      const folderSeharusnya = JENIS_BERKAS_FOTO.includes(value.jenis)
        ? FASILITAS_GALERI_FOLDER
        : FASILITAS_DOKUMEN_FOLDER
      return value.path.startsWith(`${folderSeharusnya}/`)
    },
    { message: "Berkas tidak sesuai dengan jenisnya.", path: ["path"] },
  )
export type BerkasFasilitasInput = z.infer<typeof berkasFasilitasInputSchema>

// ============================================================
// VIEW ADMIN
// ============================================================

export type FasilitasAttribution = { id: string; nama: string } | null

export type KategoriFasilitasRef = {
  id: string
  slug: string
  nama: string
  urutan: number
  aktif: boolean
  jumlahFasilitas: number
}

/** Ringkasan untuk dropdown pilih gedung induk. */
export type FasilitasRingkas = { id: string; nama: string; kategori: string }

export type BerkasFasilitasAdmin = {
  id: string
  jenis: JenisBerkasFasilitas
  label: string
  url: string // bucket images & documents sama-sama publik
  path: string
  mime: string | null
  ukuran: number | null
  urutan: number
  createdAt: string
}

export type AlatAdmin = {
  id: string
  fasilitasId: string
  nama: string
  jumlahUnit: number
  tahunPerolehan: number | null
  kepemilikan: KepemilikanAset
  kondisi: KondisiAset
  spesifikasi: string | null
  tampilPublik: boolean
  createdAt: string
  updatedAt: string
}

export type FasilitasAdmin = {
  id: string
  slug: string
  nama: string
  kategoriId: string
  kategori: string
  gedungId: string | null
  gedungNama: string | null
  lantai: string | null
  deskripsi: string[]
  foto: string | null
  fotoPath: string | null
  luasM2: number | null
  kapasitas: number | null
  kepemilikan: KepemilikanAset
  kondisi: KondisiAset
  status: StatusFasilitas
  aksesibelDifabel: boolean
  penggunaanJamPerMinggu: number | null
  tampilPublik: boolean
  unggulan: boolean
  urutan: number
  jumlahRuangan: number
  alat: AlatAdmin[]
  berkas: BerkasFasilitasAdmin[]
  createdAt: string
  updatedAt: string
  createdBy: FasilitasAttribution
  updatedBy: FasilitasAttribution
}

// ============================================================
// VIEW PUBLIK (landing)
// ============================================================

export type FasilitasPublik = {
  slug: string
  nama: string
  kategori: string
  kategoriSlug: string
  gedung: string | null
  lantai: string | null
  deskripsi: string[]
  foto: string | null
  luasM2: number | null
  kapasitas: number | null
  status: StatusFasilitas
  aksesibelDifabel: boolean
  alatRingkas: string[]
  jumlahAlatLainnya: number
  galeri: string[]
}