import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import {
  deleteKegiatan,
  getKegiatanByIdAdmin,
  kerjaSamaErrorResponse,
  updateKegiatan,
} from "@/database/kerja-sama"
import { kegiatanInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/kegiatan/[id]"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requirePermission("kerja-sama:manage")
    const { id } = await params
    const kegiatanId = parseBigIntId(id)

    const kegiatan = await getKegiatanByIdAdmin(kegiatanId)
    if (!kegiatan) {
      return apiResponse({ success: false, message: "Kegiatan tidak ditemukan." }, 404)
    }

    return apiResponse({ success: true, data: kegiatan })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("kerja-sama:manage")
    const { id } = await params
    const kegiatanId = parseBigIntId(id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = kegiatanInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const kegiatan = await updateKegiatan(kegiatanId, parsed.data, user)
    return apiResponse({ success: true, data: kegiatan })
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
    const kegiatanId = parseBigIntId(id)

    await deleteKegiatan(kegiatanId, user)
    return apiResponse({ success: true })
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}