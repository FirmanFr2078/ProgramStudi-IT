import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { createMitra, kerjaSamaErrorResponse, listMitraAdmin } from "@/database/kerja-sama"
import { mitraInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/mitra"

export async function GET() {
  try {
    await requirePermission("kerja-sama:manage")
    const data = await listMitraAdmin()
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requirePermission("kerja-sama:manage")

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

    const mitra = await createMitra(parsed.data, user)
    return apiResponse({ success: true, data: mitra }, 201)
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}