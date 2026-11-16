import { apiResponse, handleApiError } from "@/lib/api-response"
import { requirePermission } from "@/lib/auth"
import { parseBigIntId } from "@/lib/ids"
import {
  deleteDosen,
  DosenConflictError,
  getDosenByIdAdmin,
  updateDosen,
} from "@/database/dosen"
import { dosenInputSchema } from "@/types"

const ROUTE = "/api/dashboard/sdm/dosen/[id]"
const PERMISSION = "sdm:manage"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requirePermission(PERMISSION)
    const { id } = await params

    const dosen = await getDosenByIdAdmin(parseBigIntId(id))
    if (!dosen) {
      return apiResponse({ success: false, message: "Data dosen tidak ditemukan." }, 404)
    }

    return apiResponse({ success: true, data: dosen })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission(PERMISSION)
    const { id } = await params
    const dosenId = parseBigIntId(id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = dosenInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const dosen = await updateDosen(dosenId, parsed.data, user)
    return apiResponse({ success: true, data: dosen })
  } catch (error) {
    if (error instanceof DosenConflictError) {
      return apiResponse(
        { success: false, message: "Ada isian yang sudah dipakai dosen lain.", errors: error.errors },
        409,
      )
    }
    return handleApiError(error, `${ROUTE} [PATCH]`)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission(PERMISSION)
    const { id } = await params

    await deleteDosen(parseBigIntId(id), user)
    return apiResponse({ success: true })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}