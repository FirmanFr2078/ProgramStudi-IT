import { createImageUploadHandlers } from "@/lib/image-upload-handlers"
import { KABAR_FOTO_FOLDER } from "@/types"

const handlers = createImageUploadHandlers({
  permission: "berita:manage",
  folder: KABAR_FOTO_FOLDER,
  route: "/api/dashboard/kabar/upload",
})

export const POST = handlers.POST
export const DELETE = handlers.DELETE