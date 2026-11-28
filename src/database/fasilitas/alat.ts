import "server-only"

import type { tbl_fasilitas_alat } from "@generated/client"

import { logEntityMutation, type Actor } from "@/lib/authorship"
import { prisma } from "@/lib/prisma"
import type { AlatAdmin, AlatInput } from "@/types"

import { KEPEMILIKAN_TO_LABEL, KONDISI_TO_LABEL, LABEL_TO_KEPEMILIKAN, LABEL_TO_KONDISI } from "./enums"
import { FasilitasRuleError, toId } from "./shared"

const ENTITY = "tbl_fasilitas_alat"

export function toAlatAdmin(row: tbl_fasilitas_alat): AlatAdmin {
  return {
    id: String(row.id_alat),
    fasilitasId: String(row.fasilitas_id),
    nama: row.nama,
    jumlahUnit: row.jumlah_unit,
    tahunPerolehan: row.tahun_perolehan,
    kepemilikan: KEPEMILIKAN_TO_LABEL[row.kepemilikan],
    kondisi: KONDISI_TO_LABEL[row.kondisi],
    spesifikasi: row.spesifikasi,
    tampilPublik: row.tampil_publik,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

async function assertFasilitasAda(fasilitasId: bigint) {
  const ada = await prisma.tbl_fasilitas.findUnique({
    where: { id_fasilitas: fasilitasId },
    select: { id_fasilitas: true },
  })
  if (!ada) {
    throw new FasilitasRuleError("Fasilitas tidak ditemukan.", { fasilitasId: ["Fasilitas tidak ditemukan."] })
  }
}

export async function createAlat(input: AlatInput, actor: Actor): Promise<AlatAdmin> {
  const fasilitasId = toId(input.fasilitasId)
  await assertFasilitasAda(fasilitasId)

  const row = await prisma.tbl_fasilitas_alat.create({
    data: {
      fasilitas_id: fasilitasId,
      nama: input.nama,
      jumlah_unit: input.jumlahUnit,
      tahun_perolehan: input.tahunPerolehan,
      kepemilikan: LABEL_TO_KEPEMILIKAN[input.kepemilikan],
      kondisi: LABEL_TO_KONDISI[input.kondisi],
      spesifikasi: input.spesifikasi,
      tampil_publik: input.tampilPublik,
    },
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: ENTITY,
    entityId: row.id_alat,
    deskripsi: `${actor.nama} menambahkan alat "${row.nama}".`,
    dataBaru: input,
  })

  return toAlatAdmin(row)
}

export async function updateAlat(id: bigint, input: AlatInput, actor: Actor): Promise<AlatAdmin> {
  const before = await prisma.tbl_fasilitas_alat.findUniqueOrThrow({ where: { id_alat: id } })
  const fasilitasId = toId(input.fasilitasId)
  if (fasilitasId !== before.fasilitas_id) await assertFasilitasAda(fasilitasId)

  const row = await prisma.tbl_fasilitas_alat.update({
    where: { id_alat: id },
    data: {
      fasilitas_id: fasilitasId,
      nama: input.nama,
      jumlah_unit: input.jumlahUnit,
      tahun_perolehan: input.tahunPerolehan,
      kepemilikan: LABEL_TO_KEPEMILIKAN[input.kepemilikan],
      kondisi: LABEL_TO_KONDISI[input.kondisi],
      spesifikasi: input.spesifikasi,
      tampil_publik: input.tampilPublik,
    },
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} mengubah alat "${row.nama}".`,
    dataLama: before,
    dataBaru: input,
  })

  return toAlatAdmin(row)
}

export async function deleteAlat(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_fasilitas_alat.findUniqueOrThrow({ where: { id_alat: id } })
  await prisma.tbl_fasilitas_alat.delete({ where: { id_alat: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus alat "${before.nama}".`,
    dataLama: before,
  })
}