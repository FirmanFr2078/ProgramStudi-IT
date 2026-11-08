// src/lib/storage.ts

import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// ============================================================
// ENVIRONMENT
// ============================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL belum dikonfigurasi.")
}

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi.")
}

// ============================================================
// KONFIGURASI STORAGE
// ============================================================

export const STORAGE_BUCKETS = {
  IMAGES: "images",
  DOCUMENTS: "documents",
} as const

export const STORAGE_CONFIG = {
  images: {
    bucket: STORAGE_BUCKETS.IMAGES,
    maxFileSize: 2 * 1024 * 1024, // 2 MB
    allowedMimeTypes: new Set(["image/jpeg", "image/png", "image/webp"]),
    allowedExtensions: new Set(["jpg", "jpeg", "png", "webp"]),
    cacheControl: "3600",
  },
  documents: {
    bucket: STORAGE_BUCKETS.DOCUMENTS,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: new Set(["application/pdf"]),
    allowedExtensions: new Set(["pdf"]),
    cacheControl: "3600",
  },
} as const

export type StorageCategory = keyof typeof STORAGE_CONFIG

// ============================================================
// SUPABASE STORAGE CLIENT
// ============================================================

/**
 * Supabase client khusus server, pakai SERVICE ROLE KEY.
 * JANGAN import file ini ke Client Component / browser.
 */
export const supabaseStorage: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
)

// ============================================================
// HELPER — FILE EXTENSION
// ============================================================

export function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().trim().split(".")
  if (parts.length < 2) return ""
  return parts.at(-1) ?? ""
}

// ============================================================
// MIME <-> EXTENSION
// ============================================================

const MIME_EXTENSION_MAP: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "application/pdf": ["pdf"],
}

// ============================================================
// VALIDASI FILE
// ============================================================

export type StorageValidationResult =
  | { valid: true; mimeType: string; extension: string }
  | { valid: false; message: string }

export function validateFile(
  category: StorageCategory,
  file: File
): StorageValidationResult {
  const config = STORAGE_CONFIG[category]

  if (file.size <= 0) {
    return { valid: false, message: "File kosong atau tidak valid." }
  }

  if (file.size > config.maxFileSize) {
    return {
      valid: false,
      message: `Ukuran file terlalu besar. Maksimal ${config.maxFileSize / (1024 * 1024)} MB.`,
    }
  }

  const mimeType = file.type.toLowerCase().trim()

  if (!config.allowedMimeTypes.has(mimeType)) {
    return { valid: false, message: "Format file tidak didukung." }
  }

  const extension = getFileExtension(file.name)

  if (!config.allowedExtensions.has(extension)) {
    return { valid: false, message: "Extension file tidak didukung." }
  }

  const allowedExtensions = MIME_EXTENSION_MAP[mimeType]

  if (!allowedExtensions || !allowedExtensions.includes(extension)) {
    return { valid: false, message: "Tipe file dan extension tidak sesuai." }
  }

  return { valid: true, mimeType, extension }
}

// ============================================================
// GENERATE NAMA OBJECT
// ============================================================

export function generateFileName(prefix: string, extension: string): string {
  const uniqueId = crypto.randomUUID()
  return `${prefix}-${uniqueId}.${extension}`
}

// ============================================================
// UPLOAD FILE
// ============================================================

type UploadOptions = {
  /** subfolder di dalam bucket, mis. "kabar", "dosen", "kurikulum" */
  folder: string
  /** prefix nama file, default pakai nama folder */
  prefix?: string
}

export async function uploadFile(
  category: StorageCategory,
  file: File,
  options: UploadOptions
) {
  const validation = validateFile(category, file)

  if (!validation.valid) {
    return { success: false as const, error: validation.message }
  }

  const config = STORAGE_CONFIG[category]
  const fileName = generateFileName(options.prefix ?? options.folder, validation.extension)
  const objectPath = `${options.folder}/${fileName}`

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error: uploadError } = await supabaseStorage.storage
    .from(config.bucket)
    .upload(objectPath, buffer, {
      contentType: validation.mimeType,
      upsert: false,
      cacheControl: config.cacheControl,
    })

  if (uploadError) {
    console.error("Supabase Storage Upload Error:", uploadError)
    return { success: false as const, error: "Gagal menyimpan file ke Storage." }
  }

  const publicUrl = getPublicUrl(category, objectPath)

  if (!publicUrl) {
    await deleteFile(category, objectPath)
    return {
      success: false as const,
      error: "File berhasil diupload tetapi URL tidak dapat dibuat.",
    }
  }

  return {
    success: true as const,
    path: objectPath,
    url: publicUrl,
    mimeType: validation.mimeType,
    size: file.size,
  }
}

// ============================================================
// PUBLIC URL
// ============================================================

export function getPublicUrl(category: StorageCategory, objectPath: string): string | null {
  const config = STORAGE_CONFIG[category]
  const { data } = supabaseStorage.storage.from(config.bucket).getPublicUrl(objectPath)
  return data?.publicUrl ?? null
}

// ============================================================
// EXTRACT OBJECT PATH DARI PUBLIC URL
// ============================================================

export function extractObjectPath(category: StorageCategory, fileUrl: string): string | null {
  const config = STORAGE_CONFIG[category]
  const expectedPrefix = `${supabaseUrl}/storage/v1/object/public/${config.bucket}/`

  if (!fileUrl.startsWith(expectedPrefix)) return null

  return decodeURIComponent(fileUrl.slice(expectedPrefix.length)) || null
}

// ============================================================
// DELETE FILE
// ============================================================

export async function deleteFile(category: StorageCategory, objectPath: string) {
  const config = STORAGE_CONFIG[category]
  const { error } = await supabaseStorage.storage.from(config.bucket).remove([objectPath])

  if (error) {
    console.error("Supabase Storage Delete Error:", error)
    return { success: false as const, error: "Gagal menghapus file dari Storage." }
  }

  return { success: true as const }
}

export async function deleteFileByUrl(category: StorageCategory, fileUrl: string) {
  const objectPath = extractObjectPath(category, fileUrl)

  if (!objectPath) {
    return { success: false as const, error: "URL file tidak valid." }
  }

  return deleteFile(category, objectPath)
}

// ============================================================
// HEALTH CHECK
// ============================================================

export async function checkStorageConnection() {
  try {
    const { data, error } = await supabaseStorage.storage
      .from(STORAGE_BUCKETS.IMAGES)
      .list("", { limit: 1, offset: 0 })

    if (error) {
      console.error("Supabase Storage Health Check Error:", error)
      return { connected: false, error: error.message }
    }

    return { connected: true, bucket: STORAGE_BUCKETS.IMAGES, accessible: Array.isArray(data) }
  } catch (error: unknown) {
    console.error("Storage Health Check Error:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Storage tidak dapat diakses.",
    }
  }
}