import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { kerjaSamaErrorResponse, setBerkasUtama } from "@/database/kerja-sama"

const ROUTE = "/api/dashboard/kerja-sama/berkas/[id]/utama"

type RouteContext = { params: Promise<{ id: string }> }

// Jadikan berkas ini berkas utama naskahnya (yang diunduh lewat kode di landing).
export async function POST(_request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("kerja-sama:manage")
    const { id } = await params

    const berkas = await setBerkasUtama(parseBigIntId(id), user)
    return apiResponse({ success: true, data: berkas })
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}