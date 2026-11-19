import "server-only"

import type { Prisma } from "@generated/client"

import { logEntityMutation, type Actor } from "@/lib/authorship"
import { parseBigIntId } from "@/lib/ids"
import { prisma } from "@/lib/prisma"
import { getPublicUrl } from "@/lib/storage"
import type {
  StrukturPosisiAdmin,
  StrukturPosisiCreateInput,
  StrukturPosisiPositionInput,
  StrukturPosisiUpdateInput,
  StrukturTupoksiAdmin,
  StrukturTupoksiInput,
  StrukturTupoksiUpdateInput,
} from "@/types"
import { STRUKTUR_TUPOKSI_MAX_ITEMS } from "@/types"

const ENTITY = "tbl_struktur_posisi"
const TUPOKSI_ENTITY = "tbl_struktur_tupoksi"
const ROOT_JABATAN_DEFAULT = "Ketua Program Studi"

// Jarak default antar node pas ditambah lewat tombol (+) -- bukan hasil
// auto-layout yang dihitung ulang tiap render, cuma titik awal. Admin tetap
// bebas geser manual sesudahnya, posisinya kesimpen permanen di pos_x/pos_y.
const GAP_X = 260
const GAP_Y = 180

export class StrukturError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StrukturError"
  }
}

const POSISI_ADMIN_INCLUDE = {
  dosen: { select: { id_dosen: true, nama: true, nidn: true, foto: true } },
  tupoksi: { orderBy: { urutan: "asc" } },
} satisfies Prisma.tbl_struktur_posisiInclude

type PosisiRow = Prisma.tbl_struktur_posisiGetPayload<{ include: typeof POSISI_ADMIN_INCLUDE }>

function resolveFoto(value: string | null): string | null {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return getPublicUrl("images", value) ?? value
}

function toStrukturPosisiAdmin(row: PosisiRow): StrukturPosisiAdmin {
  return {
    id: String(row.id_posisi),
    parentId: row.parent_id !== null ? String(row.parent_id) : null,
    jabatan: row.jabatan,
    nama: row.dosen ? null : row.nama,
    dosenId: row.dosen_id !== null ? String(row.dosen_id) : null,
    dosenNama: row.dosen?.nama ?? null,
    dosenNidn: row.dosen?.nidn ?? null,
    dosenFoto: row.dosen ? resolveFoto(row.dosen.foto) : null,
    urutan: row.urutan,
    posX: row.pos_x,
    posY: row.pos_y,
    isRoot: row.parent_id === null,
    tupoksi: row.tupoksi.map((item) => ({ id: String(item.id_tupoksi), isi: item.isi, urutan: item.urutan })),
  }
}

async function ensureRoot() {
  const existing = await prisma.tbl_struktur_posisi.findFirst({ where: { parent_id: null } })
  if (existing) return existing

  return prisma.tbl_struktur_posisi.create({
    data: { jabatan: ROOT_JABATAN_DEFAULT, urutan: 0, pos_x: 0, pos_y: 0 },
  })
}

/** BFS turunan 1 node, dipakai pas insert "atas" buat geser seluruh subtree ke bawah. */
async function collectDescendantIds(rootId: bigint): Promise<bigint[]> {
  const ids: bigint[] = []
  let frontier = [rootId]

  while (frontier.length > 0) {
    const children = await prisma.tbl_struktur_posisi.findMany({
      where: { parent_id: { in: frontier } },
      select: { id_posisi: true },
    })
    const childIds = children.map((child) => child.id_posisi)
    ids.push(...childIds)
    frontier = childIds
  }

  return ids
}

/** Geser sibling dari urutan tertentu ke bawah (urutan+1, pos_x+GAP_X), buat kasih ruang node baru. */
async function shiftSiblingsFrom(parentId: bigint, fromUrutan: number, excludeId?: bigint) {
  const siblings = await prisma.tbl_struktur_posisi.findMany({
    where: {
      parent_id: parentId,
      urutan: { gte: fromUrutan },
      ...(excludeId !== undefined ? { NOT: { id_posisi: excludeId } } : {}),
    },
  })

  for (const sibling of siblings) {
    await prisma.tbl_struktur_posisi.update({
      where: { id_posisi: sibling.id_posisi },
      data: { urutan: sibling.urutan + 1, pos_x: sibling.pos_x + GAP_X },
    })
  }
}

// ============================================================
// QUERY
// ============================================================

