import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { createNaskah, kerjaSamaErrorResponse, listNaskahAdmin } from "@/database/kerja-sama"
import { naskahInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/naskah"

// ?mitraId=123 -> hanya naskah milik satu mitra (tab Naskah di detail mitra)
export async function GET(request: Request) {
  try {
    await requirePermission("kerja-sama:manage")
    const mitraIdParam = new URL(request.url).searchParams.get("mitraId")
    const data = await listNaskahAdmin(
      mitraIdParam ? { mitraId: parseBigIntId(mitraIdParam) } : {},
    )
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

    const parsed = naskahInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const naskah = await createNaskah(parsed.data, user)
    return apiResponse({ success: true, data: naskah }, 201)
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}