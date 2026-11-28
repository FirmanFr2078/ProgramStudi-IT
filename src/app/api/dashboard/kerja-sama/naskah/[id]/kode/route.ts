import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { buatKodeUnduh, kerjaSamaErrorResponse, listKodeUnduh } from "@/database/kerja-sama"
import { kodeUnduhInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kerja-sama/naskah/[id]/kode"

type RouteContext = { params: Promise<{ id: string }> }

// Riwayat kode satu naskah. Kode utuh tidak pernah ada di sini (hanya 4 karakter terakhir).
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requirePermission("kerja-sama:manage")
    const { id } = await params
    const data = await listKodeUnduh(parseBigIntId(id))
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

// Buat kode baru untuk satu peminta. Respons ini SATU-SATUNYA tempat kode utuh muncul.
export async function POST(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("kerja-sama:manage")
    const { id } = await params
    parseBigIntId(id) // tolak id yang bukan angka sebelum menyentuh database

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    // Id naskah selalu dari URL, bukan dari body.
    const parsed = kodeUnduhInputSchema.safeParse({
      ...(typeof body === "object" && body !== null ? body : {}),
      kerjaSamaId: id,
    })
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const kode = await buatKodeUnduh(parsed.data, user)
    return apiResponse({ success: true, data: kode }, 201)
  } catch (error) {
    const mapped = kerjaSamaErrorResponse(error)
    if (mapped) return mapped
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}