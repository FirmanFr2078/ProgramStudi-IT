import "server-only"

import type { Prisma } from "@generated/client"

import {
  logEntityMutation,
  stampCreatedBy,
  stampUpdatedBy,
  type Actor,
} from "@/lib/authorship"
import { tahunAkademik } from "@/lib/kerja-sama-status"
import { deleteKerjaSamaFiles } from "@/lib/kerja-sama-storage"
import { prisma } from "@/lib/prisma"
import type { KegiatanAdmin, KegiatanInput } from "@/types"

import { toBerkasAdmin } from "./berkas"
import { BIDANG_TO_LABEL, LABEL_TO_BIDANG } from "./enums"
import {
  AUDIT_SELECT,
  KerjaSamaRuleError,
  toAttribution,
  toDbDate,
  toDbDateOrNull,
  toId,
  toIdOrNull,
  toIsoDate,
  type FieldErrors,
} from "./shared"

const ENTITY = "tbl_kerja_sama_kegiatan"

const KEGIATAN_INCLUDE = {
  kerja_sama: {
    select: {
      id_kerja_sama: true,
      judul: true,
      jenis: true,
      mitra: { select: { id_mitra: true, nama: true } },
    },
  },
  bentuk: { select: { id_bentuk: true, nama: true, bidang: true } },
  berkas: { orderBy: { created_at: "asc" } },
  created_by: AUDIT_SELECT,
  updated_by: AUDIT_SELECT,
} satisfies Prisma.tbl_kerja_sama_kegiatanInclude

type KegiatanRow = Prisma.tbl_kerja_sama_kegiatanGetPayload<{ include: typeof KEGIATAN_INCLUDE }>

function toRowData(input: KegiatanInput) {
  return {
    kerja_sama_id: toId(input.kerjaSamaId),
    bidang: LABEL_TO_BIDANG[input.bidang],
    bentuk_id: toIdOrNull(input.bentukId),
    judul: input.judul,
    uraian: input.uraian,
    manfaat: input.manfaat,
    tanggal_mulai: toDbDate(input.tanggalMulai),
    tanggal_selesai: toDbDateOrNull(input.tanggalSelesai),
    jumlah_peserta: input.jumlahPeserta,
    status: input.status,
    tampil_publik: input.tampilPublik,
  }
}

function toKegiatanAdmin(row: KegiatanRow): KegiatanAdmin {
  const tanggalMulai = toIsoDate(row.tanggal_mulai)

  return {
    id: String(row.id_kegiatan),
    kerjaSamaId: String(row.kerja_sama.id_kerja_sama),
    naskahJudul: row.kerja_sama.judul,
    naskahJenis: row.kerja_sama.jenis,
    mitraId: String(row.kerja_sama.mitra.id_mitra),
    mitraNama: row.kerja_sama.mitra.nama,
    bidang: BIDANG_TO_LABEL[row.bidang],
    bentuk: row.bentuk
      ? {
          id: String(row.bentuk.id_bentuk),
          nama: row.bentuk.nama,
          bidang: BIDANG_TO_LABEL[row.bentuk.bidang],
        }
      : null,
    judul: row.judul,
    uraian: row.uraian,
    manfaat: row.manfaat,
    tanggalMulai,
    tanggalSelesai: row.tanggal_selesai ? toIsoDate(row.tanggal_selesai) : null,
    tahunAkademik: tahunAkademik(tanggalMulai),
    jumlahPeserta: row.jumlah_peserta,
    status: row.status,
    tampilPublik: row.tampil_publik,
    berkas: row.berkas.map(toBerkasAdmin),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    createdBy: toAttribution(row.created_by),
    updatedBy: toAttribution(row.updated_by),
  }
}

// ============================================================
// VALIDASI YANG BUTUH DATABASE
// Tanggal kegiatan yang jatuh di luar masa berlaku naskah SENGAJA tidak diblokir
// (realisasi kadang tercatat terlambat); UI cukup menampilkan peringatan.
// ============================================================

type CurrentKegiatan = { mitraId: bigint; bentukId: bigint | null }

