import "server-only"

import type { Prisma } from "@generated/client"

import {
  logEntityMutation,
  stampCreatedBy,
  stampUpdatedBy,
  type Actor,
} from "@/lib/authorship"
import { prisma } from "@/lib/prisma"
import { deleteFile } from "@/lib/storage"
import { FASILITAS_FOTO_FOLDER, type FasilitasAdmin, type FasilitasInput, type FasilitasRingkas } from "@/types"

import { KEPEMILIKAN_TO_LABEL, KONDISI_TO_LABEL, LABEL_TO_KEPEMILIKAN, LABEL_TO_KONDISI, LABEL_TO_STATUS, STATUS_TO_LABEL } from "./enums"
import { toAlatAdmin } from "./alat"
import { toBerkasAdmin } from "./berkas"
import {
  AUDIT_SELECT,
  FasilitasConflictError,
  FasilitasInUseError,
  FasilitasRuleError,
  resolveImage,
  toAttribution,
  toId,
  toIdOrNull,
  toNumberOrNull,
} from "./shared"

const ENTITY = "tbl_fasilitas"

const FASILITAS_INCLUDE = {
  kategori: { select: { id_kategori: true, nama: true } },
  gedung: { select: { nama: true } },
  _count: { select: { ruangan: true } },
  alat: { orderBy: { nama: "asc" } },
  berkas: { orderBy: [{ urutan: "asc" }, { created_at: "asc" }] },
  created_by: AUDIT_SELECT,
  updated_by: AUDIT_SELECT,
} satisfies Prisma.tbl_fasilitasInclude

type FasilitasRow = Prisma.tbl_fasilitasGetPayload<{ include: typeof FASILITAS_INCLUDE }>

// ============================================================
// FOTO
// ============================================================

async function removeFotoIfOwned(path: string | null | undefined) {
  if (!path || !path.startsWith(`${FASILITAS_FOTO_FOLDER}/`)) return
  try {
    await deleteFile("images", path)
  } catch (error) {
    console.error("[FASILITAS_FOTO_CLEANUP]", error)
  }
}

export async function isFasilitasFotoInUse(path: string): Promise<boolean> {
  return (await prisma.tbl_fasilitas.count({ where: { foto: path } })) > 0
}

// ============================================================
// MAPPING
// ============================================================

function toRowData(input: FasilitasInput) {
  return {
    slug: input.slug,
    nama: input.nama,
    kategori_id: toId(input.kategoriId),
    gedung_id: toIdOrNull(input.gedungId),
    lantai: input.lantai,
    deskripsi: input.deskripsi,
    foto: input.foto,
    luas_m2: input.luasM2,
    kapasitas: input.kapasitas,
    kepemilikan: LABEL_TO_KEPEMILIKAN[input.kepemilikan],
    kondisi: LABEL_TO_KONDISI[input.kondisi],
    status: LABEL_TO_STATUS[input.status],
    aksesibel_difabel: input.aksesibelDifabel,
    penggunaan_jam_per_minggu: input.penggunaanJamPerMinggu,
    tampil_publik: input.tampilPublik,
    unggulan: input.unggulan,
    urutan: input.urutan,
  }
}

function toFasilitasAdmin(row: FasilitasRow): FasilitasAdmin {
  return {
    id: String(row.id_fasilitas),
    slug: row.slug,
    nama: row.nama,
    kategoriId: String(row.kategori.id_kategori),
    kategori: row.kategori.nama,
    gedungId: row.gedung_id ? String(row.gedung_id) : null,
    gedungNama: row.gedung?.nama ?? null,
    lantai: row.lantai,
    deskripsi: row.deskripsi,
    foto: resolveImage(row.foto),
    fotoPath: row.foto,
    luasM2: toNumberOrNull(row.luas_m2),
    kapasitas: row.kapasitas,
    kepemilikan: KEPEMILIKAN_TO_LABEL[row.kepemilikan],
    kondisi: KONDISI_TO_LABEL[row.kondisi],
    status: STATUS_TO_LABEL[row.status],
    aksesibelDifabel: row.aksesibel_difabel,
    penggunaanJamPerMinggu: row.penggunaan_jam_per_minggu,
    tampilPublik: row.tampil_publik,
    unggulan: row.unggulan,
    urutan: row.urutan,
    jumlahRuangan: row._count.ruangan,
    alat: row.alat.map(toAlatAdmin),
    berkas: row.berkas.map(toBerkasAdmin),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    createdBy: toAttribution(row.created_by),
    updatedBy: toAttribution(row.updated_by),
  }
}

// ============================================================
// VALIDASI YANG BUTUH DATABASE
// ============================================================

