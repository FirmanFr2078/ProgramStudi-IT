import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { deleteBerkas, kerjaSamaErrorResponse } from "@/database/kerja-sama"

const ROUTE = "/api/dashboard/kerja-sama/berkas/[id]"

type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("kerja-sama:manage")
    const { id } = await params
    const berkasId = parseBigIntId(id)

    await deleteBerkas(berkasId, user)
    return apiResponse({ success: true })
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}