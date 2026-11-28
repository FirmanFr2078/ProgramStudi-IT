import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { addBerkasFasilitas, fasilitasErrorResponse } from "@/database/fasilitas"
import { berkasFasilitasInputSchema } from "@/types"

const ROUTE = "/api/dashboard/fasilitas/berkas"

export async function POST(request: Request) {
  try {
    const user = await requirePermission("fasilitas:manage")

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = berkasFasilitasInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const berkas = await addBerkasFasilitas(parsed.data, user)
    return apiResponse({ success: true, data: berkas }, 201)
  } catch (error) {
    const mapped = fasilitasErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}