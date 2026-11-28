import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { deleteBerkasFasilitas, fasilitasErrorResponse } from "@/database/fasilitas"

const ROUTE = "/api/dashboard/fasilitas/berkas/[id]"

type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("fasilitas:manage")
    const { id } = await params
    const berkasId = parseBigIntId(id)

    await deleteBerkasFasilitas(berkasId, user)
    return apiResponse({ success: true })
  } catch (error) {
    const mapped = fasilitasErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}