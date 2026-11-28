import { createImageUploadHandlers } from "@/lib/image-upload-handlers"
import { isNaskahPreviewInUse } from "@/database/kerja-sama"
import { NASKAH_PREVIEW_FOLDER } from "@/types"

// Gambar halaman pertama naskah (banner kartu landing). Dibuat di browser admin
// dari PDF, lalu diunggah ke bucket "images" yang publik.
const handlers = createImageUploadHandlers({
  permission: "kerja-sama:manage",
  folder: NASKAH_PREVIEW_FOLDER,
  route: "/api/dashboard/kerja-sama/naskah/upload-preview",
  isInUse: isNaskahPreviewInUse,
})

export const POST = handlers.POST
export const DELETE = handlers.DELETE