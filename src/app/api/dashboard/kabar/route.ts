import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { createKabar, listKabarAdmin } from "@/database/kabar"
import { kabarInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kabar"

export async function GET() {
  try {
    await requirePermission("berita:manage")
    const data = await listKabarAdmin()
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requirePermission("berita:manage")

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = kabarInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const kabar = await createKabar(parsed.data, user)
    return apiResponse({ success: true, data: kabar }, 201)
  } catch (error) {
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}