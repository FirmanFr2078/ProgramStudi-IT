import { z } from "zod"

import {
  idSchema,
  isoDateSchema,
  isHttpsUrl,
  optionalHttpsUrl,
  optionalIdSchema,
  optionalIsoDateSchema,
  optionalText,
  paragraphListSchema,
  slugSchema,
  textListSchema,
} from "@/types/shared-schema"

// ============================================================
// KONSTANTA & LABEL
// Satu-satunya tempat label ini didefinisikan. Mapping ke enum Prisma
// (yang tidak punya spasi/garis miring) ada di src/database/kerja-sama/enums.ts.
// ============================================================

export const TINGKAT_KERJA_SAMA = ["Internasional", "Nasional", "Lokal/Wilayah"] as const
export type TingkatKerjaSama = (typeof TINGKAT_KERJA_SAMA)[number]

export const BIDANG_KERJA_SAMA = [
  "Pendidikan",
  "Penelitian",
  "Pengabdian Masyarakat",
  "Pengembangan Kelembagaan",
] as const
export type BidangKerjaSama = (typeof BIDANG_KERJA_SAMA)[number]

export const JENIS_NASKAH = ["LoI", "MoU", "PKS", "IA", "Addendum"] as const
export type JenisNaskah = (typeof JENIS_NASKAH)[number]

export const JENIS_NASKAH_LABEL: Record<JenisNaskah, string> = {
  LoI: "Letter of Intent (LoI)",
  MoU: "Nota Kesepahaman (MoU)",
  PKS: "Perjanjian Kerja Sama (PKS/MoA)",
  IA: "Implementation Agreement (IA)",
  Addendum: "Addendum",
}

export const STATUS_NASKAH = ["Draft", "Berlaku", "Dibatalkan"] as const
export type StatusNaskah = (typeof STATUS_NASKAH)[number]

export const STATUS_KEGIATAN = ["Direncanakan", "Berjalan", "Selesai", "Dibatalkan"] as const
export type StatusKegiatan = (typeof STATUS_KEGIATAN)[number]

export const JENIS_BERKAS = [
  "Naskah",
  "Addendum",
  "Surat Tugas",
  "Laporan",
  "Dokumentasi",
  "Sertifikat",
  "Luaran",
  "Lainnya",
] as const
export type JenisBerkas = (typeof JENIS_BERKAS)[number]

/** Berkas yang boleh menempel pada naskah vs pada kegiatan (kegiatan = bukti realisasi). */
export const JENIS_BERKAS_NASKAH: readonly JenisBerkas[] = ["Naskah", "Addendum", "Lainnya"]
export const JENIS_BERKAS_KEGIATAN: readonly JenisBerkas[] = [
  "Surat Tugas",
  "Laporan",
  "Dokumentasi",
  "Sertifikat",
  "Luaran",
  "Lainnya",
]

/**
 * Masa berlaku naskah -- DIHITUNG dari tanggal (lib/kerja-sama-status.ts), tidak disimpan.
 * "Belum Mulai" = status Berlaku tapi tanggal mulai masih di depan.
 */
export type MasaBerlaku =
  | "Draft"
  | "Belum Mulai"
  | "Berlaku"
  | "Segera Berakhir"
  | "Berakhir"
  | "Dibatalkan"

/** Status mitra, diturunkan dari naskah-naskahnya. */
export type StatusMitra = "Aktif" | "Berakhir" | "Belum Aktif" | "Tanpa Naskah"

/**
 * Aturan induk naskah (MoU -> PKS -> IA). Dipakai server (validasi) dan form
 * (menyaring dropdown induk), jadi aturannya tidak bisa menyimpang.
 */
export const INDUK_NASKAH: Record<
  JenisNaskah,
  { allowed: readonly JenisNaskah[]; required: boolean }
> = {
  LoI: { allowed: [], required: false },
  MoU: { allowed: ["LoI"], required: false },
  PKS: { allowed: ["MoU"], required: false },
  IA: { allowed: ["PKS", "MoU"], required: true },
  Addendum: { allowed: ["MoU", "PKS", "IA"], required: true },
}

