import { apiResponse, handleApiError } from "@/lib/api-response"
import { requirePermission } from "@/lib/auth"
import { getStrukturTreeAdmin, saveStrukturTree, StrukturError } from "@/database/struktur"
import { strukturSaveSchema } from "@/types"

const ROUTE = "/api/dashboard/struktur"
const PERMISSION = "struktur:manage"

export async function GET() {
  try {
    await requirePermission(PERMISSION)
    const data = await getStrukturTreeAdmin()
    return apiResponse({ success: true, data })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

/** Simpan seluruh struktur (posisi + tupoksi) dalam satu transaksi. */
export async function PUT(request: Request) {
  try {
    const user = await requirePermission(PERMISSION)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = strukturSaveSchema.safeParse(body)
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Data struktur tidak valid."
      return apiResponse({ success: false, message: first, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const data = await saveStrukturTree(parsed.data, user)
    return apiResponse({ success: true, data })
  } catch (error) {
    if (error instanceof StrukturError) {
      return apiResponse({ success: false, message: error.message }, 400)
    }
    return handleApiError(error, `${ROUTE} [PUT]`)
  }
}