export async function getStrukturTreeAdmin(): Promise<StrukturPosisiAdmin[]> {
  await ensureRoot()

  const rows = await prisma.tbl_struktur_posisi.findMany({
    include: POSISI_ADMIN_INCLUDE,
    orderBy: [{ parent_id: "asc" }, { urutan: "asc" }],
  })

  return rows.map(toStrukturPosisiAdmin)
}

// ============================================================
// MUTASI -- POSISI
// ============================================================

export async function createPosisi(
  input: StrukturPosisiCreateInput,
  actor: Actor,
): Promise<StrukturPosisiAdmin> {
  const referenceId = parseBigIntId(input.referenceId)
  const reference = await prisma.tbl_struktur_posisi.findUnique({ where: { id_posisi: referenceId } })
  if (!reference) throw new StrukturError("Node acuan tidak ditemukan.")

  const dosenId = input.dosenId ? parseBigIntId(input.dosenId) : null
  const dosenRelation = dosenId ? { connect: { id_dosen: dosenId } } : undefined

  if (input.arah === "atas") {
    if (reference.parent_id === null) {
      throw new StrukturError("Node teratas tidak bisa ditambah atasan.")
    }

    const newRow = await prisma.tbl_struktur_posisi.create({
      data: {
        jabatan: input.jabatan,
        nama: dosenId ? null : input.nama,
        dosen: dosenRelation,
        parent: { connect: { id_posisi: reference.parent_id } },
        urutan: reference.urutan,
        pos_x: reference.pos_x,
        pos_y: reference.pos_y,
      },
      include: POSISI_ADMIN_INCLUDE,
    })

    const descendantIds = await collectDescendantIds(reference.id_posisi)
    await prisma.tbl_struktur_posisi.update({
      where: { id_posisi: reference.id_posisi },
      data: { parent_id: newRow.id_posisi, pos_y: reference.pos_y + GAP_Y },
    })
    if (descendantIds.length > 0) {
      await prisma.tbl_struktur_posisi.updateMany({
        where: { id_posisi: { in: descendantIds } },
        data: { pos_y: { increment: GAP_Y } },
      })
    }

    await logEntityMutation({
      actor,
      action: "create",
      entity: ENTITY,
      entityId: newRow.id_posisi,
      deskripsi: `${actor.nama} menambahkan posisi "${newRow.jabatan}" di atas "${reference.jabatan}".`,
      dataBaru: input,
    })

    return toStrukturPosisiAdmin(newRow)
  }

  let data: Prisma.tbl_struktur_posisiCreateInput

  if (input.arah === "bawah") {
    const siblingCount = await prisma.tbl_struktur_posisi.count({ where: { parent_id: reference.id_posisi } })
    data = {
      jabatan: input.jabatan,
      nama: dosenId ? null : input.nama,
      dosen: dosenRelation,
      parent: { connect: { id_posisi: reference.id_posisi } },
      urutan: siblingCount,
      pos_x: reference.pos_x + siblingCount * GAP_X,
      pos_y: reference.pos_y + GAP_Y,
    }
  } else {
    // kiri / kanan -- butuh parent yang sama, root ga punya sejajar
    if (reference.parent_id === null) {
      throw new StrukturError("Node teratas tidak punya posisi sejajar.")
    }

    if (input.arah === "kiri") {
      await shiftSiblingsFrom(reference.parent_id, reference.urutan, reference.id_posisi)
      await prisma.tbl_struktur_posisi.update({
        where: { id_posisi: reference.id_posisi },
        data: { urutan: reference.urutan + 1, pos_x: reference.pos_x + GAP_X },
      })
      data = {
        jabatan: input.jabatan,
        nama: dosenId ? null : input.nama,
        dosen: dosenRelation,
        parent: { connect: { id_posisi: reference.parent_id } },
        urutan: reference.urutan,
        pos_x: reference.pos_x,
        pos_y: reference.pos_y,
      }
    } else {
      await shiftSiblingsFrom(reference.parent_id, reference.urutan + 1)
      data = {
        jabatan: input.jabatan,
        nama: dosenId ? null : input.nama,
        dosen: dosenRelation,
        parent: { connect: { id_posisi: reference.parent_id } },
        urutan: reference.urutan + 1,
        pos_x: reference.pos_x + GAP_X,
        pos_y: reference.pos_y,
      }
    }
  }

  const row = await prisma.tbl_struktur_posisi.create({ data, include: POSISI_ADMIN_INCLUDE })

  await logEntityMutation({
    actor,
    action: "create",
    entity: ENTITY,
    entityId: row.id_posisi,
    deskripsi: `${actor.nama} menambahkan posisi "${row.jabatan}".`,
    dataBaru: input,
  })

  return toStrukturPosisiAdmin(row)
}

