import "server-only"

import type { Prisma } from "@generated/client"

import {
  logEntityMutation,
  stampCreatedBy,
  stampUpdatedBy,
  type Actor,
} from "@/lib/authorship"
import { deleteKerjaSamaFiles } from "@/lib/kerja-sama-storage"
import { hitungStatusKode, kodeMasihBerlaku } from "@/lib/kerja-sama-kode"
import { hitungMasaBerlaku, todayJakarta } from "@/lib/kerja-sama-status"
import { prisma } from "@/lib/prisma"
import { deleteFile } from "@/lib/storage"
import { INDUK_NASKAH, NASKAH_PREVIEW_FOLDER, type NaskahAdmin, type NaskahInput, type NaskahOpsi } from "@/types"

import { BIDANG_TO_LABEL } from "./enums"
import { toBerkasAdmin } from "./berkas"
import {
  AUDIT_SELECT,
  KerjaSamaConflictError,
  KerjaSamaInUseError,
  KerjaSamaRuleError,
  toAttribution,
  toDbDate,
  toDbDateOrNull,
  toId,
  toIdOrNull,
  resolveImage,
  toIsoDate,
  type FieldErrors,
} from "./shared"

const ENTITY = "tbl_kerja_sama"

const NASKAH_INCLUDE = {
  mitra: { select: { id_mitra: true, nama: true } },
  pj_dosen: { select: { id_dosen: true, nama: true } },
  induk: { select: { id_kerja_sama: true, jenis: true, judul: true } },
  perpanjangan_dari: { select: { id_kerja_sama: true, judul: true } },
  bentuk: { select: { id_bentuk: true, nama: true, bidang: true }, orderBy: { nama: "asc" } },
  berkas: { orderBy: { created_at: "asc" } },
  kode_unduh: { select: { dipakai_pertama_pada: true, dicabut_pada: true } },
  _count: { select: { kegiatan: true } },
  created_by: AUDIT_SELECT,
  updated_by: AUDIT_SELECT,
} satisfies Prisma.tbl_kerja_samaInclude

type NaskahRow = Prisma.tbl_kerja_samaGetPayload<{ include: typeof NASKAH_INCLUDE }>

// ============================================================
// MAPPING
// ============================================================

function toRowData(input: NaskahInput) {
  return {
    mitra_id: toId(input.mitraId),
    jenis: input.jenis,
    judul: input.judul,
    status: input.status,
    nomor_prodi: input.nomorProdi,
    nomor_mitra: input.nomorMitra,
    tempat_ttd: input.tempatTtd,
    tanggal_ttd: toDbDateOrNull(input.tanggalTtd),
    mulai: toDbDate(input.mulai),
    berakhir: toDbDateOrNull(input.berakhir),
    ruang_lingkup: input.ruangLingkup,
    pembiayaan: input.pembiayaan,
    ttd_prodi: input.ttdProdi,
    ttd_mitra: input.ttdMitra,
    pj_dosen_id: toIdOrNull(input.pjDosenId),
    pj_mitra: input.pjMitra,
    induk_id: toIdOrNull(input.indukId),
    perpanjangan_dari_id: toIdOrNull(input.perpanjanganDariId),
    preview: input.preview,
    catatan_internal: input.catatanInternal,
  }
}

/** Hapus gambar pratinjau lama dari bucket publik, hanya kalau memang milik folder pratinjau. */
async function hapusPreviewJikaMilik(path: string | null | undefined) {
  if (!path || !path.startsWith(`${NASKAH_PREVIEW_FOLDER}/`)) return
  try {
    await deleteFile("images", path)
  } catch (error) {
    console.error("[NASKAH_PREVIEW_CLEANUP]", error)
  }
}

/** Dipakai endpoint upload pratinjau DELETE (rollback): gambar yang sudah dipakai tidak boleh dihapus. */
export async function isNaskahPreviewInUse(path: string): Promise<boolean> {
  return (await prisma.tbl_kerja_sama.count({ where: { preview: path } })) > 0
}

