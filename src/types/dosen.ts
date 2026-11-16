import { z } from "zod"

// ============================================================
// JABATAN FUNGSIONAL (JABATAN AKADEMIK DOSEN)
// Satu-satunya tempat label ini didefinisikan. Mapping ke enum Prisma
// ada di src/database/dosen.ts (JABATAN_TO_LABEL).
// ============================================================

export const JABATAN_FUNGSIONAL = [
  "Tenaga Pengajar", // belum punya jabatan akademik resmi
  "Asisten Ahli",
  "Lektor",
  "Lektor Kepala",
  "Guru Besar", // istilah resmi: Profesor
] as const

export type JabatanFungsional = (typeof JABATAN_FUNGSIONAL)[number]
import { KETUA_PROGRAM_STUDI } from "@/config/structural-roles"

// ============================================================
// JABATAN STRUKTURAL (opsional)
// Tetap disimpan sebagai teks bebas di database (lihat jabatanStruktural di
// bawah) supaya jabatan yang tidak ada di daftar ini masih bisa diisi lewat
// opsi "Lainnya" di form -- daftar ini cuma preset buat dropdown-nya.
// ============================================================

export const JABATAN_STRUKTURAL_OPTIONS = [
  KETUA_PROGRAM_STUDI,
  "Sekretaris Program Studi",
  "Koordinator Tugas Akhir",
  "Koordinator Praktik Kerja Lapangan",
  "Koordinator Kurikulum",
  "Kepala Laboratorium",
  "Wakil Dekan",
  "Dekan",
] as const

/** Folder di bucket "images" untuk foto dosen. */
export const DOSEN_FOTO_FOLDER = "dosen"

// ============================================================
// VIEW PUBLIK (bentuk lama, dipertahankan)
// ============================================================

export type RiwayatPendidikan = {
  jenjang: "S1" | "S2" | "S3"
  bidang: string
  kampus: string
}

export type Dosen = {
  slug: string
  nama: string // termasuk gelar, mis. "Dr. Ahmad Fauzi, M.Kom."
  nidn: string
  jabatanStruktural?: string // kosong = dosen biasa, bukan berarti error
  jabatanFungsional: JabatanFungsional
  pendidikan: RiwayatPendidikan[]
  bidangKeahlian: string[]
  mataKuliah: string[]
  email: string
  foto?: string
  sinta?: string
  googleScholar?: string
}

// ============================================================
// VALIDASI INPUT DASHBOARD (CREATE & UPDATE)
// ============================================================

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

function dedupeCaseInsensitive(values: string[]) {
  const seen = new Set<string>()
  return values.filter((value) => {
    const key = value.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** Teks opsional: "" / null / undefined semuanya jadi null. */
const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} maksimal ${max} karakter`)
    .nullable()
    .optional()
    .transform((value) => (value ? value : null))

/** Tautan yang dipakai sebagai href di halaman publik: wajib https. */
const optionalHttpsUrl = (label: string) =>
  optionalText(255, label).refine(
    (value) => value === null || isHttpsUrl(value),
    `${label} harus berupa tautan yang diawali https://`,
  )

const pendidikanWajibSchema = z.object({
  bidang: z
    .string()
    .trim()
    .min(1, "Bidang wajib diisi")
    .max(100, "Bidang maksimal 100 karakter"),
  kampus: z
    .string()
    .trim()
    .min(1, "Kampus wajib diisi")
    .max(150, "Kampus maksimal 150 karakter"),
})

// S3: boleh kosong total, tapi kalau diisi harus lengkap (bidang + kampus).
const pendidikanOpsionalSchema = z
  .object({
    bidang: z.string().trim().max(100, "Bidang maksimal 100 karakter"),
    kampus: z.string().trim().max(150, "Kampus maksimal 150 karakter"),
  })
  .nullable()
  .optional()
  .transform((value) => (value && (value.bidang || value.kampus) ? value : null))
  .refine(
    (value) => value === null || (value.bidang !== "" && value.kampus !== ""),
    "Bidang dan kampus harus diisi keduanya, atau kosongkan keduanya.",
  )

const tagListSchema = (label: string, min: number, maxItems: number) =>
  z
    .array(
      z
        .string()
        .trim()
        .min(1, `${label} tidak boleh kosong`)
        .max(100, `${label} maksimal 100 karakter`),
    )
    .min(min, min > 0 ? `Isi minimal ${min} ${label.toLowerCase()}` : "")
    .max(maxItems, `${label} maksimal ${maxItems} item`)
    .transform(dedupeCaseInsensitive)

// Foto disimpan sebagai path di bucket "images" (dosen/<file>).
// URL https tetap diterima supaya baris lama yang berisi URL tidak gagal disimpan ulang.
const FOTO_PATH_PATTERN = new RegExp(`^${DOSEN_FOTO_FOLDER}/[A-Za-z0-9._-]+$`)

const fotoSchema = z
  .string()
  .trim()
  .max(255, "Path foto maksimal 255 karakter")
  .nullable()
  .optional()
  .transform((value) => (value ? value : null))
  .refine(
    (value) => value === null || FOTO_PATH_PATTERN.test(value) || isHttpsUrl(value),
    "Path foto tidak valid",
  )

export const dosenInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi")
    .max(150, "Slug maksimal 150 karakter")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)",
    ),
  nama: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(150, "Nama maksimal 150 karakter"),
  nidn: z.string().trim().regex(/^\d{10}$/, "NIDN harus terdiri dari 10 digit angka"),
  jabatanStruktural: optionalText(100, "Jabatan struktural"),
  jabatanFungsional: z.enum(JABATAN_FUNGSIONAL, {
    message: "Jabatan fungsional tidak valid",
  }),
  pendidikanS1: pendidikanWajibSchema,
  // S2 wajib -- syarat minimal jadi dosen. S3 tetap opsional.
  pendidikanS2: pendidikanWajibSchema,
  pendidikanS3: pendidikanOpsionalSchema,
  bidangKeahlian: tagListSchema("Bidang keahlian", 1, 10),
  mataKuliah: tagListSchema("Mata kuliah", 0, 30),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(150, "Email maksimal 150 karakter")
    .pipe(z.email({ message: "Format email tidak valid" })),
  foto: fotoSchema,
  sinta: optionalHttpsUrl("Tautan SINTA"),
  googleScholar: optionalHttpsUrl("Tautan Google Scholar"),
})

export type DosenInput = z.infer<typeof dosenInputSchema>

// ============================================================
// VIEW ADMIN
// ============================================================

export type DosenPendidikanJenjang = { bidang: string; kampus: string }
export type DosenAttribution = { id: string; nama: string } | null

export type DosenAdmin = {
  id: string
  slug: string
  nama: string
  nidn: string
  jabatanStruktural: string | null
  jabatanFungsional: JabatanFungsional
  pendidikanS1: DosenPendidikanJenjang
  // Tetap "| null" di sisi baca -- data lama sebelum S2 diwajibkan mungkin
  // belum punya nilai ini. Yang WAJIB diisi itu di dosenInputSchema (submit baru).
  pendidikanS2: DosenPendidikanJenjang | null
  pendidikanS3: DosenPendidikanJenjang | null
  bidangKeahlian: string[]
  mataKuliah: string[]
  email: string
  foto: string | null // URL publik siap dipakai untuk <img>
  fotoPath: string | null // nilai asli di database
  sinta: string | null
  googleScholar: string | null
  createdAt: string
  updatedAt: string
  createdBy: DosenAttribution
  updatedBy: DosenAttribution
}