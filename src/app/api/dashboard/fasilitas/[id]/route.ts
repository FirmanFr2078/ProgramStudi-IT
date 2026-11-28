import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { deleteFasilitas, fasilitasErrorResponse, getFasilitasByIdAdmin, updateFasilitas } from "@/database/fasilitas"
import { fasilitasInputSchema } from "@/types"

const ROUTE = "/api/dashboard/fasilitas/[id]"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requirePermission("fasilitas:manage")
    const { id } = await params
    const fasilitasId = parseBigIntId(id)

    const fasilitas = await getFasilitasByIdAdmin(fasilitasId)
    if (!fasilitas) {
      return apiResponse({ success: false, message: "Fasilitas tidak ditemukan." }, 404)
    }

    return apiResponse({ success: true, data: fasilitas })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("fasilitas:manage")
    const { id } = await params
    const fasilitasId = parseBigIntId(id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = fasilitasInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const fasilitas = await updateFasilitas(fasilitasId, parsed.data, user)
    return apiResponse({ success: true, data: fasilitas })
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
    const fasilitasId = parseBigIntId(id)

    await deleteFasilitas(fasilitasId, user)
    return apiResponse({ success: true })
  } catch (error) {
    const mapped = fasilitasErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}