function toNaskahAdmin(row: NaskahRow, today: string): NaskahAdmin {
  const sekarang = new Date()
  const mulai = toIsoDate(row.mulai)
  const berakhir = row.berakhir ? toIsoDate(row.berakhir) : null
  const { masa, sisaHari } = hitungMasaBerlaku({ status: row.status, mulai, berakhir }, today)

  return {
    id: String(row.id_kerja_sama),
    mitraId: String(row.mitra.id_mitra),
    mitraNama: row.mitra.nama,
    jenis: row.jenis,
    judul: row.judul,
    status: row.status,
    masaBerlaku: masa,
    sisaHari,
    nomorProdi: row.nomor_prodi,
    nomorMitra: row.nomor_mitra,
    tempatTtd: row.tempat_ttd,
    tanggalTtd: row.tanggal_ttd ? toIsoDate(row.tanggal_ttd) : null,
    mulai,
    berakhir,
    ruangLingkup: row.ruang_lingkup,
    pembiayaan: row.pembiayaan,
    ttdProdi: row.ttd_prodi,
    ttdMitra: row.ttd_mitra,
    pjDosen: row.pj_dosen ? { id: String(row.pj_dosen.id_dosen), nama: row.pj_dosen.nama } : null,
    pjMitra: row.pj_mitra,
    induk: row.induk
      ? { id: String(row.induk.id_kerja_sama), jenis: row.induk.jenis, judul: row.induk.judul }
      : null,
    perpanjanganDari: row.perpanjangan_dari
      ? { id: String(row.perpanjangan_dari.id_kerja_sama), judul: row.perpanjangan_dari.judul }
      : null,
    bentuk: row.bentuk.map((b) => ({
      id: String(b.id_bentuk),
      nama: b.nama,
      bidang: BIDANG_TO_LABEL[b.bidang],
    })),
    jumlahKegiatan: row._count.kegiatan,
    berkas: row.berkas.map(toBerkasAdmin),
    preview: resolveImage(row.preview),
    previewPath: row.preview,
    bisaDiunduh: row.berkas.some((b) => b.utama && b.path !== null),
    jumlahKodeAktif: row.kode_unduh.filter((k) =>
      kodeMasihBerlaku(
        hitungStatusKode(
          { dipakaiPertamaPada: k.dipakai_pertama_pada, dicabutPada: k.dicabut_pada },
          sekarang,
        ).status,
      ),
    ).length,
    catatanInternal: row.catatan_internal,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    createdBy: toAttribution(row.created_by),
    updatedBy: toAttribution(row.updated_by),
  }
}

// ============================================================
// VALIDASI YANG BUTUH DATABASE
// Aturan bentuk-isian (berakhir >= mulai, IA wajib induk, dst.) sudah dicek di
// naskahInputSchema. Di sini aturan yang perlu membaca baris lain.
// ============================================================

type CurrentNaskah = { id: bigint; mitraId: bigint; bentukIds: Set<string> }

