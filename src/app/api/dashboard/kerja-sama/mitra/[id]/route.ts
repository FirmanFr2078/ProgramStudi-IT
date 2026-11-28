import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import {
  deleteMitra,
  getMitraByIdAdmin,
  kerjaSamaErrorResponse,
  updateMitra,
} from "@/database/kerja-sama"
import { mitraInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/mitra/[id]"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requirePermission("kerja-sama:manage")
    const { id } = await params
    const mitraId = parseBigIntId(id)

    const mitra = await getMitraByIdAdmin(mitraId)
    if (!mitra) {
      return apiResponse({ success: false, message: "Mitra tidak ditemukan." }, 404)
    }

    return apiResponse({ success: true, data: mitra })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("kerja-sama:manage")
    const { id } = await params
    const mitraId = parseBigIntId(id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = mitraInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const mitra = await updateMitra(mitraId, parsed.data, user)
    return apiResponse({ success: true, data: mitra })
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
    const mitraId = parseBigIntId(id)

    await deleteMitra(mitraId, user)
    return apiResponse({ success: true })
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}