/** Folder di bucket "images" untuk logo mitra. */
export const MITRA_LOGO_FOLDER = "mitra"

/** Folder di bucket PRIVAT "kerja-sama" (lihat lib/kerja-sama-storage.ts). */
export const BERKAS_NASKAH_FOLDER = "naskah"
export const BERKAS_KEGIATAN_FOLDER = "kegiatan"

export const BERKAS_MAX_SIZE = 10 * 1024 * 1024 // 10 MB
export const BERKAS_ALLOWED_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

// ============================================================
// VALIDASI INPUT -- REFERENSI
// ============================================================

const namaReferensi = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(100, `${label} maksimal 100 karakter`)

const urutanSchema = z
  .number({ message: "Urutan harus berupa angka" })
  .int("Urutan harus bilangan bulat")
  .min(0, "Urutan minimal 0")
  .max(9999, "Urutan maksimal 9999")
  .default(0)

export const kategoriMitraInputSchema = z.object({
  nama: namaReferensi("Nama kategori"),
  urutan: urutanSchema,
  aktif: z.boolean().default(true),
})
export type KategoriMitraInput = z.infer<typeof kategoriMitraInputSchema>

export const bentukInputSchema = z.object({
  nama: namaReferensi("Nama bentuk kegiatan"),
  bidang: z.enum(BIDANG_KERJA_SAMA, { message: "Bidang tidak valid" }),
  urutan: urutanSchema,
  aktif: z.boolean().default(true),
})
export type BentukInput = z.infer<typeof bentukInputSchema>

// ============================================================
// VALIDASI INPUT -- MITRA
// ============================================================

const LOGO_PATH_PATTERN = new RegExp(`^${MITRA_LOGO_FOLDER}/[A-Za-z0-9._-]+$`)

// Logo disimpan sebagai path di bucket "images" (mitra/<file>).
// URL https tetap diterima supaya baris yang berisi URL tidak gagal disimpan ulang.
const logoSchema = optionalText(255, "Path logo").refine(
  (value) => value === null || LOGO_PATH_PATTERN.test(value) || isHttpsUrl(value),
  "Path logo tidak valid",
)

const teleponSchema = optionalText(20, "Telepon").refine(
  (value) => value === null || /^[0-9+\-\s()]{5,20}$/.test(value),
  "Telepon hanya boleh angka, spasi, +, -, dan tanda kurung",
)

const emailOpsional = z
  .string()
  .trim()
  .toLowerCase()
  .max(150, "Email maksimal 150 karakter")
  .nullable()
  .optional()
  .transform((value) => (value ? value : null))
  .refine(
    (value) => value === null || z.email().safeParse(value).success,
    "Format email tidak valid",
  )

export const mitraInputSchema = z
  .object({
    slug: slugSchema,
    nama: z.string().trim().min(1, "Nama mitra wajib diisi").max(200, "Nama maksimal 200 karakter"),
    namaSingkat: optionalText(30, "Nama singkat"),
    kategoriId: idSchema("Kategori"),
    tingkat: z.enum(TINGKAT_KERJA_SAMA, { message: "Tingkat tidak valid" }),
    negara: z
      .string()
      .trim()
      .min(1, "Negara wajib diisi")
      .max(80, "Negara maksimal 80 karakter")
      .default("Indonesia"),
    kota: optionalText(100, "Kota"),
    website: optionalHttpsUrl("Website"),
    logo: logoSchema,

    ringkasan: z
      .string()
      .trim()
      .min(1, "Ringkasan wajib diisi")
      .max(300, "Ringkasan maksimal 300 karakter"),
    deskripsi: paragraphListSchema("Deskripsi", 10, 2000).default([]),

    tampilPublik: z.boolean().default(false),
    unggulan: z.boolean().default(false),
    tampilDiMbkm: z.boolean().default(false),
    urutan: urutanSchema,

    kontakNama: optionalText(150, "Nama kontak"),
    kontakJabatan: optionalText(100, "Jabatan kontak"),
    kontakEmail: emailOpsional,
    kontakTelepon: teleponSchema,
    kontakPublik: z.boolean().default(false),
    catatanInternal: optionalText(2000, "Catatan internal"),
  })
  .refine(
    (value) =>
      !value.kontakPublik || Boolean(value.kontakNama || value.kontakEmail || value.kontakTelepon),
    {
      message: "Isi minimal satu data kontak sebelum menampilkannya di publik.",
      path: ["kontakPublik"],
    },
  )
