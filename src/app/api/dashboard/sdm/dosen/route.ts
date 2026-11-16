import { apiResponse, handleApiError } from "@/lib/api-response"
import { requirePermission } from "@/lib/auth"
import { createDosen, DosenConflictError, listDosenAdmin } from "@/database/dosen"
import { dosenInputSchema } from "@/types"

const ROUTE = "/api/dashboard/sdm/dosen"
const PERMISSION = "sdm:manage"

export async function GET() {
  try {
    await requirePermission(PERMISSION)
    const data = await listDosenAdmin()
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requirePermission(PERMISSION)

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

    const dosen = await createDosen(parsed.data, user)
    return apiResponse({ success: true, data: dosen }, 201)
  } catch (error) {
    if (error instanceof DosenConflictError) {
      return apiResponse(
        { success: false, message: "Ada isian yang sudah dipakai dosen lain.", errors: error.errors },
        409,
      )
    }
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}