import "server-only"

import { apiResponse } from "@/lib/api-response"
import { parseBigIntId } from "@/lib/ids"
import { getPublicUrl } from "@/lib/storage"
import type { FasilitasAttribution } from "@/types"

export const toId = (value: string) => parseBigIntId(value)
export const toIdOrNull = (value: string | null) => (value === null ? null : parseBigIntId(value))

export const AUDIT_SELECT = { select: { id_profile: true, nama: true } } as const

export function toAttribution(
  row: { id_profile: string; nama: string } | null,
): FasilitasAttribution {
  return row ? { id: row.id_profile, nama: row.nama } : null
}

export function resolveImage(value: string | null): string | null {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return getPublicUrl("images", value) ?? value
}

/** Decimal Prisma -> number biasa untuk dikirim lewat JSON. */
export function toNumberOrNull(value: { toNumber: () => number } | null): number | null {
  return value ? value.toNumber() : null
}

export type FieldErrors = Record<string, string[]>

export class FasilitasConflictError extends Error {
  constructor(
    public readonly errors: FieldErrors,
    message = "Ada isian yang sudah dipakai data lain.",
  ) {
    super(message)
    this.name = "FasilitasConflictError"
  }
}

export class FasilitasRuleError extends Error {
  constructor(
    message: string,
    public readonly errors?: FieldErrors,
  ) {
    super(message)
    this.name = "FasilitasRuleError"
  }
}

export class FasilitasInUseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "FasilitasInUseError"
  }
}

/**
 * Dipanggil di blok catch tiap route.ts modul ini SEBELUM handleApiError:
 *   const mapped = fasilitasErrorResponse(error)
 *   if (mapped) return mapped
 *   return handleApiError(error, ...)
 */
export function fasilitasErrorResponse(error: unknown): Response | null {
  if (error instanceof FasilitasConflictError) {
    return apiResponse({ success: false, message: error.message, errors: error.errors }, 409)
  }
  if (error instanceof FasilitasRuleError) {
    return apiResponse({ success: false, message: error.message, errors: error.errors }, 422)
  }
  if (error instanceof FasilitasInUseError) {
    return apiResponse({ success: false, message: error.message }, 409)
  }
  return null
}