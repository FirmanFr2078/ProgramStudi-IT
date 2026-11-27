import "server-only"

import type { Prisma } from "@generated/client"

import {
  logEntityMutation,
  stampCreatedBy,
  stampUpdatedBy,
  type Actor,
} from "@/lib/authorship"
import { hitungStatusMitra, todayJakarta } from "@/lib/kerja-sama-status"
import { prisma } from "@/lib/prisma"
import { deleteFile } from "@/lib/storage"
import { MITRA_LOGO_FOLDER, type MitraAdmin, type MitraInput } from "@/types"

import { LABEL_TO_TINGKAT, TINGKAT_TO_LABEL } from "./enums"
import {
  AUDIT_SELECT,
  KerjaSamaConflictError,
  KerjaSamaInUseError,
  KerjaSamaRuleError,
  resolveImage,
  toAttribution,
  toId,
  toIsoDate,
} from "./shared"

const ENTITY = "tbl_mitra"

const MITRA_INCLUDE = {
  kategori: { select: { id_kategori: true, nama: true } },
  // Hanya kolom yang dibutuhkan untuk menghitung status mitra.
  naskah: { select: { status: true, mulai: true, berakhir: true } },
  created_by: AUDIT_SELECT,
  updated_by: AUDIT_SELECT,
} satisfies Prisma.tbl_mitraInclude

type MitraRow = Prisma.tbl_mitraGetPayload<{ include: typeof MITRA_INCLUDE }>

// ============================================================
// LOGO
// ============================================================

/** Hapus file lama dari Storage, hanya kalau memang file milik folder mitra. Best-effort. */
async function removeLogoIfOwned(path: string | null | undefined) {
  if (!path || !path.startsWith(`${MITRA_LOGO_FOLDER}/`)) return
  try {
    await deleteFile("images", path)
  } catch (error) {
    console.error("[MITRA_LOGO_CLEANUP]", error)
  }
}

/** Dipakai endpoint upload DELETE: file yang sudah dipakai baris mitra tidak boleh dihapus. */
export async function isMitraLogoInUse(path: string): Promise<boolean> {
  return (await prisma.tbl_mitra.count({ where: { logo: path } })) > 0
}

// ============================================================
// MAPPING
// ============================================================

function toRowData(input: MitraInput) {
  return {
    slug: input.slug,
    nama: input.nama,
    nama_singkat: input.namaSingkat,
    kategori_id: toId(input.kategoriId),
    tingkat: LABEL_TO_TINGKAT[input.tingkat],
    negara: input.negara,
    kota: input.kota,
    website: input.website,
    logo: input.logo,
    ringkasan: input.ringkasan,
    deskripsi: input.deskripsi,
    tampil_publik: input.tampilPublik,
    unggulan: input.unggulan,
    tampil_di_mbkm: input.tampilDiMbkm,
    urutan: input.urutan,
    kontak_nama: input.kontakNama,
    kontak_jabatan: input.kontakJabatan,
    kontak_email: input.kontakEmail,
    kontak_telepon: input.kontakTelepon,
    kontak_publik: input.kontakPublik,
    catatan_internal: input.catatanInternal,
  }
}

function toMitraAdmin(row: MitraRow, today: string): MitraAdmin {
  return {
    id: String(row.id_mitra),
    slug: row.slug,
    nama: row.nama,
    namaSingkat: row.nama_singkat,
    kategoriId: String(row.kategori.id_kategori),
    kategori: row.kategori.nama,
    tingkat: TINGKAT_TO_LABEL[row.tingkat],
    negara: row.negara,
    kota: row.kota,
    website: row.website,
    logo: resolveImage(row.logo),
    logoPath: row.logo,
    ringkasan: row.ringkasan,
    deskripsi: row.deskripsi,
    tampilPublik: row.tampil_publik,
    unggulan: row.unggulan,
    tampilDiMbkm: row.tampil_di_mbkm,
    urutan: row.urutan,
    kontakNama: row.kontak_nama,
    kontakJabatan: row.kontak_jabatan,
    kontakEmail: row.kontak_email,
    kontakTelepon: row.kontak_telepon,
    kontakPublik: row.kontak_publik,
    catatanInternal: row.catatan_internal,
    status: hitungStatusMitra(
      row.naskah.map((n) => ({
        status: n.status,
        mulai: toIsoDate(n.mulai),
        berakhir: n.berakhir ? toIsoDate(n.berakhir) : null,
      })),
      today,
    ),
    jumlahNaskah: row.naskah.length,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    createdBy: toAttribution(row.created_by),
    updatedBy: toAttribution(row.updated_by),
  }
}

