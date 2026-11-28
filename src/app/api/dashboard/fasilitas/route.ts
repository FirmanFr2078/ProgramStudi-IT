import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { createFasilitas, fasilitasErrorResponse, listFasilitasAdmin } from "@/database/fasilitas"
import { fasilitasInputSchema } from "@/types"

const ROUTE = "/api/dashboard/fasilitas"

export async function GET() {
  try {
    await requirePermission("fasilitas:manage")
    const data = await listFasilitasAdmin()
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requirePermission("fasilitas:manage")

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = fasilitasInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const fasilitas = await createFasilitas(parsed.data, user)
    return apiResponse({ success: true, data: fasilitas }, 201)
  } catch (error) {
    const mapped = fasilitasErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}