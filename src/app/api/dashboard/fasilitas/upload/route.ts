import { createImageUploadHandlers } from "@/lib/image-upload-handlers"
import { isFasilitasFotoInUse } from "@/database/fasilitas"
import { FASILITAS_FOTO_FOLDER } from "@/types"

const handlers = createImageUploadHandlers({
  permission: "fasilitas:manage",
  folder: FASILITAS_FOTO_FOLDER,
  route: "/api/dashboard/fasilitas/upload",
  isInUse: isFasilitasFotoInUse,
})

export const POST = handlers.POST
export const DELETE = handlers.DELETE