import "server-only"

import { apiResponse, handleApiError } from "@/lib/api-response"
import { requirePermission } from "@/lib/auth"
import { deleteFile, uploadFile } from "@/lib/storage"
import type { Permission } from "@/types"

type ImageUploadOptions = {
  permission: Permission
  /** Subfolder di bucket "images", mis. "dosen". Upload & hapus hanya boleh di folder ini. */
  folder: string
  /** Label untuk log error, mis. "/api/dashboard/sdm/dosen/upload". */
  route: string
  /**
   * Opsional: kembalikan true kalau file sedang dipakai data di database.
   * Endpoint DELETE dipakai untuk rollback file yang baru diunggah, jadi
   * file yang sudah dipakai data tidak boleh bisa dihapus lewat sini.
   */
  isInUse?: (path: string) => Promise<boolean>
}

const SIGNATURE_CHECKED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

/**
 * storage.ts memeriksa file.type dan nama file, dua-duanya dikirim klien
 * dan bisa dipalsukan. Di sini isi file dicek langsung lewat byte awalnya.
 */
async function hasValidImageSignature(file: File) {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const type = file.type.toLowerCase()

  if (type === "image/jpeg") {
    return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff
  }
  if (type === "image/png") {
    return head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47
  }
  if (type === "image/webp") {
    // "RIFF" .... "WEBP"
    return (
      head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46 &&
      head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50
    )
  }
  return false
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function createImageUploadHandlers({
  permission,
  folder,
  route,
  isInUse,
}: ImageUploadOptions) {
  const pathPattern = new RegExp(`^${escapeRegExp(folder)}/[A-Za-z0-9._-]+$`)

  async function POST(request: Request) {
    try {
      await requirePermission(permission)

      let formData: FormData
      try {
        formData = await request.formData()
      } catch {
        return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
      }

      const file = formData.get("file")
      if (!(file instanceof File)) {
        return apiResponse({ success: false, message: "Pilih gambar terlebih dahulu." }, 400)
      }

      if (SIGNATURE_CHECKED_TYPES.has(file.type.toLowerCase()) && !(await hasValidImageSignature(file))) {
        return apiResponse(
          { success: false, message: "Isi file tidak sesuai dengan format gambarnya." },
          400,
        )
      }

      const uploaded = await uploadFile("images", file, { folder })
      if (!uploaded.success) {
        return apiResponse({ success: false, message: uploaded.error }, 400)
      }

      return apiResponse(
        { success: true, data: { path: uploaded.path, url: uploaded.url } },
        201,
      )
    } catch (error) {
      return handleApiError(error, `${route} [POST]`)
    }
  }

  async function DELETE(request: Request) {
    try {
      await requirePermission(permission)

      let body: unknown
      try {
        body = await request.json()
      } catch {
        return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
      }

      const path =
        typeof body === "object" && body !== null && "path" in body
          ? (body as { path?: unknown }).path
          : undefined

      if (typeof path !== "string" || !pathPattern.test(path)) {
        return apiResponse({ success: false, message: "Path file tidak valid." }, 400)
      }

      if (isInUse && (await isInUse(path))) {
        return apiResponse(
          { success: false, message: "File ini sedang dipakai dan tidak bisa dihapus." },
          409,
        )
      }

      const result = await deleteFile("images", path)
      if (!result.success) {
        return apiResponse({ success: false, message: result.error }, 400)
      }

      return apiResponse({ success: true })
    } catch (error) {
      return handleApiError(error, `${route} [DELETE]`)
    }
  }

  return { POST, DELETE }
}