import { NextResponse } from "next/server"

import { apiResponse, handleApiError } from "@/lib/api-response"
import { JENDELA_GAGAL_MENIT, verifikasiKodeUnduh } from "@/database/kerja-sama"
import { verifikasiKodeSchema } from "@/types"

const ROUTE = "/api/kerja-sama/unduh"

/**
 * Di Vercel, x-forwarded-for diisi platform dengan alamat klien yang sebenarnya.
 * Hanya dipakai untuk membatasi tebak-tebakan kode (disimpan dalam bentuk hash).
 */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || request.headers.get("x-real-ip") || "tidak-diketahui"
}

/**
 * ENDPOINT PUBLIK (tanpa login) -- dipakai dialog "Unduh naskah" di landing.
 * Body: { naskahId, kode }. Berhasil -> { url } berupa signed URL berumur 60 detik.
 * Pesan untuk kode salah, hangus, dan dicabut SENGAJA sama.
 */
export async function POST(request: Request) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return apiResponse({ success: false, message: "Format request tidak valid." }, 400)
    }

    const parsed = verifikasiKodeSchema.safeParse(body)
    if (!parsed.success) {
      return apiResponse({ success: false, errors: parsed.error.flatten().fieldErrors }, 400)
    }

    const hasil = await verifikasiKodeUnduh({
      naskahId: parsed.data.naskahId,
      kode: parsed.data.kode,
      ip: clientIp(request),
    })

    if (hasil.ok) {
      return apiResponse({ success: true, data: { url: hasil.url } })
    }

    switch (hasil.alasan) {
      case "terlalu_banyak_percobaan":
        return NextResponse.json(
          {
            success: false,
            message: `Terlalu banyak percobaan. Coba lagi dalam ${JENDELA_GAGAL_MENIT} menit.`,
          },
          {
            status: 429,
            headers: {
              "Cache-Control": "no-store",
              "Retry-After": String(JENDELA_GAGAL_MENIT * 60),
            },
          },
        )
      case "berkas_tidak_tersedia":
        return apiResponse(
          { success: false, message: "Berkas naskah belum tersedia. Hubungi admin prodi." },
          404,
        )
      default:
        return apiResponse(
          { success: false, message: "Kode tidak valid atau sudah tidak berlaku." },
          400,
        )
    }
  } catch (error) {
    return handleApiError(error, `${ROUTE} [POST]`)
  }
}