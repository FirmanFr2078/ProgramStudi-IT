import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { deleteKategoriFasilitas, fasilitasErrorResponse, updateKategoriFasilitas } from "@/database/fasilitas"
import { kategoriFasilitasInputSchema } from "@/types"

const ROUTE = "/api/dashboard/fasilitas/kategori/[id]"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("fasilitas:manage")
    const { id } = await params
    const kategoriId = parseBigIntId(id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = kategoriFasilitasInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const kategori = await updateKategoriFasilitas(kategoriId, parsed.data, user)
    return apiResponse({ success: true, data: kategori })
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
    const kategoriId = parseBigIntId(id)

    await deleteKategoriFasilitas(kategoriId, user)
    return apiResponse({ success: true })
  } catch (error) {
    const mapped = fasilitasErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}