export async function updatePosisi(
  id: bigint,
  input: StrukturPosisiUpdateInput,
  actor: Actor,
): Promise<StrukturPosisiAdmin> {
  const before = await prisma.tbl_struktur_posisi.findUniqueOrThrow({ where: { id_posisi: id } })
  const dosenId = input.dosenId ? parseBigIntId(input.dosenId) : null

  const row = await prisma.tbl_struktur_posisi.update({
    where: { id_posisi: id },
    data: {
      jabatan: input.jabatan,
      nama: dosenId ? null : input.nama,
      dosen: dosenId ? { connect: { id_dosen: dosenId } } : { disconnect: true },
    },
    include: POSISI_ADMIN_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: row.id_posisi,
    deskripsi: `${actor.nama} mengubah posisi "${row.jabatan}".`,
    dataLama: before,
    dataBaru: input,
  })

  return toStrukturPosisiAdmin(row)
}

/** Drag reposition -- sengaja TIDAK dicatat ke activity log (noise UI, bukan perubahan data). */
export async function movePosisi(id: bigint, input: StrukturPosisiPositionInput): Promise<void> {
  await prisma.tbl_struktur_posisi.update({
    where: { id_posisi: id },
    data: { pos_x: input.posX, pos_y: input.posY },
  })
}

export async function deletePosisi(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_struktur_posisi.findUniqueOrThrow({ where: { id_posisi: id } })
  if (before.parent_id === null) {
    throw new StrukturError("Node Ketua Program Studi (root) tidak bisa dihapus.")
  }

  // onDelete: Cascade di schema yang nanganin hapus seluruh turunan + tupoksi-nya.
  await prisma.tbl_struktur_posisi.delete({ where: { id_posisi: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus posisi "${before.jabatan}" beserta turunannya.`,
    dataLama: before,
  })
}

// ============================================================
// MUTASI -- TUPOKSI
// ============================================================

export async function createTupoksi(input: StrukturTupoksiInput, actor: Actor): Promise<StrukturTupoksiAdmin> {
  const posisiId = parseBigIntId(input.posisiId)
  const posisi = await prisma.tbl_struktur_posisi.findUnique({ where: { id_posisi: posisiId } })
  if (!posisi) throw new StrukturError("Posisi tidak ditemukan.")

  const count = await prisma.tbl_struktur_tupoksi.count({ where: { posisi_id: posisiId } })
  if (count >= STRUKTUR_TUPOKSI_MAX_ITEMS) {
    throw new StrukturError(`Tupoksi untuk satu posisi maksimal ${STRUKTUR_TUPOKSI_MAX_ITEMS} poin.`)
  }

  const row = await prisma.tbl_struktur_tupoksi.create({
    data: { posisi_id: posisiId, isi: input.isi, urutan: count },
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: TUPOKSI_ENTITY,
    entityId: row.id_tupoksi,
    deskripsi: `${actor.nama} menambahkan poin tupoksi pada "${posisi.jabatan}".`,
    dataBaru: input,
  })

  return { id: String(row.id_tupoksi), isi: row.isi, urutan: row.urutan }
}

export async function updateTupoksi(
  id: bigint,
  input: StrukturTupoksiUpdateInput,
  actor: Actor,
): Promise<StrukturTupoksiAdmin> {
  const before = await prisma.tbl_struktur_tupoksi.findUniqueOrThrow({ where: { id_tupoksi: id } })
  const row = await prisma.tbl_struktur_tupoksi.update({ where: { id_tupoksi: id }, data: { isi: input.isi } })

  await logEntityMutation({
    actor,
    action: "update",
    entity: TUPOKSI_ENTITY,
    entityId: row.id_tupoksi,
    deskripsi: `${actor.nama} mengubah poin tupoksi.`,
    dataLama: before,
    dataBaru: input,
  })

  return { id: String(row.id_tupoksi), isi: row.isi, urutan: row.urutan }
}

export async function deleteTupoksi(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_struktur_tupoksi.findUniqueOrThrow({ where: { id_tupoksi: id } })
  await prisma.tbl_struktur_tupoksi.delete({ where: { id_tupoksi: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: TUPOKSI_ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus poin tupoksi.`,
    dataLama: before,
  })
}