async function assertFasilitasValid(input: FasilitasInput, currentId?: bigint) {
  const slugBentrok = await prisma.tbl_fasilitas.findFirst({
    where: {
      slug: input.slug,
      ...(currentId !== undefined ? { NOT: { id_fasilitas: currentId } } : {}),
    },
    select: { id_fasilitas: true },
  })
  if (slugBentrok) throw new FasilitasConflictError({ slug: ["Slug sudah dipakai fasilitas lain."] })

  const kategoriId = toId(input.kategoriId)
  const kategori = await prisma.tbl_ref_kategori_fasilitas.findUnique({
    where: { id_kategori: kategoriId },
    select: { aktif: true },
  })
  if (!kategori) {
    throw new FasilitasRuleError("Kategori fasilitas tidak ditemukan.", {
      kategoriId: ["Kategori tidak ditemukan."],
    })
  }
  if (!kategori.aktif) {
    throw new FasilitasRuleError("Kategori fasilitas tidak aktif.", {
      kategoriId: ["Kategori ini sudah dinonaktifkan. Pilih kategori lain."],
    })
  }

  const gedungId = toIdOrNull(input.gedungId)
  if (gedungId !== null) {
    if (currentId !== undefined && gedungId === currentId) {
      throw new FasilitasRuleError("Fasilitas tidak boleh menjadi gedung untuk dirinya sendiri.", {
        gedungId: ["Tidak boleh memilih dirinya sendiri."],
      })
    }
    const gedung = await prisma.tbl_fasilitas.findUnique({
      where: { id_fasilitas: gedungId },
      select: { gedung_id: true },
    })
    if (!gedung) {
      throw new FasilitasRuleError("Gedung induk tidak ditemukan.", { gedungId: ["Gedung tidak ditemukan."] })
    }
    // Hierarki dibatasi 2 level: gedung yang dipilih tidak boleh sudah punya gedung induk sendiri.
    if (gedung.gedung_id !== null) {
      throw new FasilitasRuleError("Gedung induk tidak boleh berada di dalam gedung lain.", {
        gedungId: ["Pilih gedung tingkat atas, bukan ruangan."],
      })
    }
  }
}

// ============================================================
// QUERY & MUTASI
// ============================================================

export async function listFasilitasAdmin(): Promise<FasilitasAdmin[]> {
  const rows = await prisma.tbl_fasilitas.findMany({
    include: FASILITAS_INCLUDE,
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
  })
  return rows.map(toFasilitasAdmin)
}

export async function getFasilitasByIdAdmin(id: bigint): Promise<FasilitasAdmin | null> {
  const row = await prisma.tbl_fasilitas.findUnique({
    where: { id_fasilitas: id },
    include: FASILITAS_INCLUDE,
  })
  return row ? toFasilitasAdmin(row) : null
}

/** Ringkasan untuk dropdown "pilih gedung induk" -- hanya baris tanpa gedung_id (tingkat atas). */
export async function listGedungRingkas(): Promise<FasilitasRingkas[]> {
  const rows = await prisma.tbl_fasilitas.findMany({
    where: { gedung_id: null },
    select: { id_fasilitas: true, nama: true, kategori: { select: { nama: true } } },
    orderBy: { nama: "asc" },
  })
  return rows.map((row) => ({
    id: String(row.id_fasilitas),
    nama: row.nama,
    kategori: row.kategori.nama,
  }))
}

export async function createFasilitas(input: FasilitasInput, actor: Actor): Promise<FasilitasAdmin> {
  await assertFasilitasValid(input)

  const row = await prisma.tbl_fasilitas.create({
    data: { ...toRowData(input), ...stampCreatedBy(actor) },
    include: FASILITAS_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: ENTITY,
    entityId: row.id_fasilitas,
    deskripsi: `${actor.nama} menambahkan fasilitas "${row.nama}".`,
    dataBaru: input,
  })

  return toFasilitasAdmin(row)
}

export async function updateFasilitas(
  id: bigint,
  input: FasilitasInput,
  actor: Actor,
): Promise<FasilitasAdmin> {
  const before = await prisma.tbl_fasilitas.findUniqueOrThrow({ where: { id_fasilitas: id } })
  await assertFasilitasValid(input, id)

  const row = await prisma.tbl_fasilitas.update({
    where: { id_fasilitas: id },
    data: { ...toRowData(input), ...stampUpdatedBy(actor) },
    include: FASILITAS_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: row.id_fasilitas,
    deskripsi: `${actor.nama} mengubah data fasilitas "${row.nama}".`,
    dataLama: before,
    dataBaru: input,
  })

  if (before.foto && before.foto !== input.foto) {
    await removeFotoIfOwned(before.foto)
  }

  return toFasilitasAdmin(row)
}

/**
 * Gedung yang masih punya ruangan tidak boleh dihapus. Alat & berkas ikut
 * terhapus otomatis (relasi Cascade), tapi file di Storage harus dibersihkan manual.
 */
export async function deleteFasilitas(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_fasilitas.findUniqueOrThrow({
    where: { id_fasilitas: id },
    include: { _count: { select: { ruangan: true } }, berkas: true },
  })

  if (before._count.ruangan > 0) {
    throw new FasilitasInUseError(
      `"${before.nama}" masih memiliki ${before._count.ruangan} ruangan di dalamnya. Pindahkan atau hapus ruangannya dulu.`,
    )
  }

  await prisma.tbl_fasilitas.delete({ where: { id_fasilitas: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus fasilitas "${before.nama}".`,
    dataLama: before,
  })

  await removeFotoIfOwned(before.foto)
  for (const berkas of before.berkas) {
    const kategori = (["Sertifikat Kalibrasi", "Dokumen Inventaris", "Lainnya"] as const).includes(
      berkas.jenis as never,
    )
    await deleteFile(kategori ? "documents" : "images", berkas.path).catch((error) =>
      console.error("[FASILITAS_BERKAS_CLEANUP]", error),
    )
  }
}