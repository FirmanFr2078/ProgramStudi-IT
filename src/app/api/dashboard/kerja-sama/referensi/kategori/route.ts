import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import {
  createKategoriMitra,
  kerjaSamaErrorResponse,
  listKategoriMitra,
} from "@/database/kerja-sama"
import { kategoriMitraInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/referensi/kategori"

// ?aktif=1 -> hanya kategori aktif (untuk dropdown di form mitra)
export async function GET(request: Request) {
  try {
    await requirePermission("kerja-sama:manage")
    const hanyaAktif = new URL(request.url).searchParams.get("aktif") === "1"
    const data = await listKategoriMitra({ hanyaAktif })
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

    const parsed = kategoriMitraInputSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const kategori = await createKategoriMitra(parsed.data, user)
    return apiResponse({ success: true, data: kategori }, 201)
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}