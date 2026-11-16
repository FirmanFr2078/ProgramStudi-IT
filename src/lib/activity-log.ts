import "server-only"

import { prisma } from "@/lib/prisma"
import { ActivityAction } from "@generated/enums"

type LogActivityInput = {
  actorId?: string | null
  actorNama?: string | null
  actorUsername?: string | null
  action: ActivityAction
  entity?: string
  entityId?: string | number | bigint
  deskripsi: string
  dataLama?: unknown
  dataBaru?: unknown
}

/**
 * Catat 1 baris ke tbl_activity_log. HANYA dipanggil di titik mutasi final
 * (submit create/update/delete, percobaan login, logout, exception di catch) --
 * jangan di render/draft/autosave, biar ga jadi spam.
 *
 * Sengaja nggak pernah throw -- kegagalan nulis log TIDAK BOLEH menggagalkan
 * aksi utama (login/logout/CRUD) yang lagi dicatat.
 */
export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    await prisma.tbl_activity_log.create({
      data: {
        actor_id: input.actorId ?? null,
        actor_nama: input.actorNama ?? null,
        actor_username: input.actorUsername ?? null,
        action: input.action,
        entity: input.entity ?? null,
        entity_id: input.entityId !== undefined ? String(input.entityId) : null,
        deskripsi: input.deskripsi,
        data_lama: input.dataLama === undefined ? undefined : (input.dataLama as object),
        data_baru: input.dataBaru === undefined ? undefined : (input.dataBaru as object),
      },
    })
  } catch (error) {
    console.error("[ACTIVITY_LOG]", error)
  }
}

/**
 * Ubah row Prisma mentah jadi bentuk yang aman buat kolom Json (data_lama/
 * data_baru) -- BigInt & Date nggak bisa di-JSON.stringify langsung (bakal
 * crash saat Prisma nyimpen ke kolom Json), jadi dikonversi ke string dulu
 * di sini. Dipakai tiap src/database/<entitas>.ts sebelum nyimpen snapshot
 * before/after ke log, biar fix-nya 1 tempat, bukan ditulis ulang per modul.
 */
export function toJsonSafe(value: unknown): unknown {
  if (value === null || value === undefined) return null
  if (typeof value === "bigint") return value.toString()
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(toJsonSafe)
  if (typeof value === "object") {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = toJsonSafe(val)
    }
    return result
  }
  return value
}