import { createImageUploadHandlers } from "@/lib/image-upload-handlers"
import { isMitraLogoInUse } from "@/database/kerja-sama"
import { MITRA_LOGO_FOLDER } from "@/types"

const handlers = createImageUploadHandlers({
  permission: "kerja-sama:manage",
  folder: MITRA_LOGO_FOLDER,
  route: "/api/dashboard/kerja-sama/mitra/upload",
  isInUse: isMitraLogoInUse,
})

export const POST = handlers.POST
export const DELETE = handlers.DELETE