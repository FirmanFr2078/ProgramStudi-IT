import "server-only"

import type { Prisma } from "@generated/client"
import { JabatanFungsional as PrismaJabatan } from "@generated/enums"
import { logEntityMutation, stampCreatedBy, stampUpdatedBy, type Actor } from "@/lib/authorship"
import { prisma } from "@/lib/prisma"
import { deleteFile, getPublicUrl } from "@/lib/storage"
import { DOSEN_FOTO_FOLDER } from "@/types"
import type { DosenAdmin, DosenInput, JabatanFungsional } from "@/types"

const ENTITY = "tbl_dosen"

const DOSEN_ADMIN_INCLUDE = {
  created_by: { select: { id_profile: true, nama: true } },
  updated_by: { select: { id_profile: true, nama: true } },
} satisfies Prisma.tbl_dosenInclude

type DosenRow = Prisma.tbl_dosenGetPayload<{ include: typeof DOSEN_ADMIN_INCLUDE }>

// ============================================================
// ENUM PRISMA <-> LABEL
// Prisma mengembalikan "TenagaPengajar" (tanpa spasi); @map di schema hanya
// mengubah nilai di kolom database. Label berspasi dipakai form & tampilan.
// Record<PrismaJabatan, ...> bikin TypeScript error kalau enum bertambah
// tapi mapping-nya lupa diisi.
// ============================================================

export const JABATAN_TO_LABEL: Record<PrismaJabatan, JabatanFungsional> = {
  TenagaPengajar: "Tenaga Pengajar",
  AsistenAhli: "Asisten Ahli",
  Lektor: "Lektor",
  LektorKepala: "Lektor Kepala",
  GuruBesar: "Guru Besar",
}

const LABEL_TO_JABATAN = Object.fromEntries(
  Object.entries(JABATAN_TO_LABEL).map(([enumValue, label]) => [label, enumValue]),
) as Record<JabatanFungsional, PrismaJabatan>

// ============================================================
// ERROR KONFLIK (slug / NIDN / email sudah dipakai)
// ============================================================

export class DosenConflictError extends Error {
  constructor(public readonly errors: Record<string, string[]>) {
    super("Ada data dosen lain yang memakai nilai unik yang sama.")
    this.name = "DosenConflictError"
  }
}

async function assertUnique(input: DosenInput, excludeId?: bigint) {
  const rows = await prisma.tbl_dosen.findMany({
    where: {
      OR: [{ slug: input.slug }, { nidn: input.nidn }, { email: input.email }],
      ...(excludeId !== undefined ? { NOT: { id_dosen: excludeId } } : {}),
    },
    select: { slug: true, nidn: true, email: true },
  })

  const errors: Record<string, string[]> = {}
  for (const row of rows) {
    if (row.slug === input.slug) errors.slug = ["Slug sudah dipakai dosen lain."]
    if (row.nidn === input.nidn) errors.nidn = ["NIDN sudah terdaftar pada dosen lain."]
    if (row.email === input.email) errors.email = ["Email sudah dipakai dosen lain."]
  }

  if (Object.keys(errors).length > 0) throw new DosenConflictError(errors)
}

// ============================================================
// FOTO
// ============================================================

function resolveFoto(value: string | null): string | null {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return getPublicUrl("images", value) ?? value
}

/** Hapus file lama dari Storage, hanya kalau memang file milik folder dosen. Best-effort. */
async function removeFotoIfOwned(path: string | null | undefined) {
  if (!path || !path.startsWith(`${DOSEN_FOTO_FOLDER}/`)) return
  try {
    await deleteFile("images", path)
  } catch (error) {
    console.error("[DOSEN_FOTO_CLEANUP]", error)
  }
}

/** Dipakai endpoint upload DELETE: file yang sudah dipakai baris dosen tidak boleh dihapus. */
export async function isDosenFotoInUse(path: string): Promise<boolean> {
  return (await prisma.tbl_dosen.count({ where: { foto: path } })) > 0
}

// ============================================================
// MAPPING
// ============================================================

