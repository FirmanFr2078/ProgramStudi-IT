import "server-only"

import type { Prisma } from "@generated/client"

import { logEntityMutation, type Actor } from "@/lib/authorship"
import { prisma } from "@/lib/prisma"
import type {
  BentukInput,
  BentukRef,
  KategoriMitraInput,
  KategoriMitraRef,
} from "@/types"

import { BIDANG_TO_LABEL, LABEL_TO_BIDANG } from "./enums"
import { KerjaSamaConflictError, KerjaSamaInUseError, KerjaSamaRuleError } from "./shared"

const KATEGORI_ENTITY = "tbl_ref_kategori_mitra"
const BENTUK_ENTITY = "tbl_ref_bentuk"

// ============================================================
// KATEGORI MITRA
// ============================================================

const KATEGORI_INCLUDE = {
  _count: { select: { mitra: true } },
} satisfies Prisma.tbl_ref_kategori_mitraInclude

type KategoriRow = Prisma.tbl_ref_kategori_mitraGetPayload<{ include: typeof KATEGORI_INCLUDE }>

function toKategoriRef(row: KategoriRow): KategoriMitraRef {
  return {
    id: String(row.id_kategori),
    nama: row.nama,
    urutan: row.urutan,
    aktif: row.aktif,
    jumlahMitra: row._count.mitra,
  }
}

/** Nama unik tanpa peduli huruf besar/kecil ("Magang" dan "magang" dianggap sama). */
async function assertKategoriNamaUnik(nama: string, excludeId?: bigint) {
  const bentrok = await prisma.tbl_ref_kategori_mitra.findFirst({
    where: {
      nama: { equals: nama, mode: "insensitive" },
      ...(excludeId !== undefined ? { NOT: { id_kategori: excludeId } } : {}),
    },
    select: { id_kategori: true },
  })
  if (bentrok) throw new KerjaSamaConflictError({ nama: ["Nama kategori sudah dipakai."] })
}

export async function listKategoriMitra(options: { hanyaAktif?: boolean } = {}) {
  const rows = await prisma.tbl_ref_kategori_mitra.findMany({
    where: options.hanyaAktif ? { aktif: true } : undefined,
    include: KATEGORI_INCLUDE,
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
  })
  return rows.map(toKategoriRef)
}

export async function createKategoriMitra(
  input: KategoriMitraInput,
  actor: Actor,
): Promise<KategoriMitraRef> {
  await assertKategoriNamaUnik(input.nama)

  const row = await prisma.tbl_ref_kategori_mitra.create({
    data: { nama: input.nama, urutan: input.urutan, aktif: input.aktif },
    include: KATEGORI_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: KATEGORI_ENTITY,
    entityId: row.id_kategori,
    deskripsi: `${actor.nama} menambahkan kategori mitra "${row.nama}".`,
    dataBaru: input,
  })

  return toKategoriRef(row)
}

export async function updateKategoriMitra(
  id: bigint,
  input: KategoriMitraInput,
  actor: Actor,
): Promise<KategoriMitraRef> {
  const before = await prisma.tbl_ref_kategori_mitra.findUniqueOrThrow({
    where: { id_kategori: id },
  })
  await assertKategoriNamaUnik(input.nama, id)

  const row = await prisma.tbl_ref_kategori_mitra.update({
    where: { id_kategori: id },
    data: { nama: input.nama, urutan: input.urutan, aktif: input.aktif },
    include: KATEGORI_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: KATEGORI_ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} mengubah kategori mitra "${row.nama}".`,
    dataLama: before,
    dataBaru: input,
  })

  return toKategoriRef(row)
}

export async function deleteKategoriMitra(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_ref_kategori_mitra.findUniqueOrThrow({
    where: { id_kategori: id },
    include: KATEGORI_INCLUDE,
  })

  if (before._count.mitra > 0) {
    throw new KerjaSamaInUseError(
      `Kategori "${before.nama}" masih dipakai ${before._count.mitra} mitra. Nonaktifkan saja, jangan dihapus.`,
    )
  }

  await prisma.tbl_ref_kategori_mitra.delete({ where: { id_kategori: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: KATEGORI_ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus kategori mitra "${before.nama}".`,
    dataLama: { nama: before.nama, urutan: before.urutan, aktif: before.aktif },
  })
}

// ============================================================
// BENTUK KEGIATAN
// ============================================================

