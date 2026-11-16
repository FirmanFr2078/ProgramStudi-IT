import "server-only"

import { prisma } from "@/lib/prisma"
import type { Prisma } from "@generated/client"
import { logEntityMutation, stampCreatedBy, stampUpdatedBy, type Actor } from "@/lib/authorship"
import { deleteFile, extractObjectPath, getPublicUrl } from "@/lib/storage"
import { KABAR_FOTO_FOLDER, type ArticleBlock, type KabarAdmin, type KabarInput } from "@/types"

const ENTITY = "tbl_kabar"

const KABAR_ADMIN_INCLUDE = {
  created_by: { select: { id_profile: true, nama: true } },
  updated_by: { select: { id_profile: true, nama: true } },
} satisfies Prisma.tbl_kabarInclude

type KabarRow = Prisma.tbl_kabarGetPayload<{ include: typeof KABAR_ADMIN_INCLUDE }>

function resolveImage(value: string | null): string | null {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return getPublicUrl("images", value) ?? value
}

function toKabarAdmin(row: KabarRow): KabarAdmin {
  return {
    id: String(row.id_kabar),
    slug: row.slug,
    judul: row.judul,
    ringkasan: row.ringkasan,
    konten: row.konten as unknown as ArticleBlock[],
    kategori: row.kategori,
    tanggal: row.tanggal.toISOString().slice(0, 10),
    gambar: resolveImage(row.gambar),
    gambarPath: row.gambar,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    createdBy: row.created_by ? { id: row.created_by.id_profile, nama: row.created_by.nama } : null,
    updatedBy: row.updated_by ? { id: row.updated_by.id_profile, nama: row.updated_by.nama } : null,
  }
}

function toPrismaJson(value: ArticleBlock[]): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue
}

// ============================================================
// PEMBERSIHAN GAMBAR DI STORAGE
// Gambar sampul disimpan sebagai PATH ("kabar/xxx.jpg"), gambar di dalam
// blok konten disimpan sebagai URL PUBLIK penuh. Dua-duanya cuma boleh
// dihapus kalau memang berada di folder "kabar/" milik modul ini -- supaya
// gambar dosen atau modul lain yang kebetulan URL-nya mirip tidak ikut kehapus.
// ============================================================

/** Hapus satu file dari Storage, hanya kalau path-nya di folder "kabar/". Best-effort. */
async function removeKabarImageIfOwned(path: string | null | undefined) {
  if (!path || !path.startsWith(`${KABAR_FOTO_FOLDER}/`)) return
  try {
    await deleteFile("images", path)
  } catch (error) {
    console.error("[KABAR_IMAGE_CLEANUP]", error)
  }
}

/** Ambil semua path gambar blok "image" di dalam satu artikel yang berada di folder "kabar/". */
function collectContentImagePaths(konten: unknown): string[] {
  const blocks = (konten ?? []) as ArticleBlock[]
  const paths: string[] = []

  for (const block of blocks) {
    if (block.type !== "image") continue
    const path = extractObjectPath("images", block.image)
    if (path && path.startsWith(`${KABAR_FOTO_FOLDER}/`)) paths.push(path)
  }

  return paths
}

/** Dipanggil setelah update sukses: hapus gambar lama yang sudah tidak dipakai versi baru. */
async function removeOrphanedImages(
  before: { gambar: string | null; konten: unknown },
  after: { gambar: string | null; konten: ArticleBlock[] },
) {
  if (before.gambar && before.gambar !== after.gambar) {
    await removeKabarImageIfOwned(before.gambar)
  }

  const beforePaths = collectContentImagePaths(before.konten)
  const afterPaths = new Set(collectContentImagePaths(after.konten))

  for (const path of beforePaths) {
    if (!afterPaths.has(path)) await removeKabarImageIfOwned(path)
  }
}

// ============================================================
// QUERY & MUTASI
// ============================================================

export async function listKabarAdmin(): Promise<KabarAdmin[]> {
  const rows = await prisma.tbl_kabar.findMany({
    include: KABAR_ADMIN_INCLUDE,
    orderBy: { tanggal: "desc" },
  })
  return rows.map(toKabarAdmin)
}

export async function getKabarByIdAdmin(id: bigint): Promise<KabarAdmin | null> {
  const row = await prisma.tbl_kabar.findUnique({
    where: { id_kabar: id },
    include: KABAR_ADMIN_INCLUDE,
  })
  return row ? toKabarAdmin(row) : null
}

export async function createKabar(input: KabarInput, actor: Actor): Promise<KabarAdmin> {
  const { konten, ...fields } = input
  const row = await prisma.tbl_kabar.create({
    data: { ...fields, konten: toPrismaJson(konten), ...stampCreatedBy(actor) },
    include: KABAR_ADMIN_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: ENTITY,
    entityId: row.id_kabar,
    deskripsi: `${actor.nama} membuat kabar "${row.judul}".`,
    dataBaru: input,
  })

  return toKabarAdmin(row)
}

export async function updateKabar(id: bigint, input: KabarInput, actor: Actor): Promise<KabarAdmin> {
  const before = await prisma.tbl_kabar.findUniqueOrThrow({ where: { id_kabar: id } })
  const { konten, ...fields } = input

  const row = await prisma.tbl_kabar.update({
    where: { id_kabar: id },
    data: { ...fields, konten: toPrismaJson(konten), ...stampUpdatedBy(actor) },
    include: KABAR_ADMIN_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: row.id_kabar,
    deskripsi: `${actor.nama} mengubah kabar "${row.judul}".`,
    dataLama: before,
    dataBaru: input,
  })

  // Gambar sampul atau gambar di dalam konten yang diganti/dihapus -> jadi sampah di Storage.
  await removeOrphanedImages(before, { gambar: input.gambar, konten: input.konten })

  return toKabarAdmin(row)
}

export async function deleteKabar(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_kabar.findUniqueOrThrow({ where: { id_kabar: id } })
  await prisma.tbl_kabar.delete({ where: { id_kabar: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus kabar "${before.judul}".`,
    dataLama: before,
  })

  await removeKabarImageIfOwned(before.gambar)
  for (const path of collectContentImagePaths(before.konten)) {
    await removeKabarImageIfOwned(path)
  }
}