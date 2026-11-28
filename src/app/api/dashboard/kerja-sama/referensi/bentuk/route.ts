import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { createBentuk, kerjaSamaErrorResponse, listBentuk } from "@/database/kerja-sama"
import { bentukInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/referensi/bentuk"

// ?aktif=1 -> hanya bentuk aktif (untuk chip pilihan di form naskah/kegiatan)
export async function GET(request: Request) {
  try {
    await requirePermission("kerja-sama:manage")
    const hanyaAktif = new URL(request.url).searchParams.get("aktif") === "1"
    const data = await listBentuk({ hanyaAktif })
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

    const parsed = bentukInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const bentuk = await createBentuk(parsed.data, user)
    return apiResponse({ success: true, data: bentuk }, 201)
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}