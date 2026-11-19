import { apiResponse, handleApiError } from "@/lib/api-response"
import { requirePermission } from "@/lib/auth"
import { createTupoksi, StrukturError } from "@/database/struktur"
import { strukturTupoksiInputSchema } from "@/types"

const ROUTE = "/api/dashboard/struktur/tupoksi"
const PERMISSION = "struktur:manage"

export async function POST(request: Request) {
  try {
    const user = await requirePermission(PERMISSION)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = strukturTupoksiInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const data = await createTupoksi(parsed.data, user)
    return apiResponse({ success: true, data }, 201)
  } catch (error) {
    if (error instanceof StrukturError) {
      return apiResponse({ success: false, message: error.message }, 400)
    }
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}