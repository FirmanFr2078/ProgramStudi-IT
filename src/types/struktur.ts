import { z } from "zod"

import type { Jalur } from "@/lib/struktur-tree"

export const JALUR_SAMBUNG = ["lurus", "kiri", "kanan"] as const
export type JalurSambung = Jalur

export const STRUKTUR_TUPOKSI_MAX_ITEMS = 20
export const STRUKTUR_MAX_POSISI = 200
export const STRUKTUR_MAX_JARAK_KOSONG = 20

const requiredText = (max: number, label: string) =>
  z.string().trim().min(1, `${label} wajib diisi`).max(max, `${label} maksimal ${max} karakter`)

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
// BACA (dashboard)
// ============================================================

export type StrukturTupoksiAdmin = {
  id: string
  isi: string
  urutan: number
}

/**
 * Status data Kaprodi yang diambil dari modul Dosen (jabatan struktural
 * "Ketua Program Studi"): null = valid (tepat satu dosen), "kosong" = belum
 * ada dosen yang ditandai, "ganda" = lebih dari satu dosen ditandai.
 */
export type KaprodiInvalid = "kosong" | "ganda" | null

export type StrukturPosisiAdmin = {
  id: string
  parentId: string | null
  jabatan: string
  nama: string | null
  dosenId: string | null
  dosenNama: string | null
  dosenNidn: string | null
  dosenFoto: string | null
  /** Baris (level) di bawah atasannya, mulai dari 1. */
  level: number
  jalur: JalurSambung
  /** Urutan kiri -> kanan di dalam grup jalur yang sama. */
  urutan: number
  /** BARU — jumlah baris kosong (skip) sebelum baris ini. Hanya berarti di mode "tembus". */
  jarakKosong: number
  isKaprodi: boolean
  /** Hanya terisi untuk kartu Kaprodi. */
  kaprodiInvalid: KaprodiInvalid
  tupoksi: StrukturTupoksiAdmin[]
}

// ============================================================
// SIMPAN (satu kali, seluruh struktur)
// ============================================================

export const strukturSaveSchema = z.object({
  posisi: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(64),
        parentId: z.string().trim().min(1).max(64).nullable(),
        jabatan: requiredText(100, "Jabatan"),
        nama: optionalText(150, "Nama"),
        dosenId: optionalIdRef,
        level: z.number().int().min(1).max(50),
        jalur: z.enum(JALUR_SAMBUNG),
        urutan: z.number().int().min(0).max(500),
        jarakKosong: z.number().int().min(0).max(STRUKTUR_MAX_JARAK_KOSONG).default(0),
        isKaprodi: z.boolean(),
        tupoksi: z
          .array(
            z.object({
              id: z.string().trim().min(1).max(64).nullable().optional(),
              isi: requiredText(300, "Isi tupoksi"),
            }),
          )
          .max(STRUKTUR_TUPOKSI_MAX_ITEMS, `Tupoksi maksimal ${STRUKTUR_TUPOKSI_MAX_ITEMS} poin per posisi`),
      }),
    )
    .min(1, "Struktur kosong")
    .max(STRUKTUR_MAX_POSISI, `Posisi maksimal ${STRUKTUR_MAX_POSISI}`),
})
export type StrukturSaveInput = z.infer<typeof strukturSaveSchema>