async function assertKegiatanValid(input: KegiatanInput, current?: CurrentKegiatan) {
  const errors: FieldErrors = {}
  const add = (field: string, message: string) => {
    errors[field] = [...(errors[field] ?? []), message]
  }

  const naskah = await prisma.tbl_kerja_sama.findUnique({
    where: { id_kerja_sama: toId(input.kerjaSamaId) },
    select: { mitra_id: true, status: true },
  })

  if (!naskah) {
    add("kerjaSamaId", "Naskah tidak ditemukan.")
  } else {
    if (naskah.status === "Dibatalkan") {
      add("kerjaSamaId", "Naskah yang dibatalkan tidak bisa diberi kegiatan.")
    }
    // Memindahkan kegiatan antar mitra mengubah arti datanya; buat kegiatan baru saja.
    if (current && naskah.mitra_id !== current.mitraId) {
      add("kerjaSamaId", "Kegiatan hanya bisa dipindah ke naskah milik mitra yang sama.")
    }
  }

  const bentukId = toIdOrNull(input.bentukId)
  if (bentukId !== null) {
    const bentuk = await prisma.tbl_ref_bentuk.findUnique({
      where: { id_bentuk: bentukId },
      select: { bidang: true, aktif: true },
    })
    if (!bentuk) {
      add("bentukId", "Bentuk kegiatan tidak ditemukan.")
    } else {
      if (bentuk.bidang !== LABEL_TO_BIDANG[input.bidang]) {
        add("bentukId", `Bentuk ini termasuk bidang ${BIDANG_TO_LABEL[bentuk.bidang]}, bukan ${input.bidang}.`)
      }
      if (!bentuk.aktif && current?.bentukId !== bentukId) {
        add("bentukId", "Bentuk kegiatan ini sudah dinonaktifkan.")
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new KerjaSamaRuleError("Periksa kembali isian yang ditandai.", errors)
  }
}

// ============================================================
// QUERY & MUTASI
// ============================================================

export async function listKegiatanAdmin(
  filter: { kerjaSamaId?: bigint; mitraId?: bigint } = {},
): Promise<KegiatanAdmin[]> {
  const where: Prisma.tbl_kerja_sama_kegiatanWhereInput = {}
  if (filter.kerjaSamaId !== undefined) where.kerja_sama_id = filter.kerjaSamaId
  if (filter.mitraId !== undefined) where.kerja_sama = { mitra_id: filter.mitraId }

  const rows = await prisma.tbl_kerja_sama_kegiatan.findMany({
    where,
    include: KEGIATAN_INCLUDE,
    orderBy: [{ tanggal_mulai: "desc" }, { id_kegiatan: "desc" }],
  })
  return rows.map(toKegiatanAdmin)
}

export async function getKegiatanByIdAdmin(id: bigint): Promise<KegiatanAdmin | null> {
  const row = await prisma.tbl_kerja_sama_kegiatan.findUnique({
    where: { id_kegiatan: id },
    include: KEGIATAN_INCLUDE,
  })
  return row ? toKegiatanAdmin(row) : null
}

export async function createKegiatan(input: KegiatanInput, actor: Actor): Promise<KegiatanAdmin> {
  await assertKegiatanValid(input)

  const row = await prisma.tbl_kerja_sama_kegiatan.create({
    data: { ...toRowData(input), ...stampCreatedBy(actor) },
    include: KEGIATAN_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: ENTITY,
    entityId: row.id_kegiatan,
    deskripsi: `${actor.nama} menambahkan kegiatan "${row.judul}" pada mitra "${row.kerja_sama.mitra.nama}".`,
    dataBaru: input,
  })

  return toKegiatanAdmin(row)
}

export async function updateKegiatan(
  id: bigint,
  input: KegiatanInput,
  actor: Actor,
): Promise<KegiatanAdmin> {
  const before = await prisma.tbl_kerja_sama_kegiatan.findUniqueOrThrow({
    where: { id_kegiatan: id },
    include: { kerja_sama: { select: { mitra_id: true } } },
  })

  await assertKegiatanValid(input, {
    mitraId: before.kerja_sama.mitra_id,
    bentukId: before.bentuk_id,
  })

  const row = await prisma.tbl_kerja_sama_kegiatan.update({
    where: { id_kegiatan: id },
    data: { ...toRowData(input), ...stampUpdatedBy(actor) },
    include: KEGIATAN_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: row.id_kegiatan,
    deskripsi: `${actor.nama} mengubah kegiatan "${row.judul}".`,
    dataLama: before,
    dataBaru: input,
  })

  return toKegiatanAdmin(row)
}

export async function deleteKegiatan(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_kerja_sama_kegiatan.findUniqueOrThrow({
    where: { id_kegiatan: id },
    include: { berkas: { select: { path: true } } },
  })

  const paths = before.berkas.map((b) => b.path)
  await prisma.tbl_kerja_sama_kegiatan.delete({ where: { id_kegiatan: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus kegiatan "${before.judul}".`,
    dataLama: { ...before, berkas: undefined },
  })

  await deleteKerjaSamaFiles(paths)
}
