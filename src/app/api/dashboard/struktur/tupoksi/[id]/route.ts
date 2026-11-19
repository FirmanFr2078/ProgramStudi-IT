import { apiResponse, handleApiError } from "@/lib/api-response"
import { requirePermission } from "@/lib/auth"
import { parseBigIntId } from "@/lib/ids"
import { deleteTupoksi, updateTupoksi } from "@/database/struktur"
import { strukturTupoksiUpdateSchema } from "@/types"

const ROUTE = "/api/dashboard/struktur/tupoksi/[id]"
const PERMISSION = "struktur:manage"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission(PERMISSION)
    const { id } = await params

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = strukturTupoksiUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const data = await updateTupoksi(parseBigIntId(id), parsed.data, user)
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [PATCH]`)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission(PERMISSION)
    const { id } = await params

    await deleteTupoksi(parseBigIntId(id), user)
    return apiResponse({ success: true })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}