async function assertNaskahValid(input: NaskahInput, current?: CurrentNaskah) {
  const errors: FieldErrors = {}
  const add = (field: string, message: string) => {
    errors[field] = [...(errors[field] ?? []), message]
  }

  const mitraId = toId(input.mitraId)

  // Mitra
  const mitra = await prisma.tbl_mitra.findUnique({
    where: { id_mitra: mitraId },
    select: { id_mitra: true },
  })
  if (!mitra) add("mitraId", "Mitra tidak ditemukan.")
  if (current && current.mitraId !== mitraId) {
    add("mitraId", "Mitra pada naskah tidak bisa diubah. Buat naskah baru untuk mitra lain.")
  }

  // Induk: milik mitra yang sama, jenisnya sesuai aturan, bukan dirinya sendiri.
  if (input.indukId) {
    const indukId = toId(input.indukId)
    if (current && indukId === current.id) {
      add("indukId", "Naskah tidak bisa menjadi induk bagi dirinya sendiri.")
    } else {
      const induk = await prisma.tbl_kerja_sama.findUnique({
        where: { id_kerja_sama: indukId },
        select: { mitra_id: true, jenis: true },
      })
      const allowed = INDUK_NASKAH[input.jenis].allowed
      if (!induk) {
        add("indukId", "Naskah induk tidak ditemukan.")
      } else if (induk.mitra_id !== mitraId) {
        add("indukId", "Naskah induk harus milik mitra yang sama.")
      } else if (!allowed.includes(induk.jenis)) {
        add("indukId", `Induk untuk ${input.jenis} harus berupa ${allowed.join(" atau ")}.`)
      }
    }
  }

  // Perpanjangan: naskah sebelumnya milik mitra yang sama.
  if (input.perpanjanganDariId) {
    const asalId = toId(input.perpanjanganDariId)
    if (current && asalId === current.id) {
      add("perpanjanganDariId", "Naskah tidak bisa memperpanjang dirinya sendiri.")
    } else {
      const asal = await prisma.tbl_kerja_sama.findUnique({
        where: { id_kerja_sama: asalId },
        select: { mitra_id: true },
      })
      if (!asal) add("perpanjanganDariId", "Naskah yang diperpanjang tidak ditemukan.")
      else if (asal.mitra_id !== mitraId) {
        add("perpanjanganDariId", "Naskah yang diperpanjang harus milik mitra yang sama.")
      }
    }
  }

  // Mengubah jenis naskah yang sudah punya turunan: turunannya harus tetap cocok.
  if (current) {
    const turunan = await prisma.tbl_kerja_sama.findMany({
      where: { induk_id: current.id },
      select: { jenis: true },
    })
    const tidakCocok = turunan.filter((t) => !INDUK_NASKAH[t.jenis].allowed.includes(input.jenis))
    if (tidakCocok.length > 0) {
      const jenisList = Array.from(new Set(tidakCocok.map((t) => t.jenis))).join(", ")
      add("jenis", `Naskah ini punya turunan (${jenisList}) yang tidak cocok dengan jenis baru.`)
    }
  }

  // Dosen penanggung jawab
  if (input.pjDosenId) {
    const dosen = await prisma.tbl_dosen.findUnique({
      where: { id_dosen: toId(input.pjDosenId) },
      select: { id_dosen: true },
    })
    if (!dosen) add("pjDosenId", "Dosen penanggung jawab tidak ditemukan.")
  }

  // Bentuk kerja sama: harus ada; yang nonaktif hanya boleh dipertahankan, bukan dipilih baru.
  if (input.bentukIds.length > 0) {
    const ids = input.bentukIds.map(toId)
    const found = await prisma.tbl_ref_bentuk.findMany({
      where: { id_bentuk: { in: ids } },
      select: { id_bentuk: true, nama: true, aktif: true },
    })
    if (found.length !== ids.length) {
      add("bentukIds", "Ada bentuk kerja sama yang tidak ditemukan.")
    } else {
      const nonaktifBaru = found.filter(
        (b) => !b.aktif && !current?.bentukIds.has(String(b.id_bentuk)),
      )
      if (nonaktifBaru.length > 0) {
        add("bentukIds", `Bentuk tidak aktif: ${nonaktifBaru.map((b) => b.nama).join(", ")}.`)
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new KerjaSamaRuleError("Periksa kembali isian yang ditandai.", errors)
  }

  // Nomor naskah prodi unik (kolom unik di database; dicek dulu supaya pesannya jelas).
  if (input.nomorProdi) {
    const bentrok = await prisma.tbl_kerja_sama.findFirst({
      where: {
        nomor_prodi: input.nomorProdi,
        ...(current ? { NOT: { id_kerja_sama: current.id } } : {}),
      },
      select: { id_kerja_sama: true },
    })
    if (bentrok) {
      throw new KerjaSamaConflictError({
        nomorProdi: ["Nomor naskah prodi sudah dipakai naskah lain."],
      })
    }
  }
}

// ============================================================
// QUERY
// ============================================================

export async function listNaskahAdmin(
  filter: { mitraId?: bigint } = {},
): Promise<NaskahAdmin[]> {
  const rows = await prisma.tbl_kerja_sama.findMany({
    where: filter.mitraId !== undefined ? { mitra_id: filter.mitraId } : undefined,
    include: NASKAH_INCLUDE,
    orderBy: [{ mulai: "desc" }, { id_kerja_sama: "desc" }],
  })
  const today = todayJakarta()
  return rows.map((row) => toNaskahAdmin(row, today))
}

export async function getNaskahByIdAdmin(id: bigint): Promise<NaskahAdmin | null> {
  const row = await prisma.tbl_kerja_sama.findUnique({
    where: { id_kerja_sama: id },
    include: NASKAH_INCLUDE,
  })
  return row ? toNaskahAdmin(row, todayJakarta()) : null
}

/** Ringan, untuk dropdown (pilih induk, pilih naskah saat input kegiatan). */
export async function listNaskahOpsi(filter: { mitraId?: bigint } = {}): Promise<NaskahOpsi[]> {
  const rows = await prisma.tbl_kerja_sama.findMany({
    where: filter.mitraId !== undefined ? { mitra_id: filter.mitraId } : undefined,
    select: {
      id_kerja_sama: true,
      mitra_id: true,
      jenis: true,
      judul: true,
      nomor_prodi: true,
      status: true,
      mulai: true,
      berakhir: true,
    },
    orderBy: [{ mulai: "desc" }, { id_kerja_sama: "desc" }],
  })
  const today = todayJakarta()

  return rows.map((row) => ({
    id: String(row.id_kerja_sama),
    mitraId: String(row.mitra_id),
    jenis: row.jenis,
    judul: row.judul,
    nomorProdi: row.nomor_prodi,
    masaBerlaku: hitungMasaBerlaku(
      {
        status: row.status,
        mulai: toIsoDate(row.mulai),
        berakhir: row.berakhir ? toIsoDate(row.berakhir) : null,
      },
      today,
    ).masa,
  }))
}

// ============================================================
// MUTASI
// ============================================================

export async function createNaskah(input: NaskahInput, actor: Actor): Promise<NaskahAdmin> {
  await assertNaskahValid(input)

  const row = await prisma.tbl_kerja_sama.create({
    data: {
      ...toRowData(input),
      bentuk: { connect: input.bentukIds.map((id) => ({ id_bentuk: toId(id) })) },
      ...stampCreatedBy(actor),
    },
    include: NASKAH_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "create",
    entity: ENTITY,
    entityId: row.id_kerja_sama,
    deskripsi: `${actor.nama} menambahkan naskah ${row.jenis} "${row.judul}" untuk mitra "${row.mitra.nama}".`,
    dataBaru: input,
  })

  return toNaskahAdmin(row, todayJakarta())
}

export async function updateNaskah(
  id: bigint,
  input: NaskahInput,
  actor: Actor,
): Promise<NaskahAdmin> {
  const before = await prisma.tbl_kerja_sama.findUniqueOrThrow({
    where: { id_kerja_sama: id },
    include: { bentuk: { select: { id_bentuk: true } } },
  })

  await assertNaskahValid(input, {
    id,
    mitraId: before.mitra_id,
    bentukIds: new Set(before.bentuk.map((b) => String(b.id_bentuk))),
  })

  const row = await prisma.tbl_kerja_sama.update({
    where: { id_kerja_sama: id },
    data: {
      ...toRowData(input),
      bentuk: { set: input.bentukIds.map((bentukId) => ({ id_bentuk: toId(bentukId) })) },
      ...stampUpdatedBy(actor),
    },
    include: NASKAH_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: row.id_kerja_sama,
    deskripsi: `${actor.nama} mengubah naskah ${row.jenis} "${row.judul}".`,
    dataLama: before,
    dataBaru: input,
  })

  if (before.preview && before.preview !== input.preview) {
    await hapusPreviewJikaMilik(before.preview)
  }

  return toNaskahAdmin(row, todayJakarta())
}

/**
 * Menghapus naskah ikut menghapus SEMUA kegiatan dan berkasnya (cascade), jadi UI
 * harus menampilkan `jumlahKegiatan` di dialog konfirmasi. Naskah yang masih
 * menjadi induk naskah lain diblokir supaya tidak ada IA/Addendum yatim.
 */
export async function deleteNaskah(id: bigint, actor: Actor): Promise<void> {
  const before = await prisma.tbl_kerja_sama.findUniqueOrThrow({
    where: { id_kerja_sama: id },
    include: {
      berkas: { select: { path: true } },
      kegiatan: { select: { berkas: { select: { path: true } } } },
      _count: { select: { turunan: true, kegiatan: true } },
    },
  })

  if (before._count.turunan > 0) {
    throw new KerjaSamaInUseError(
      `Naskah ini masih menjadi induk ${before._count.turunan} naskah lain. Hapus atau pindahkan naskah turunannya dulu.`,
    )
  }

  // Path file dikumpulkan SEBELUM baris dihapus -- setelahnya sudah tidak bisa dibaca.
  const paths = [
    ...before.berkas.map((b) => b.path),
    ...before.kegiatan.flatMap((k) => k.berkas.map((b) => b.path)),
  ]

  await prisma.tbl_kerja_sama.delete({ where: { id_kerja_sama: id } })

  await logEntityMutation({
    actor,
    action: "delete",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} menghapus naskah ${before.jenis} "${before.judul}" beserta ${before._count.kegiatan} kegiatan.`,
    dataLama: { ...before, berkas: undefined, kegiatan: undefined },
  })

  await deleteKerjaSamaFiles(paths)
  await hapusPreviewJikaMilik(before.preview)
}