import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { deleteAlat, fasilitasErrorResponse, updateAlat } from "@/database/fasilitas"
import { alatInputSchema } from "@/types"

const ROUTE = "/api/dashboard/fasilitas/alat/[id]"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("fasilitas:manage")
    const { id } = await params
    const alatId = parseBigIntId(id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = alatInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const alat = await updateAlat(alatId, parsed.data, user)
    return apiResponse({ success: true, data: alat })
  } catch (error) {
    const mapped = fasilitasErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [PATCH]`)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("fasilitas:manage")
    const { id } = await params
    const alatId = parseBigIntId(id)

    await deleteAlat(alatId, user)
    return apiResponse({ success: true })
  } catch (error) {
    const mapped = fasilitasErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}