export type MitraInput = z.infer<typeof mitraInputSchema>

// ============================================================
// VALIDASI INPUT -- NASKAH
// Aturan yang butuh baca database (induk milik mitra yang sama, nomor unik,
// dst.) ada di src/database/kerja-sama/naskah.ts, bukan di sini.
// ============================================================

export const naskahInputSchema = z
  .object({
    mitraId: idSchema("Mitra"),
    jenis: z.enum(JENIS_NASKAH, { message: "Jenis naskah tidak valid" }),
    judul: z.string().trim().min(1, "Judul wajib diisi").max(250, "Judul maksimal 250 karakter"),
    status: z.enum(STATUS_NASKAH, { message: "Status tidak valid" }).default("Draft"),

    nomorProdi: optionalText(100, "Nomor naskah prodi"),
    nomorMitra: optionalText(100, "Nomor naskah mitra"),
    tempatTtd: optionalText(100, "Tempat tanda tangan"),
    tanggalTtd: optionalIsoDateSchema("Tanggal tanda tangan"),
    mulai: isoDateSchema("Tanggal mulai"),
    berakhir: optionalIsoDateSchema("Tanggal berakhir"), // kosong = tanpa batas waktu

    ruangLingkup: optionalText(5000, "Ruang lingkup"),
    pembiayaan: optionalText(255, "Pembiayaan"),

    ttdProdi: optionalText(200, "Penandatangan prodi"),
    ttdMitra: optionalText(200, "Penandatangan mitra"),
    pjDosenId: optionalIdSchema("Dosen penanggung jawab"),
    pjMitra: optionalText(150, "Penanggung jawab mitra"),

    indukId: optionalIdSchema("Naskah induk"),
    perpanjanganDariId: optionalIdSchema("Naskah yang diperpanjang"),

    bentukIds: z
      .array(idSchema("Bentuk kerja sama"))
      .max(20, "Bentuk kerja sama maksimal 20 item")
      .default([])
      .transform((ids) => Array.from(new Set(ids))),

    catatanInternal: optionalText(2000, "Catatan internal"),
  })
  .refine((value) => value.berakhir === null || value.berakhir >= value.mulai, {
    message: "Tanggal berakhir tidak boleh sebelum tanggal mulai.",
    path: ["berakhir"],
  })
  .refine((value) => !INDUK_NASKAH[value.jenis].required || value.indukId !== null, {
    message: "Jenis naskah ini wajib memilih naskah induk.",
    path: ["indukId"],
  })
  .refine((value) => value.indukId === null || INDUK_NASKAH[value.jenis].allowed.length > 0, {
    message: "Jenis naskah ini tidak memiliki induk.",
    path: ["indukId"],
  })
export type NaskahInput = z.infer<typeof naskahInputSchema>

// ============================================================
// VALIDASI INPUT -- KEGIATAN
// ============================================================

export const kegiatanInputSchema = z
  .object({
    kerjaSamaId: idSchema("Naskah"),
    bidang: z.enum(BIDANG_KERJA_SAMA, { message: "Bidang tidak valid" }),
    bentukId: optionalIdSchema("Bentuk kegiatan"),

    judul: z.string().trim().min(1, "Judul wajib diisi").max(250, "Judul maksimal 250 karakter"),
    uraian: optionalText(5000, "Uraian"),
    manfaat: textListSchema("Manfaat", { maxItems: 10, maxLength: 300 }).default([]),

    tanggalMulai: isoDateSchema("Tanggal mulai"),
    tanggalSelesai: optionalIsoDateSchema("Tanggal selesai"),
    jumlahPeserta: z
      .number({ message: "Jumlah peserta harus berupa angka" })
      .int("Jumlah peserta harus bilangan bulat")
      .min(0, "Jumlah peserta minimal 0")
      .max(1_000_000, "Jumlah peserta terlalu besar")
      .nullable()
      .optional()
      .transform((value) => value ?? null),

    status: z.enum(STATUS_KEGIATAN, { message: "Status tidak valid" }).default("Direncanakan"),
    tampilPublik: z.boolean().default(false),
  })
  .refine((value) => value.tanggalSelesai === null || value.tanggalSelesai >= value.tanggalMulai, {
    message: "Tanggal selesai tidak boleh sebelum tanggal mulai.",
    path: ["tanggalSelesai"],
  })
