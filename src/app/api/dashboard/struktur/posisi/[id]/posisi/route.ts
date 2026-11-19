import { apiResponse, handleApiError } from "@/lib/api-response"
import { requirePermission } from "@/lib/auth"
import { parseBigIntId } from "@/lib/ids"
import { movePosisi } from "@/database/struktur"
import { strukturPosisiPositionSchema } from "@/types"

const ROUTE = "/api/dashboard/struktur/posisi/[id]/posisi"
const PERMISSION = "struktur:manage"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requirePermission(PERMISSION)
    const { id } = await params

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = strukturPosisiPositionSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    await movePosisi(parseBigIntId(id), parsed.data)
    return apiResponse({ success: true })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [PATCH]`)
  }
}