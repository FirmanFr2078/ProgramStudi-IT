import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import {
  createKegiatan,
  kerjaSamaErrorResponse,
  listKegiatanAdmin,
} from "@/database/kerja-sama"
import { kegiatanInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/kegiatan"

// ?kerjaSamaId=1 -> kegiatan satu naskah; ?mitraId=1 -> kegiatan satu mitra
export async function GET(request: Request) {
  try {
    await requirePermission("kerja-sama:manage")
    const searchParams = new URL(request.url).searchParams
    const kerjaSamaIdParam = searchParams.get("kerjaSamaId")
    const mitraIdParam = searchParams.get("mitraId")

    const data = await listKegiatanAdmin({
      ...(kerjaSamaIdParam ? { kerjaSamaId: parseBigIntId(kerjaSamaIdParam) } : {}),
      ...(mitraIdParam ? { mitraId: parseBigIntId(mitraIdParam) } : {}),
    })
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

    const parsed = kegiatanInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const kegiatan = await createKegiatan(parsed.data, user)
    return apiResponse({ success: true, data: kegiatan }, 201)
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}