import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { addBerkas, kerjaSamaErrorResponse } from "@/database/kerja-sama"
import { berkasInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/berkas"

// Catat metadata berkas SETELAH file terunggah lewat /berkas/upload (atau berupa tautan).
export async function POST(request: Request) {
  try {
    const user = await requirePermission("kerja-sama:manage")

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = berkasInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const berkas = await addBerkas(parsed.data, user)
    return apiResponse({ success: true, data: berkas }, 201)
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}