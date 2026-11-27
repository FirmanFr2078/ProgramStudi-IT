import "server-only"

import { apiResponse } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { getPublicUrl } from "@/lib/storage"
import type { KerjaSamaAttribution } from "@/types"

// ============================================================
// TANGGAL
// Kolom @db.Date disimpan sebagai tengah malam UTC, jadi konversi string <-> Date
// SELALU lewat UTC supaya tanggalnya tidak bergeser sehari di zona WIB.
// ============================================================

export const toIsoDate = (value: Date) => value.toISOString().slice(0, 10)
export const toDbDate = (value: string) => new Date(`${value}T00:00:00.000Z`)
export const toDbDateOrNull = (value: string | null) => (value ? toDbDate(value) : null)

// ============================================================
// ID (BigInt <-> string)
// ============================================================

export const toId = (value: string) => parseBigIntId(value)
export const toIdOrNull = (value: string | null) => (value === null ? null : parseBigIntId(value))

// ============================================================
// AUDIT (created_by / updated_by)
// ============================================================

export const AUDIT_SELECT = { select: { id_profile: true, nama: true } } as const

export function toAttribution(
  row: { id_profile: string; nama: string } | null,
): KerjaSamaAttribution {
  return row ? { id: row.id_profile, nama: row.nama } : null
}

// ============================================================
// GAMBAR
// ============================================================

export function resolveImage(value: string | null): string | null {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return getPublicUrl("images", value) ?? value
}

// ============================================================
// ERROR DOMAIN
// - Conflict : nilai unik bentrok (nama, slug, nomor)        -> 409 + errors per field
// - Rule     : aturan bisnis dilanggar (induk salah, dst.)   -> 422 + errors per field
// - InUse    : data masih dipakai sehingga tidak boleh dihapus -> 409
// ============================================================

export type FieldErrors = Record<string, string[]>

export class KerjaSamaConflictError extends Error {
  constructor(
    public readonly errors: FieldErrors,
    message = "Ada isian yang sudah dipakai data lain.",
  ) {
    super(message)
    this.name = "KerjaSamaConflictError"
  }
}

export class KerjaSamaRuleError extends Error {
  constructor(
    message: string,
    public readonly errors?: FieldErrors,
  ) {
    super(message)
    this.name = "KerjaSamaRuleError"
  }
}

export class KerjaSamaInUseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "KerjaSamaInUseError"
  }
}

/**
 * Dipanggil di blok catch tiap route.ts modul ini SEBELUM handleApiError:
 *   const mapped = kerjaSamaErrorResponse(error)
 *   if (mapped) return mapped
 *   return handleApiError(error, ...)
 */
export function kerjaSamaErrorResponse(error: unknown): Response | null {
  if (error instanceof KerjaSamaConflictError) {
    return apiResponse({ success: false, message: error.message, errors: error.errors }, 409)
  }
  if (error instanceof KerjaSamaRuleError) {
    return apiResponse({ success: false, message: error.message, errors: error.errors }, 422)
  }
  if (error instanceof KerjaSamaInUseError) {
    return apiResponse({ success: false, message: error.message }, 409)
  }
  return null
}
