import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { listNaskahOpsi } from "@/database/kerja-sama"

const ROUTE = "/api/dashboard/kerja-sama/naskah/opsi"

// Ringan, untuk dropdown (pilih induk / pilih naskah saat input kegiatan).
// ?mitraId=123 -> hanya naskah milik satu mitra.
export async function GET(request: Request) {
  try {
    await requirePermission("kerja-sama:manage")
    const mitraIdParam = new URL(request.url).searchParams.get("mitraId")
    const data = await listNaskahOpsi(
      mitraIdParam ? { mitraId: parseBigIntId(mitraIdParam) } : {},
    )
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}