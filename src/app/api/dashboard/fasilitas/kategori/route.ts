import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { createKategoriFasilitas, listKategoriFasilitas } from "@/database/fasilitas"
import { fasilitasErrorResponse } from "@/database/fasilitas"
import { kategoriFasilitasInputSchema } from "@/types"

const ROUTE = "/api/dashboard/fasilitas/kategori"

export async function GET() {
  try {
    await requirePermission("fasilitas:manage")
    const data = await listKategoriFasilitas()
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

    const parsed = kategoriFasilitasInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const kategori = await createKategoriFasilitas(parsed.data, user)
    return apiResponse({ success: true, data: kategori }, 201)
  } catch (error) {
    const mapped = fasilitasErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}