import "server-only"

import type { Prisma } from "@generated/client"

import { logEntityMutation, type Actor } from "@/lib/authorship"
import { prisma } from "@/lib/prisma"
import type { KategoriFasilitasInput, KategoriFasilitasRef } from "@/types"

import { FasilitasConflictError, FasilitasInUseError } from "./shared"

const ENTITY = "tbl_ref_kategori_fasilitas"

const KATEGORI_INCLUDE = {
  _count: { select: { fasilitas: true } },
} satisfies Prisma.tbl_ref_kategori_fasilitasInclude

type KategoriRow = Prisma.tbl_ref_kategori_fasilitasGetPayload<{ include: typeof KATEGORI_INCLUDE }>

function toKategoriRef(row: KategoriRow): KategoriFasilitasRef {
  return {
    id: String(row.id_kategori),
    slug: row.slug,
    nama: row.nama,
    urutan: row.urutan,
    aktif: row.aktif,
    jumlahFasilitas: row._count.fasilitas,
  }
}

async function assertKategoriValid(input: KategoriFasilitasInput, excludeId?: bigint) {
  const slugBentrok = await prisma.tbl_ref_kategori_fasilitas.findFirst({
    where: {
      slug: input.slug,
      ...(excludeId !== undefined ? { NOT: { id_kategori: excludeId } } : {}),
    },
    select: { id_kategori: true },
  })
  if (slugBentrok) throw new FasilitasConflictError({ slug: ["Slug sudah dipakai kategori lain."] })

  const namaBentrok = await prisma.tbl_ref_kategori_fasilitas.findFirst({
    where: {
      nama: { equals: input.nama, mode: "insensitive" },
      ...(excludeId !== undefined ? { NOT: { id_kategori: excludeId } } : {}),
    },
    select: { id_kategori: true },
  })
  if (namaBentrok) throw new FasilitasConflictError({ nama: ["Nama kategori sudah dipakai."] })
}

export async function listKategoriFasilitas(
  options: { hanyaAktif?: boolean } = {},
): Promise<KategoriFasilitasRef[]> {
  const rows = await prisma.tbl_ref_kategori_fasilitas.findMany({
    where: options.hanyaAktif ? { aktif: true } : undefined,
    include: KATEGORI_INCLUDE,
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
  })
  return rows.map(toKategoriRef)
}

export async function createKategoriFasilitas(
  input: KategoriFasilitasInput,
  actor: Actor,
): Promise<KategoriFasilitasRef> {
  await assertKategoriValid(input)

  const row = await prisma.tbl_ref_kategori_fasilitas.create({
    data: { slug: input.slug, nama: input.nama, urutan: input.urutan, aktif: input.aktif },
    include: KATEGORI_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: ENTITY,
    entityId: row.id_kategori,
    deskripsi: `${actor.nama} menambahkan kategori fasilitas "${row.nama}".`,
    dataBaru: input,
  })

  return toKategoriRef(row)
}

export async function updateKategoriFasilitas(
  id: bigint,
  input: KategoriFasilitasInput,
  actor: Actor,
): Promise<KategoriFasilitasRef> {
  const before = await prisma.tbl_ref_kategori_fasilitas.findUniqueOrThrow({
    where: { id_kategori: id },
  })
  await assertKategoriValid(input, id)

  const row = await prisma.tbl_ref_kategori_fasilitas.update({
    where: { id_kategori: id },
    data: { slug: input.slug, nama: input.nama, urutan: input.urutan, aktif: input.aktif },
    include: KATEGORI_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} mengubah kategori fasilitas "${row.nama}".`,
    dataLama: before,
    dataBaru: input,
  })

  return toKategoriRef(row)
}

export async function deleteKategoriFasilitas(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_ref_kategori_fasilitas.findUniqueOrThrow({
    where: { id_kategori: id },
    include: KATEGORI_INCLUDE,
  })

  if (before._count.fasilitas > 0) {
    throw new FasilitasInUseError(
      `Kategori "${before.nama}" masih dipakai ${before._count.fasilitas} fasilitas. Nonaktifkan saja, jangan dihapus.`,
    )
  }

  await prisma.tbl_ref_kategori_fasilitas.delete({ where: { id_kategori: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus kategori fasilitas "${before.nama}".`,
    dataLama: { slug: before.slug, nama: before.nama, urutan: before.urutan, aktif: before.aktif },
  })
}