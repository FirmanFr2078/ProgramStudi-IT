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
const KAPRODI_JABATAN_DEFAULT = "Ketua Program Studi"

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
    isKaprodi: row.is_kaprodi,
    tupoksi: row.tupoksi.map((item) => ({ id: String(item.id_tupoksi), isi: item.isi, urutan: item.urutan })),
  }
}

/**
 * Kartu Kaprodi itu satu-satunya node yang dilindungi (nggak bisa dihapus,
 * jabatan terkunci) -- ditandai lewat is_kaprodi, BUKAN lagi "siapa pun yang
 * parent_id-nya null". Soalnya begitu ada kartu ditambah "atas" dia (mis.
 * Dekan), si Dekan itu yang jadi paling atas secara posisi, tapi Kaprodi
 * tetap yang dilindungi.
 */
async function ensureKaprodi() {
  const flagged = await prisma.tbl_struktur_posisi.findFirst({ where: { is_kaprodi: true } })
  if (flagged) return flagged

  // Migrasi data lama (sebelum ada flag ini): root lama ditentukan dari parent_id null.
  const legacyRoot = await prisma.tbl_struktur_posisi.findFirst({ where: { parent_id: null } })
  if (legacyRoot) {
    return prisma.tbl_struktur_posisi.update({
      where: { id_posisi: legacyRoot.id_posisi },
      data: { is_kaprodi: true },
    })
  }

  return prisma.tbl_struktur_posisi.create({
    data: { jabatan: KAPRODI_JABATAN_DEFAULT, is_kaprodi: true, urutan: 0, pos_x: 0, pos_y: 0 },
  })
}

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
  await ensureKaprodi()

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
    // Sengaja TIDAK ada guard "reference.parent_id === null" di sini -- kartu
    // Kaprodi boleh ditambah atasan walau dia lagi jadi node paling atas.
    const newRow = await prisma.tbl_struktur_posisi.create({
      data: {
        jabatan: input.jabatan,
        nama: dosenId ? null : input.nama,
        dosen: dosenRelation,
        parent: reference.parent_id !== null ? { connect: { id_posisi: reference.parent_id } } : undefined,
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
    // kiri / kanan -- tetap butuh parent yang sama, node yang belum punya
    // atasan ("Dekan" paling atas, misalnya) emang belum bisa disejajarkan.
    if (reference.parent_id === null) {
      throw new StrukturError("Posisi ini belum punya atasan, jadi belum bisa ditambah sejajar.")
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

  // Jabatan kartu Kaprodi terkunci -- apa pun yang dikirim, tetap dipaksa default-nya.
  const jabatan = before.is_kaprodi ? KAPRODI_JABATAN_DEFAULT : input.jabatan

  const row = await prisma.tbl_struktur_posisi.update({
    where: { id_posisi: id },
    data: {
      jabatan,
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

export async function movePosisi(id: bigint, input: StrukturPosisiPositionInput): Promise<void> {
  await prisma.tbl_struktur_posisi.update({
    where: { id_posisi: id },
    data: { pos_x: input.posX, pos_y: input.posY },
  })
}

export async function deletePosisi(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_struktur_posisi.findUniqueOrThrow({ where: { id_posisi: id } })
  if (before.is_kaprodi) {
    throw new StrukturError("Posisi Ketua Program Studi tidak bisa dihapus.")
  }

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