// ============================================================
// VALIDASI YANG BUTUH DATABASE
// ============================================================

async function assertMitraValid(
  input: MitraInput,
  current?: { id: bigint; kategoriId: bigint },
) {
  // Slug unik
  const slugBentrok = await prisma.tbl_mitra.findFirst({
    where: {
      slug: input.slug,
      ...(current ? { NOT: { id_mitra: current.id } } : {}),
    },
    select: { id_mitra: true },
  })
  if (slugBentrok) {
    throw new KerjaSamaConflictError({ slug: ["Slug sudah dipakai mitra lain."] })
  }

  // Kategori harus ada; kategori nonaktif hanya boleh dipertahankan, tidak boleh dipilih baru.
  const kategoriId = toId(input.kategoriId)
  const kategori = await prisma.tbl_ref_kategori_mitra.findUnique({
    where: { id_kategori: kategoriId },
    select: { aktif: true },
  })
  if (!kategori) {
    throw new KerjaSamaRuleError("Kategori mitra tidak ditemukan.", {
      kategoriId: ["Kategori tidak ditemukan."],
    })
  }
  const kategoriBerubah = !current || current.kategoriId !== kategoriId
  if (!kategori.aktif && kategoriBerubah) {
    throw new KerjaSamaRuleError("Kategori mitra tidak aktif.", {
      kategoriId: ["Kategori ini sudah dinonaktifkan. Pilih kategori lain."],
    })
  }
}

// ============================================================
// QUERY & MUTASI
// ============================================================

export async function listMitraAdmin(): Promise<MitraAdmin[]> {
  const rows = await prisma.tbl_mitra.findMany({
    include: MITRA_INCLUDE,
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
  })
  const today = todayJakarta()
  return rows.map((row) => toMitraAdmin(row, today))
}

export async function getMitraByIdAdmin(id: bigint): Promise<MitraAdmin | null> {
  const row = await prisma.tbl_mitra.findUnique({
    where: { id_mitra: id },
    include: MITRA_INCLUDE,
  })
  return row ? toMitraAdmin(row, todayJakarta()) : null
}

export async function createMitra(input: MitraInput, actor: Actor): Promise<MitraAdmin> {
  await assertMitraValid(input)

  const row = await prisma.tbl_mitra.create({
    data: { ...toRowData(input), ...stampCreatedBy(actor) },
    include: MITRA_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: ENTITY,
    entityId: row.id_mitra,
    deskripsi: `${actor.nama} menambahkan mitra "${row.nama}".`,
    dataBaru: input,
  })

  return toMitraAdmin(row, todayJakarta())
}

export async function updateMitra(
  id: bigint,
  input: MitraInput,
  actor: Actor,
): Promise<MitraAdmin> {
  const before = await prisma.tbl_mitra.findUniqueOrThrow({ where: { id_mitra: id } })
  await assertMitraValid(input, { id, kategoriId: before.kategori_id })

  const row = await prisma.tbl_mitra.update({
    where: { id_mitra: id },
    data: { ...toRowData(input), ...stampUpdatedBy(actor) },
    include: MITRA_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: row.id_mitra,
    deskripsi: `${actor.nama} mengubah data mitra "${row.nama}".`,
    dataLama: before,
    dataBaru: input,
  })

  // Logo diganti atau dihapus -> file lama jadi sampah di Storage.
  if (before.logo && before.logo !== input.logo) {
    await removeLogoIfOwned(before.logo)
  }

  return toMitraAdmin(row, todayJakarta())
}

/**
 * Mitra yang masih punya naskah tidak boleh dihapus (relasi Restrict): naskah dan
 * kegiatan adalah bukti akreditasi. Untuk menyembunyikan dari publik cukup
 * matikan `tampil_publik`.
 */
export async function deleteMitra(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_mitra.findUniqueOrThrow({
    where: { id_mitra: id },
    include: { _count: { select: { naskah: true } } },
  })

  if (before._count.naskah > 0) {
    throw new KerjaSamaInUseError(
      `Mitra "${before.nama}" masih memiliki ${before._count.naskah} naskah. Hapus naskahnya dulu, atau cukup sembunyikan mitra dari publik.`,
    )
  }

  await prisma.tbl_mitra.delete({ where: { id_mitra: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus mitra "${before.nama}".`,
    dataLama: before,
  })

  await removeLogoIfOwned(before.logo)
}
