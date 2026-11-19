import { z } from "zod"

export const STRUKTUR_ARAH = ["atas", "bawah", "kiri", "kanan"] as const
export type StrukturArah = (typeof STRUKTUR_ARAH)[number]

export const STRUKTUR_TUPOKSI_MAX_ITEMS = 20

const requiredText = (max: number, label: string) =>
  z.string().trim().min(1, `${label} wajib diisi`).max(max, `${label} maksimal ${max} karakter`)

/** Teks opsional: "" / null / undefined semuanya jadi null. */
const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} maksimal ${max} karakter`)
    .nullable()
    .optional()
    .transform((value) => (value ? value : null))

const optionalIdRef = z
  .string()
  .trim()
  .min(1)
  .nullable()
  .optional()
  .transform((value) => (value ? value : null))

// ============================================================
// POSISI
// ============================================================

export const strukturPosisiCreateSchema = z.object({
  referenceId: z.string().trim().min(1, "Node acuan wajib diisi"),
  arah: z.enum(STRUKTUR_ARAH, { message: "Arah tidak valid" }),
  jabatan: requiredText(100, "Jabatan"),
  dosenId: optionalIdRef,
  nama: optionalText(150, "Nama"),
})
export type StrukturPosisiCreateInput = z.infer<typeof strukturPosisiCreateSchema>

export const strukturPosisiUpdateSchema = z.object({
  jabatan: requiredText(100, "Jabatan"),
  dosenId: optionalIdRef,
  nama: optionalText(150, "Nama"),
})
export type StrukturPosisiUpdateInput = z.infer<typeof strukturPosisiUpdateSchema>

export const strukturPosisiPositionSchema = z.object({
  posX: z.number().int(),
  posY: z.number().int(),
})
export type StrukturPosisiPositionInput = z.infer<typeof strukturPosisiPositionSchema>

export type StrukturTupoksiAdmin = {
  id: string
  isi: string
  urutan: number
}

export type StrukturPosisiAdmin = {
  id: string
  parentId: string | null
  jabatan: string
  nama: string | null // dipakai kalau dosenId null (mode custom)
  dosenId: string | null
  dosenNama: string | null
  dosenNidn: string | null
  dosenFoto: string | null
  urutan: number
  posX: number
  posY: number
  isRoot: boolean
  tupoksi: StrukturTupoksiAdmin[]
}

// ============================================================
// TUPOKSI
// ============================================================

export const strukturTupoksiInputSchema = z.object({
  posisiId: z.string().trim().min(1, "Posisi wajib diisi"),
  isi: requiredText(300, "Isi tupoksi"),
})
export type StrukturTupoksiInput = z.infer<typeof strukturTupoksiInputSchema>

export const strukturTupoksiUpdateSchema = z.object({
  isi: requiredText(300, "Isi tupoksi"),
})
export type StrukturTupoksiUpdateInput = z.infer<typeof strukturTupoksiUpdateSchema>