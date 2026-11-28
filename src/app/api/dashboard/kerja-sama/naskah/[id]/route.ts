import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import {
  deleteNaskah,
  getNaskahByIdAdmin,
  kerjaSamaErrorResponse,
  updateNaskah,
} from "@/database/kerja-sama"
import { naskahInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/naskah/[id]"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requirePermission("kerja-sama:manage")
    const { id } = await params
    const naskahId = parseBigIntId(id)

    const naskah = await getNaskahByIdAdmin(naskahId)
    if (!naskah) {
      return apiResponse({ success: false, message: "Naskah tidak ditemukan." }, 404)
    }

    return apiResponse({ success: true, data: naskah })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("kerja-sama:manage")
    const { id } = await params
    const naskahId = parseBigIntId(id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = naskahInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const naskah = await updateNaskah(naskahId, parsed.data, user)
    return apiResponse({ success: true, data: naskah })
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
    const naskahId = parseBigIntId(id)

    await deleteNaskah(naskahId, user)
    return apiResponse({ success: true })
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}