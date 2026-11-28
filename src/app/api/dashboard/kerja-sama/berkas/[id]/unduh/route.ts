import { requirePermission } from "@/lib/auth"
import { apiResponse, handleApiError } from "@/lib/api-response"
import { getBerkasSumber } from "@/database/kerja-sama"
import { createBerkasSignedUrl } from "@/lib/kerja-sama-storage"

const ROUTE = "/api/dashboard/kerja-sama/berkas/[id]/unduh"

type RouteContext = { params: Promise<{ id: string }> }

// Admin membuka berkas: dikembalikan URL sesaat (signed URL, 5 menit) atau tautan eksternal.
// Ini jalur admin, terpisah dari unduhan publik yang memakai kode.
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requirePermission("kerja-sama:manage")
    const { id } = await params

    const sumber = await getBerkasSumber(id)
    if (!sumber) {
      return apiResponse({ success: false, message: "Berkas tidak ditemukan." }, 404)
    }

    if (sumber.tautan) {
      return apiResponse({ success: true, data: { url: sumber.tautan } })
    }

    if (!sumber.path) {
      return apiResponse({ success: false, message: "Berkas tidak memiliki file." }, 404)
    }

    const ekstensi = sumber.path.split(".").pop() ?? "pdf"
    const url = await createBerkasSignedUrl(sumber.path, {
      downloadName: `${sumber.label}.${ekstensi}`,
    })
    if (!url) {
      return apiResponse({ success: false, message: "File tidak ditemukan di Storage." }, 404)
    }

    return apiResponse({ success: true, data: { url } })
  } catch (error) {
    return handleApiError(error, `${ROUTE} [GET]`)
  }
}