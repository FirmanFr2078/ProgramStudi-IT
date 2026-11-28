import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import {
  deleteKategoriMitra,
  kerjaSamaErrorResponse,
  updateKategoriMitra,
} from "@/database/kerja-sama"
import { kategoriMitraInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/referensi/kategori/[id]"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("kerja-sama:manage")
    const { id } = await params
    const kategoriId = parseBigIntId(id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = kategoriMitraInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const kategori = await updateKategoriMitra(kategoriId, parsed.data, user)
    return apiResponse({ success: true, data: kategori })
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [PATCH]`)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("kerja-sama:manage")
    const { id } = await params
    const kategoriId = parseBigIntId(id)

    await deleteKategoriMitra(kategoriId, user)
    return apiResponse({ success: true })
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}