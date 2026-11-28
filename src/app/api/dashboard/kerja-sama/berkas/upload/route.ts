import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { isBerkasPathInUse } from "@/database/kerja-sama"
import { deleteKerjaSamaFiles, uploadKerjaSamaBerkas } from "@/lib/kerja-sama-storage"
import { BERKAS_KEGIATAN_FOLDER, BERKAS_NASKAH_FOLDER } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/berkas/upload"

const PATH_PATTERN = new RegExp(
  `^(?:${BERKAS_NASKAH_FOLDER}|${BERKAS_KEGIATAN_FOLDER})/[A-Za-z0-9._-]+$`,
)

// Unggah ke bucket PRIVAT "kerja-sama". form-data: file + folder ("naskah" | "kegiatan").
// Hasilnya {path, mime, ukuran}; metadata baru disimpan lewat POST /berkas.
export async function POST(request: Request) {
  try {
    await requirePermission("kerja-sama:manage")

    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const file = formData.get("file")
    const folder = formData.get("folder")

    if (!(file instanceof File)) {
      return apiResponse({ success: false, message: "Pilih file terlebih dahulu." }, 400)
    }
    if (folder !== BERKAS_NASKAH_FOLDER && folder !== BERKAS_KEGIATAN_FOLDER) {
      return apiResponse({ success: false, message: "Folder tujuan tidak valid." }, 400)
    }

    const uploaded = await uploadKerjaSamaBerkas(file, folder)
    if (!uploaded.success) {
      return apiResponse({ success: false, message: uploaded.error }, 400)
    }

    return apiResponse(
      { success: true, data: { path: uploaded.path, mime: uploaded.mime, ukuran: uploaded.size } },
      201,
    )
  } catch (error) {
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}

// Rollback file yang baru diunggah tapi metadatanya batal disimpan.
// File yang sudah tercatat di database tidak boleh dihapus lewat sini.
export async function DELETE(request: Request) {
  try {
    await requirePermission("kerja-sama:manage")

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

    if (typeof path !== "string" || !PATH_PATTERN.test(path)) {
      return apiResponse({ success: false, message: "Path file tidak valid." }, 400)
    }

    if (await isBerkasPathInUse(path)) {
      return apiResponse(
        { success: false, message: "File ini sedang dipakai dan tidak bisa dihapus." },
        409,
      )
    }

    await deleteKerjaSamaFiles([path])
    return apiResponse({ success: true })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}