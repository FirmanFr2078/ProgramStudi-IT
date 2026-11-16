import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { deleteKabar, getKabarByIdAdmin, updateKabar } from "@/database/kabar"
import { kabarInputSchema } from "@/types"

const ROUTE = "/api/dashboard/kabar/[id]"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requirePermission("berita:manage")
    const { id } = await params
    const kabarId = parseBigIntId(id)

    const kabar = await getKabarByIdAdmin(kabarId)
    if (!kabar) {
      return apiResponse({ success: false, message: "Kabar tidak ditemukan." }, 404)
    }

    return apiResponse({ success: true, data: kabar })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("berita:manage")
    const { id } = await params
    const kabarId = parseBigIntId(id)

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

    const kabar = await updateKabar(kabarId, parsed.data, user)
    return apiResponse({ success: true, data: kabar })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [PATCH]`)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const user = await requirePermission("berita:manage")
    const { id } = await params
    const kabarId = parseBigIntId(id)

    await deleteKabar(kabarId, user)
    return apiResponse({ success: true })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [DELETE]`)
  }
}