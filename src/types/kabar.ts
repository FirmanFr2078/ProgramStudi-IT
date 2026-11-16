import { z } from "zod"

// ============================================================
// KONTEN ARTIKEL BERBASIS BLOK
// ============================================================

export const articleBlockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().min(1),
    type: z.literal("paragraph"),
    content: z.string().trim().min(1, "Paragraf tidak boleh kosong").max(10000),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("heading"),
    content: z.string().trim().min(1, "Subjudul tidak boleh kosong").max(200),
    level: z.union([z.literal(2), z.literal(3)]),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("image"),
    image: z.string().url("URL gambar tidak valid"),
    alt: z.string().max(200).default(""),
    caption: z.string().max(300).optional(),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("quote"),
    content: z.string().trim().min(1, "Kutipan tidak boleh kosong").max(2000),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("list"),
    style: z.enum(["ordered", "unordered"]),
    items: z.array(z.string().trim().min(1, "Item daftar tidak boleh kosong")).min(1),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("divider"),
  }),
])

export type ArticleBlock = z.infer<typeof articleBlockSchema>

// ============================================================
// VIEW PUBLIK
// Tetap mempertahankan bentuk data dummy publik yang sekarang.
// Renderer publik dapat dimigrasikan ke ArticleBlock pada tahap
// integrasi halaman detail berita.
// ============================================================

export type Kabar = {
  slug: string
  judul: string
  ringkasan: string
  konten: string[]
  kategori: "Berita" | "Pengumuman"
  tanggal: string
  gambar?: string
}

// ============================================================
// VALIDASI INPUT DASHBOARD (CREATE & UPDATE)
// ============================================================

/** Folder di bucket "images" untuk gambar sampul (cover) berita. */
export const KABAR_FOTO_FOLDER = "kabar"

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

// Gambar sampul disimpan sebagai path di bucket "images" (kabar/<file>).
// https diterima juga supaya data lama yang berupa URL tidak gagal disimpan ulang.
const GAMBAR_PATH_PATTERN = new RegExp(`^${KABAR_FOTO_FOLDER}/[A-Za-z0-9._-]+$`)

export const kabarInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi")
    .max(150, "Slug maksimal 150 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)"),
  judul: z.string().trim().min(1, "Judul wajib diisi").max(200, "Judul maksimal 200 karakter"),
  ringkasan: z.string().trim().min(1, "Ringkasan wajib diisi").max(300, "Ringkasan maksimal 300 karakter"),
  konten: z.array(articleBlockSchema).min(1, "Konten minimal memiliki satu blok"),
  kategori: z.enum(["Berita", "Pengumuman"], { message: "Kategori tidak valid" }),
  tanggal: z.coerce.date({ message: "Tanggal tidak valid" }),
  gambar: z
    .string()
    .trim()
    .max(255, "Path gambar maksimal 255 karakter")
    .nullable()
    .optional()
    .transform((value) => (value ? value : null))
    .refine(
      (value) => value === null || GAMBAR_PATH_PATTERN.test(value) || isHttpsUrl(value),
      "Path gambar tidak valid",
    ),
})

export type KabarInput = z.infer<typeof kabarInputSchema>

// ============================================================
// VIEW ADMIN
// ============================================================

export type KabarAttribution = { id: string; nama: string } | null

export type KabarAdmin = {
  id: string
  slug: string
  judul: string
  ringkasan: string
  konten: ArticleBlock[]
  kategori: "Berita" | "Pengumuman"
  tanggal: string
  gambar: string | null // public URL untuk preview
  gambarPath: string | null // path bucket untuk penyimpanan kembali
  createdAt: string
  updatedAt: string
  createdBy: KabarAttribution
  updatedBy: KabarAttribution
}