import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { listGedungRingkas } from "@/database/fasilitas"

const ROUTE = "/api/dashboard/fasilitas/gedung"

export async function GET() {
  try {
    await requirePermission("fasilitas:manage")
    const data = await listGedungRingkas()
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}