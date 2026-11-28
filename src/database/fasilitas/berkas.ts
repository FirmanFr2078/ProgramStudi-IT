import "server-only"

import type { tbl_fasilitas_berkas } from "@generated/client"

import { logEntityMutation, type Actor } from "@/lib/authorship"
import { prisma } from "@/lib/prisma"
import { deleteFile } from "@/lib/storage"
import { JENIS_BERKAS_FOTO, type BerkasFasilitasAdmin, type BerkasFasilitasInput } from "@/types"

import { JENIS_BERKAS_TO_LABEL, LABEL_TO_JENIS_BERKAS } from "./enums"
import { FasilitasConflictError, FasilitasRuleError, resolveImage, toId } from "./shared"

const ENTITY = "tbl_fasilitas_berkas"

function bucketUntuk(jenis: BerkasFasilitasAdmin["jenis"]) {
  return JENIS_BERKAS_FOTO.includes(jenis) ? ("images" as const) : ("documents" as const)
}

export function toBerkasAdmin(row: tbl_fasilitas_berkas): BerkasFasilitasAdmin {
  const jenis = JENIS_BERKAS_TO_LABEL[row.jenis]
  return {
    id: String(row.id_berkas),
    jenis,
    label: row.label,
    url: resolveImage(row.path) ?? row.path,
    path: row.path,
    mime: row.mime,
    ukuran: row.ukuran,
    urutan: row.urutan,
    createdAt: row.created_at.toISOString(),
  }
}

export async function isBerkasFasilitasPathInUse(path: string): Promise<boolean> {
  return (await prisma.tbl_fasilitas_berkas.count({ where: { path } })) > 0
}

export async function addBerkasFasilitas(
  input: BerkasFasilitasInput,
  actor: Actor,
): Promise<BerkasFasilitasAdmin> {
  const fasilitasId = toId(input.fasilitasId)
  const fasilitas = await prisma.tbl_fasilitas.findUnique({
    where: { id_fasilitas: fasilitasId },
    select: { id_fasilitas: true },
  })
  if (!fasilitas) {
    throw new FasilitasRuleError("Fasilitas tidak ditemukan.", { fasilitasId: ["Fasilitas tidak ditemukan."] })
  }

  if (await isBerkasFasilitasPathInUse(input.path)) {
    throw new FasilitasConflictError({ path: ["File ini sudah tercatat pada berkas lain."] })
  }

  const row = await prisma.tbl_fasilitas_berkas.create({
    data: {
      fasilitas_id: fasilitasId,
      jenis: LABEL_TO_JENIS_BERKAS[input.jenis],
      label: input.label,
      path: input.path,
      mime: input.mime,
      ukuran: input.ukuran,
      urutan: input.urutan,
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

export async function deleteBerkasFasilitas(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_fasilitas_berkas.findUniqueOrThrow({ where: { id_berkas: id } })
  await prisma.tbl_fasilitas_berkas.delete({ where: { id_berkas: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus berkas "${before.label}".`,
    dataLama: before,
  })

  await deleteFile(bucketUntuk(JENIS_BERKAS_TO_LABEL[before.jenis]), before.path).catch((error) =>
    console.error("[FASILITAS_BERKAS_CLEANUP]", error),
  )
}