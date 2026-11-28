import "server-only"

import { generateFileName, getFileExtension, supabaseStorage } from "@/lib/storage"
import {
  BERKAS_ALLOWED_MIME,
  BERKAS_KEGIATAN_FOLDER,
  BERKAS_MAX_SIZE,
  BERKAS_NASKAH_FOLDER,
} from "@/types"

// ============================================================
// STORAGE PRIVAT UNTUK NASKAH & BUKTI KERJA SAMA
// Bucket "kerja-sama" HARUS dibuat di Supabase dengan public = OFF.
// Tidak ada getPublicUrl di sini: berkas hanya bisa dibuka lewat signed URL
// yang berumur pendek dan hanya dibuat oleh API yang sudah lolos
// requirePermission("kerja-sama:manage") atau oleh verifikasi kode unduh.
// ============================================================

export const KERJA_SAMA_BUCKET = "kerja-sama"

export const SIGNED_URL_TTL_DETIK = 5 * 60

export type BerkasFolder = typeof BERKAS_NASKAH_FOLDER | typeof BERKAS_KEGIATAN_FOLDER

const MIME_EXTENSIONS: Record<string, readonly string[]> = {
  "application/pdf": ["pdf"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
}

/** Cek byte awal file; `file.type` dan nama file dikirim klien dan bisa dipalsukan. */
async function hasValidSignature(file: File, mime: string) {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer())

  switch (mime) {
    case "application/pdf": // "%PDF-"
      return head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46 && head[4] === 0x2d
    case "image/jpeg":
      return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff
    case "image/png":
      return head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47
    case "image/webp": // "RIFF" .... "WEBP"
      return (
        head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46 &&
        head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50
      )
    default:
      return false
  }
}

export type UploadBerkasResult =
  | { success: true; path: string; mime: string; size: number }
  | { success: false; error: string }

export async function uploadKerjaSamaBerkas(
  file: File,
  folder: BerkasFolder,
): Promise<UploadBerkasResult> {
  if (file.size <= 0) return { success: false, error: "File kosong atau tidak valid." }
  if (file.size > BERKAS_MAX_SIZE) {
    return {
      success: false,
      error: `Ukuran file terlalu besar. Maksimal ${BERKAS_MAX_SIZE / (1024 * 1024)} MB.`,
    }
  }

  const mime = file.type.toLowerCase().trim()
  if (!(BERKAS_ALLOWED_MIME as readonly string[]).includes(mime)) {
    return { success: false, error: "Format file tidak didukung. Gunakan PDF, JPG, PNG, atau WebP." }
  }

  const extension = getFileExtension(file.name)
  if (!MIME_EXTENSIONS[mime]?.includes(extension)) {
    return { success: false, error: "Tipe file dan extension tidak sesuai." }
  }

  if (!(await hasValidSignature(file, mime))) {
    return { success: false, error: "Isi file tidak sesuai dengan formatnya." }
  }

  const path = `${folder}/${generateFileName(folder, extension)}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabaseStorage.storage.from(KERJA_SAMA_BUCKET).upload(path, buffer, {
    contentType: mime,
    upsert: false,
    cacheControl: "0", // jangan di-cache CDN: berkas privat
  })

  if (error) {
    console.error("[KERJA_SAMA_UPLOAD]", error)
    return { success: false, error: "Gagal menyimpan file ke Storage." }
  }

  return { success: true, path, mime, size: file.size }
}

/** URL unduhan sesaat. null kalau file tidak ada / gagal dibuat. */
export async function createBerkasSignedUrl(
  path: string,
  options: { downloadName?: string; ttlDetik?: number } = {},
): Promise<string | null> {
  const { data, error } = await supabaseStorage.storage
    .from(KERJA_SAMA_BUCKET)
    .createSignedUrl(
      path,
      options.ttlDetik ?? SIGNED_URL_TTL_DETIK,
      options.downloadName ? { download: options.downloadName } : undefined,
    )

  if (error || !data?.signedUrl) {
    console.error("[KERJA_SAMA_SIGNED_URL]", error)
    return null
  }
  return data.signedUrl
}

/** Hapus satu atau banyak file. Best-effort: kegagalan dicatat, tidak dilempar. */
export async function deleteKerjaSamaFiles(paths: Array<string | null | undefined>) {
  const valid = paths.filter(
    (path): path is string =>
      typeof path === "string" &&
      (path.startsWith(`${BERKAS_NASKAH_FOLDER}/`) || path.startsWith(`${BERKAS_KEGIATAN_FOLDER}/`)),
  )
  if (valid.length === 0) return

  try {
    const { error } = await supabaseStorage.storage.from(KERJA_SAMA_BUCKET).remove(valid)
    if (error) console.error("[KERJA_SAMA_CLEANUP]", error)
  } catch (error) {
    console.error("[KERJA_SAMA_CLEANUP]", error)
  }
}