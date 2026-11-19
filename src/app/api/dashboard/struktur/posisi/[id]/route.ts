import { apiResponse, handleApiError } from "@/lib/api-response"
import { requirePermission } from "@/lib/auth"
import { parseBigIntId } from "@/lib/ids"
import { deletePosisi, StrukturError, updatePosisi } from "@/database/struktur"
import { strukturPosisiUpdateSchema } from "@/types"

const ROUTE = "/api/dashboard/struktur/posisi/[id]"
const PERMISSION = "struktur:manage"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission(PERMISSION)
    const { id } = await params
    const posisiId = parseBigIntId(id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = strukturPosisiUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const data = await updatePosisi(posisiId, parsed.data, user)
    return apiResponse({ success: true, data })
  } catch (error) {
    if (error instanceof StrukturError) {
      return apiResponse({ success: false, message: error.message }, 400)
    }
    return handleApiError(error, `${ROUTE} [PATCH]`)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission(PERMISSION)
    const { id } = await params

    await deletePosisi(parseBigIntId(id), user)
    return apiResponse({ success: true })
  } catch (error) {
    if (error instanceof StrukturError) {
      return apiResponse({ success: false, message: error.message }, 400)
    }
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}