const BENTUK_INCLUDE = {
  _count: { select: { naskah: true, kegiatan: true } },
} satisfies Prisma.tbl_ref_bentukInclude

type BentukRow = Prisma.tbl_ref_bentukGetPayload<{ include: typeof BENTUK_INCLUDE }>

function toBentukRef(row: BentukRow): BentukRef {
  return {
    id: String(row.id_bentuk),
    nama: row.nama,
    bidang: BIDANG_TO_LABEL[row.bidang],
    urutan: row.urutan,
    aktif: row.aktif,
    jumlahPemakai: row._count.naskah + row._count.kegiatan,
  }
}

async function assertBentukNamaUnik(nama: string, excludeId?: bigint) {
  const bentrok = await prisma.tbl_ref_bentuk.findFirst({
    where: {
      nama: { equals: nama, mode: "insensitive" },
      ...(excludeId !== undefined ? { NOT: { id_bentuk: excludeId } } : {}),
    },
    select: { id_bentuk: true },
  })
  if (bentrok) throw new KerjaSamaConflictError({ nama: ["Nama bentuk kegiatan sudah dipakai."] })
}

export async function listBentuk(options: { hanyaAktif?: boolean } = {}) {
  const rows = await prisma.tbl_ref_bentuk.findMany({
    where: options.hanyaAktif ? { aktif: true } : undefined,
    include: BENTUK_INCLUDE,
    orderBy: [{ bidang: "asc" }, { urutan: "asc" }, { nama: "asc" }],
  })
  return rows.map(toBentukRef)
}

export async function createBentuk(input: BentukInput, actor: Actor): Promise<BentukRef> {
  await assertBentukNamaUnik(input.nama)

  const row = await prisma.tbl_ref_bentuk.create({
    data: {
      nama: input.nama,
      bidang: LABEL_TO_BIDANG[input.bidang],
      urutan: input.urutan,
      aktif: input.aktif,
    },
    include: BENTUK_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: BENTUK_ENTITY,
    entityId: row.id_bentuk,
    deskripsi: `${actor.nama} menambahkan bentuk kegiatan "${row.nama}".`,
    dataBaru: input,
  })

  return toBentukRef(row)
}

export async function updateBentuk(
  id: bigint,
  input: BentukInput,
  actor: Actor,
): Promise<BentukRef> {
  const before = await prisma.tbl_ref_bentuk.findUniqueOrThrow({
    where: { id_bentuk: id },
    include: BENTUK_INCLUDE,
  })
  await assertBentukNamaUnik(input.nama, id)

  // Kegiatan menyimpan bidangnya sendiri dan harus sama dengan bidang bentuknya.
  // Mengubah bidang bentuk yang sudah dipakai kegiatan bikin data tidak konsisten.
  if (LABEL_TO_BIDANG[input.bidang] !== before.bidang && before._count.kegiatan > 0) {
    throw new KerjaSamaRuleError("Bidang bentuk ini tidak bisa diubah karena sudah dipakai kegiatan.", {
      bidang: ["Sudah dipakai oleh kegiatan, bidangnya tidak bisa diubah."],
    })
  }

  const row = await prisma.tbl_ref_bentuk.update({
    where: { id_bentuk: id },
    data: {
      nama: input.nama,
      bidang: LABEL_TO_BIDANG[input.bidang],
      urutan: input.urutan,
      aktif: input.aktif,
    },
    include: BENTUK_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: BENTUK_ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} mengubah bentuk kegiatan "${row.nama}".`,
    dataLama: { nama: before.nama, bidang: before.bidang, urutan: before.urutan, aktif: before.aktif },
    dataBaru: input,
  })

  return toBentukRef(row)
}

export async function deleteBentuk(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_ref_bentuk.findUniqueOrThrow({
    where: { id_bentuk: id },
    include: BENTUK_INCLUDE,
  })

  const dipakai = before._count.naskah + before._count.kegiatan
  if (dipakai > 0) {
    throw new KerjaSamaInUseError(
      `Bentuk "${before.nama}" masih dipakai ${dipakai} naskah/kegiatan. Nonaktifkan saja, jangan dihapus.`,
    )
  }

  await prisma.tbl_ref_bentuk.delete({ where: { id_bentuk: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: BENTUK_ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus bentuk kegiatan "${before.nama}".`,
    dataLama: { nama: before.nama, bidang: before.bidang, urutan: before.urutan, aktif: before.aktif },
  })
}
