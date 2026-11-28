import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { cabutKodeUnduh, kerjaSamaErrorResponse } from "@/database/kerja-sama"

const ROUTE = "/api/dashboard/kerja-sama/kode/[id]/cabut"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(_request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("kerja-sama:manage")
    const { id } = await params

    const kode = await cabutKodeUnduh(parseBigIntId(id), user)
    return apiResponse({ success: true, data: kode })
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}