export type KegiatanInput = z.infer<typeof kegiatanInputSchema>

// ============================================================
// VALIDASI INPUT -- BERKAS (metadata, setelah file diunggah ke bucket privat)
// ============================================================

const BERKAS_PATH_PATTERN = new RegExp(
  `^(?:${BERKAS_NASKAH_FOLDER}|${BERKAS_KEGIATAN_FOLDER})/[A-Za-z0-9._-]+$`,
)

export const berkasInputSchema = z
  .object({
    kerjaSamaId: optionalIdSchema("Naskah"),
    kegiatanId: optionalIdSchema("Kegiatan"),
    jenis: z.enum(JENIS_BERKAS, { message: "Jenis berkas tidak valid" }),
    label: z.string().trim().min(1, "Label wajib diisi").max(150, "Label maksimal 150 karakter"),
    path: optionalText(255, "Path berkas"),
    tautan: optionalHttpsUrl("Tautan"),
    mime: optionalText(100, "Tipe berkas"),
    ukuran: z
      .number()
      .int()
      .min(0)
      .max(BERKAS_MAX_SIZE, "Ukuran berkas maksimal 10 MB")
      .nullable()
      .optional()
      .transform((value) => value ?? null),
  })
  .refine((value) => (value.kerjaSamaId === null) !== (value.kegiatanId === null), {
    message: "Berkas harus menempel pada tepat satu naskah atau satu kegiatan.",
    path: ["kerjaSamaId"],
  })
  .refine((value) => (value.path === null) !== (value.tautan === null), {
    message: "Isi salah satu: unggah berkas atau tautan eksternal.",
    path: ["tautan"],
  })
  .refine((value) => value.path === null || BERKAS_PATH_PATTERN.test(value.path), {
    message: "Path berkas tidak valid.",
    path: ["path"],
  })
  .refine(
    (value) =>
      value.kerjaSamaId !== null
        ? JENIS_BERKAS_NASKAH.includes(value.jenis)
        : JENIS_BERKAS_KEGIATAN.includes(value.jenis),
    {
      message: "Jenis berkas tidak sesuai dengan induknya (naskah atau kegiatan).",
      path: ["jenis"],
    },
  )
export type BerkasInput = z.infer<typeof berkasInputSchema>

// ============================================================
// VIEW ADMIN
// ============================================================

export type KerjaSamaAttribution = { id: string; nama: string } | null

export type KategoriMitraRef = {
  id: string
  nama: string
  urutan: number
  aktif: boolean
  jumlahMitra: number
}

export type BentukRef = {
  id: string
  nama: string
  bidang: BidangKerjaSama
  urutan: number
  aktif: boolean
  jumlahPemakai: number // naskah + kegiatan yang memakai bentuk ini
}

export type BentukRingkas = { id: string; nama: string; bidang: BidangKerjaSama }

export type BerkasAdmin = {
  id: string
  jenis: JenisBerkas
  label: string
  /** Path di bucket privat. null kalau berkas berupa tautan eksternal. */
  path: string | null
  tautan: string | null
  mime: string | null
  ukuran: number | null
  createdAt: string
  // Sengaja tanpa URL: bucket privat, URL unduhan dibuat sesaat lewat signed URL.
}

export type MitraAdmin = {
  id: string
  slug: string
  nama: string
  namaSingkat: string | null
  kategoriId: string
  kategori: string
  tingkat: TingkatKerjaSama
  negara: string
  kota: string | null
  website: string | null
  logo: string | null // URL publik siap dipakai untuk <img>
  logoPath: string | null // nilai asli di database
  ringkasan: string
  deskripsi: string[]
  tampilPublik: boolean
  unggulan: boolean
  tampilDiMbkm: boolean
  urutan: number
  kontakNama: string | null
  kontakJabatan: string | null
  kontakEmail: string | null
  kontakTelepon: string | null
  kontakPublik: boolean
  catatanInternal: string | null
  status: StatusMitra
  jumlahNaskah: number
  createdAt: string
  updatedAt: string
  createdBy: KerjaSamaAttribution
  updatedBy: KerjaSamaAttribution
}

