import { isDosenFotoInUse } from "@/database/dosen"
import { createImageUploadHandlers } from "@/lib/image-upload-handlers"
import { DOSEN_FOTO_FOLDER } from "@/types"

const handlers = createImageUploadHandlers({
  permission: "sdm:manage",
  folder: DOSEN_FOTO_FOLDER,
  route: "/api/dashboard/sdm/dosen/upload",
  isInUse: isDosenFotoInUse,
})

export const POST = handlers.POST
export const DELETE = handlers.DELETE