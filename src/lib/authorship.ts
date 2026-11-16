import "server-only"

import { logActivity, toJsonSafe } from "@/lib/activity-log"
import type { AuthenticatedUser } from "@/lib/auth"

/** Potongan AuthenticatedUser yang dibutuhkan buat stamping & log. */
export type Actor = Pick<AuthenticatedUser, "id" | "nama" | "username">

/** Dipakai di payload prisma.create() -- stamp created_by_id. */
export function stampCreatedBy(actor: Actor) {
  return { created_by_id: actor.id }
}

/** Dipakai di payload prisma.update() -- stamp updated_by_id. */
export function stampUpdatedBy(actor: Actor) {
  return { updated_by_id: actor.id }
}

type LogEntityMutationInput = {
  actor: Actor
  action: "create" | "update" | "delete"
  entity: string // nama tabel, mis. "tbl_kabar"
  entityId: string | number | bigint
  deskripsi: string
  dataLama?: unknown // snapshot sebelum perubahan -- diisi utk update/delete
  dataBaru?: unknown // snapshot sesudah perubahan -- diisi utk create/update
}

/**
 * Satu titik panggil buat nyatet create/update/delete ke tbl_activity_log,
 * dipanggil dari tiap src/database/<entitas>.ts SETELAH mutasi prisma
 * berhasil. Error logging ditangani di dalam logActivity() sendiri
 * (ga pernah throw), jadi aman dipanggil tanpa try/catch tambahan di sini.
 */
export async function logEntityMutation(input: LogEntityMutationInput) {
  await logActivity({
    actorId: input.actor.id,
    actorNama: input.actor.nama,
    actorUsername: input.actor.username,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    deskripsi: input.deskripsi,
    dataLama: toJsonSafe(input.dataLama),
    dataBaru: toJsonSafe(input.dataBaru),
  })
}