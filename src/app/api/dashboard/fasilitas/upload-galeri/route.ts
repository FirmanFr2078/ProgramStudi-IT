import { createImageUploadHandlers } from "@/lib/image-upload-handlers"
import { isBerkasFasilitasPathInUse } from "@/database/fasilitas"
import { FASILITAS_GALERI_FOLDER } from "@/types"

const handlers = createImageUploadHandlers({
  permission: "fasilitas:manage",
  folder: FASILITAS_GALERI_FOLDER,
  route: "/api/dashboard/fasilitas/upload-galeri",
  isInUse: isBerkasFasilitasPathInUse,
})

export const POST = handlers.POST
export const DELETE = handlers.DELETE