function toRowData(input: DosenInput) {
  return {
    slug: input.slug,
    nama: input.nama,
    nidn: input.nidn,
    jabatan_struktural: input.jabatanStruktural,
    jabatan_fungsional: LABEL_TO_JABATAN[input.jabatanFungsional],
    pendidikan_s1_bidang: input.pendidikanS1.bidang,
    pendidikan_s1_kampus: input.pendidikanS1.kampus,
    pendidikan_s2_bidang: input.pendidikanS2?.bidang ?? null,
    pendidikan_s2_kampus: input.pendidikanS2?.kampus ?? null,
    pendidikan_s3_bidang: input.pendidikanS3?.bidang ?? null,
    pendidikan_s3_kampus: input.pendidikanS3?.kampus ?? null,
    bidang_keahlian: input.bidangKeahlian,
    mata_kuliah: input.mataKuliah,
    email: input.email,
    foto: input.foto,
    sinta: input.sinta,
    google_scholar: input.googleScholar,
  }
}

function toDosenAdmin(row: DosenRow): DosenAdmin {
  return {
    id: String(row.id_dosen),
    slug: row.slug,
    nama: row.nama,
    nidn: row.nidn,
    jabatanStruktural: row.jabatan_struktural,
    jabatanFungsional: JABATAN_TO_LABEL[row.jabatan_fungsional],
    pendidikanS1: { bidang: row.pendidikan_s1_bidang, kampus: row.pendidikan_s1_kampus },
    pendidikanS2:
      row.pendidikan_s2_bidang && row.pendidikan_s2_kampus
        ? { bidang: row.pendidikan_s2_bidang, kampus: row.pendidikan_s2_kampus }
        : null,
    pendidikanS3:
      row.pendidikan_s3_bidang && row.pendidikan_s3_kampus
        ? { bidang: row.pendidikan_s3_bidang, kampus: row.pendidikan_s3_kampus }
        : null,
    bidangKeahlian: row.bidang_keahlian,
    mataKuliah: row.mata_kuliah,
    email: row.email,
    foto: resolveFoto(row.foto),
    fotoPath: row.foto,
    sinta: row.sinta,
    googleScholar: row.google_scholar,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    createdBy: row.created_by
      ? { id: row.created_by.id_profile, nama: row.created_by.nama }
      : null,
    updatedBy: row.updated_by
      ? { id: row.updated_by.id_profile, nama: row.updated_by.nama }
      : null,
  }
}

// ============================================================
// QUERY & MUTASI
// ============================================================

export async function listDosenAdmin(): Promise<DosenAdmin[]> {
  const rows = await prisma.tbl_dosen.findMany({
    include: DOSEN_ADMIN_INCLUDE,
    orderBy: { nama: "asc" },
  })
  return rows.map(toDosenAdmin)
}

export async function getDosenByIdAdmin(id: bigint): Promise<DosenAdmin | null> {
  const row = await prisma.tbl_dosen.findUnique({
    where: { id_dosen: id },
    include: DOSEN_ADMIN_INCLUDE,
  })
  return row ? toDosenAdmin(row) : null
}

export async function createDosen(input: DosenInput, actor: Actor): Promise<DosenAdmin> {
  await assertUnique(input)

  const row = await prisma.tbl_dosen.create({
    data: { ...toRowData(input), ...stampCreatedBy(actor) },
    include: DOSEN_ADMIN_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: ENTITY,
    entityId: row.id_dosen,
    deskripsi: `${actor.nama} menambahkan dosen "${row.nama}".`,
    dataBaru: input,
  })

  return toDosenAdmin(row)
}

export async function updateDosen(
  id: bigint,
  input: DosenInput,
  actor: Actor,
): Promise<DosenAdmin> {
  const before = await prisma.tbl_dosen.findUniqueOrThrow({ where: { id_dosen: id } })
  await assertUnique(input, id)

  const row = await prisma.tbl_dosen.update({
    where: { id_dosen: id },
    data: { ...toRowData(input), ...stampUpdatedBy(actor) },
    include: DOSEN_ADMIN_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: row.id_dosen,
    deskripsi: `${actor.nama} mengubah data dosen "${row.nama}".`,
    dataLama: before,
    dataBaru: input,
  })

  // Foto diganti atau dihapus -> file lama jadi sampah di Storage.
  if (before.foto && before.foto !== input.foto) {
    await removeFotoIfOwned(before.foto)
  }

  return toDosenAdmin(row)
}

export async function deleteDosen(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_dosen.findUniqueOrThrow({ where: { id_dosen: id } })
  await prisma.tbl_dosen.delete({ where: { id_dosen: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus data dosen "${before.nama}".`,
    dataLama: before,
  })

  await removeFotoIfOwned(before.foto)
}