export type NaskahAdmin = {
  id: string
  mitraId: string
  mitraNama: string
  jenis: JenisNaskah
  judul: string
  status: StatusNaskah
  masaBerlaku: MasaBerlaku // dihitung saat dibaca
  sisaHari: number | null // negatif = sudah lewat; null = tanpa batas / tidak berlaku
  nomorProdi: string | null
  nomorMitra: string | null
  tempatTtd: string | null
  tanggalTtd: string | null
  mulai: string
  berakhir: string | null
  ruangLingkup: string | null
  pembiayaan: string | null
  ttdProdi: string | null
  ttdMitra: string | null
  pjDosen: { id: string; nama: string } | null
  pjMitra: string | null
  induk: { id: string; jenis: JenisNaskah; judul: string } | null
  perpanjanganDari: { id: string; judul: string } | null
  bentuk: BentukRingkas[]
  jumlahKegiatan: number
  berkas: BerkasAdmin[]
  catatanInternal: string | null
  createdAt: string
  updatedAt: string
  createdBy: KerjaSamaAttribution
  updatedBy: KerjaSamaAttribution
}

/** Ringkasan naskah untuk dropdown (pilih induk, pilih naskah saat input kegiatan). */
export type NaskahOpsi = {
  id: string
  mitraId: string
  jenis: JenisNaskah
  judul: string
  nomorProdi: string | null
  masaBerlaku: MasaBerlaku
}

export type KegiatanAdmin = {
  id: string
  kerjaSamaId: string
  naskahJudul: string
  naskahJenis: JenisNaskah
  mitraId: string
  mitraNama: string
  bidang: BidangKerjaSama
  bentuk: BentukRingkas | null
  judul: string
  uraian: string | null
  manfaat: string[]
  tanggalMulai: string
  tanggalSelesai: string | null
  tahunAkademik: string // dihitung dari tanggalMulai, mis. "2025/2026"
  jumlahPeserta: number | null
  status: StatusKegiatan
  tampilPublik: boolean
  berkas: BerkasAdmin[]
  createdAt: string
  updatedAt: string
  createdBy: KerjaSamaAttribution
  updatedBy: KerjaSamaAttribution
}

// ============================================================
// VIEW PUBLIK (landing)
// Hanya field yang aman dikirim ke pengunjung: tanpa nomor naskah, catatan
// internal, berkas, atau kontak yang tidak dinyalakan.
// ============================================================

export type NaskahPublik = {
  jenis: JenisNaskah
  mulai: string
  berakhir: string | null
  masa: MasaBerlaku
}

export type KegiatanPublik = {
  judul: string
  uraian: string | null
  bidang: BidangKerjaSama
  bentuk: string | null
  tahun: number
}

export type MitraPublik = {
  slug: string
  nama: string
  namaSingkat: string | null
  kategori: string
  tingkat: TingkatKerjaSama
  negara: string
  kota: string | null
  website: string | null
  logo: string | null
  ringkasan: string
  deskripsi: string[]
  lingkup: string[] // nama bentuk kerja sama dari naskah yang berlaku, tanpa duplikat
  status: "Aktif" | "Berakhir"
  segeraBerakhir: boolean
  mulai: string // naskah paling awal
  berakhir: string | null // naskah paling akhir; null bila ada naskah tanpa batas waktu
  unggulan: boolean
  tampilDiMbkm: boolean
  kontak: {
    nama: string | null
    jabatan: string | null
    email: string | null
    telepon: string | null
  } | null
  naskah: NaskahPublik[]
  kegiatan: KegiatanPublik[]
}

export type StatistikKerjaSamaPublik = {
  mitraAktif: number
  totalMitra: number
  jumlahNegara: number
  kegiatanTahunIni: number
}
