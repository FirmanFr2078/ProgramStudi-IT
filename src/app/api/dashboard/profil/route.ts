import { apiResponse, handleApiError } from "@/lib/api-response"
import { requirePermission } from "@/lib/auth"
import { getProfilProdiAdmin, ProfilProdiValidationError, saveProfilProdi } from "@/database/profil"
import { profilProdiInputSchema } from "@/types"

const ROUTE = "/api/dashboard/profil"
const PERMISSION = "profil:manage"

export async function GET() {
  try {
    await requirePermission(PERMISSION)
    const data = await getProfilProdiAdmin()
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requirePermission(PERMISSION)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = profilProdiInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const data = await saveProfilProdi(parsed.data, user)
    return apiResponse({ success: true, data })
  } catch (error) {
    if (error instanceof ProfilProdiValidationError) {
      return apiResponse(
        { success: false, message: "Periksa kembali isian yang ditandai.", errors: error.errors },
        400,
      )
    }
    return handleApiError(error, `${ROUTE} [PUT]`)
  }
}