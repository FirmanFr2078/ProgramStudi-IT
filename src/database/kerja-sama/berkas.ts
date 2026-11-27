import "server-only"

import type { tbl_kerja_sama_berkas } from "@generated/client"

import { logEntityMutation, type Actor } from "@/lib/authorship"
import { deleteKerjaSamaFiles } from "@/lib/kerja-sama-storage"
import { prisma } from "@/lib/prisma"
import {
  BERKAS_KEGIATAN_FOLDER,
  BERKAS_NASKAH_FOLDER,
  type BerkasAdmin,
  type BerkasInput,
} from "@/types"

import { JENIS_BERKAS_TO_LABEL, LABEL_TO_JENIS_BERKAS } from "./enums"
import { KerjaSamaConflictError, KerjaSamaRuleError, toId, toIdOrNull } from "./shared"

const ENTITY = "tbl_kerja_sama_berkas"

export function toBerkasAdmin(row: tbl_kerja_sama_berkas): BerkasAdmin {
  return {
    id: String(row.id_berkas),
    jenis: JENIS_BERKAS_TO_LABEL[row.jenis],
    label: row.label,
    path: row.path,
    tautan: row.tautan,
    mime: row.mime,
    ukuran: row.ukuran,
    createdAt: row.created_at.toISOString(),
  }
}

/** Dipakai endpoint upload DELETE (rollback): file yang sudah tercatat tidak boleh dihapus. */
export async function isBerkasPathInUse(path: string): Promise<boolean> {
  return (await prisma.tbl_kerja_sama_berkas.count({ where: { path } })) > 0
}

/**
 * Metadata berkas dicatat SETELAH file terunggah (POST upload menghasilkan path).
 * Path harus berada di folder yang cocok dengan induknya, dan tidak boleh dipakai
 * dua baris (satu file fisik = satu catatan).
 */
export async function addBerkas(input: BerkasInput, actor: Actor): Promise<BerkasAdmin> {
  const kerjaSamaId = toIdOrNull(input.kerjaSamaId)
  const kegiatanId = toIdOrNull(input.kegiatanId)

  if (kerjaSamaId !== null) {
    const naskah = await prisma.tbl_kerja_sama.findUnique({
      where: { id_kerja_sama: kerjaSamaId },
      select: { id_kerja_sama: true },
    })
    if (!naskah) throw new KerjaSamaRuleError("Naskah tidak ditemukan.", { kerjaSamaId: ["Naskah tidak ditemukan."] })
  }
  if (kegiatanId !== null) {
    const kegiatan = await prisma.tbl_kerja_sama_kegiatan.findUnique({
      where: { id_kegiatan: kegiatanId },
      select: { id_kegiatan: true },
    })
    if (!kegiatan) throw new KerjaSamaRuleError("Kegiatan tidak ditemukan.", { kegiatanId: ["Kegiatan tidak ditemukan."] })
  }

  if (input.path) {
    const folderSeharusnya = kerjaSamaId !== null ? BERKAS_NASKAH_FOLDER : BERKAS_KEGIATAN_FOLDER
    if (!input.path.startsWith(`${folderSeharusnya}/`)) {
      throw new KerjaSamaRuleError("Berkas tidak sesuai dengan induknya.", {
        path: ["Berkas ini diunggah untuk jenis induk yang berbeda."],
      })
    }
    if (await isBerkasPathInUse(input.path)) {
      throw new KerjaSamaConflictError({ path: ["File ini sudah tercatat pada berkas lain."] })
    }
  }

  const row = await prisma.tbl_kerja_sama_berkas.create({
    data: {
      kerja_sama_id: kerjaSamaId,
      kegiatan_id: kegiatanId,
      jenis: LABEL_TO_JENIS_BERKAS[input.jenis],
      label: input.label,
      path: input.path,
      tautan: input.tautan,
      mime: input.mime,
      ukuran: input.ukuran,
    },
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: ENTITY,
    entityId: row.id_berkas,
    deskripsi: `${actor.nama} menambahkan berkas "${row.label}" (${input.jenis}).`,
    dataBaru: input,
  })

  return toBerkasAdmin(row)
}

export async function deleteBerkas(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_kerja_sama_berkas.findUniqueOrThrow({
    where: { id_berkas: id },
  })
  await prisma.tbl_kerja_sama_berkas.delete({ where: { id_berkas: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus berkas "${before.label}".`,
    dataLama: before,
  })

  await deleteKerjaSamaFiles([before.path])
}

/**
 * Sumber unduhan satu berkas. API yang membuat signed URL dari `path`,
 * atau me-redirect ke `tautan` kalau berkas berupa link eksternal.
 */
export async function getBerkasSumber(idText: string) {
  const row = await prisma.tbl_kerja_sama_berkas.findUnique({
    where: { id_berkas: toId(idText) },
    select: { path: true, tautan: true, label: true, mime: true },
  })
  return row
}
