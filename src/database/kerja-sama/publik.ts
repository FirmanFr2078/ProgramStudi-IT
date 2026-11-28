import "server-only"

import type { Prisma } from "@generated/client"

import { todayJakarta } from "@/lib/kerja-sama-status"
import { prisma } from "@/lib/prisma"
import type { MitraPublik, StatistikKerjaSamaPublik } from "@/types"

import { BIDANG_TO_LABEL, TINGKAT_TO_LABEL } from "./enums"
import {
  hitungStatistikPublik,
  susunMitraPublik,
  urutkanMitraPublik,
  type MitraPublikSumber,
} from "./publik-builder"
import { resolveImage, toIsoDate } from "./shared"

// ============================================================
// QUERY LANDING
// Hanya mitra dengan tampil_publik = true. Query sudah membuang Draft/Dibatalkan
// dan kegiatan yang tidak ditandai publik; susunMitraPublik menerapkan sisa aturan
// (mitra tanpa naskah berlaku tidak tampil, kontak hanya bila dinyalakan, dst.).
// ============================================================

const PUBLIK_INCLUDE = {
  kategori: { select: { nama: true } },
  naskah: {
    where: { status: "Berlaku" },
    select: {
      id_kerja_sama: true,
      jenis: true,
      status: true,
      mulai: true,
      berakhir: true,
      preview: true,
      berkas: { where: { utama: true, path: { not: null } }, select: { id_berkas: true }, take: 1 },
      bentuk: { select: { nama: true }, orderBy: { nama: "asc" } },
      kegiatan: {
        where: { tampil_publik: true, status: { not: "Dibatalkan" } },
        select: {
          judul: true,
          uraian: true,
          bidang: true,
          tanggal_mulai: true,
          bentuk: { select: { nama: true } },
        },
      },
    },
  },
} satisfies Prisma.tbl_mitraInclude

type PublikRow = Prisma.tbl_mitraGetPayload<{ include: typeof PUBLIK_INCLUDE }>

function toSumber(row: PublikRow): MitraPublikSumber {
  return {
    slug: row.slug,
    nama: row.nama,
    namaSingkat: row.nama_singkat,
    kategori: row.kategori.nama,
    tingkat: TINGKAT_TO_LABEL[row.tingkat],
    negara: row.negara,
    kota: row.kota,
    website: row.website,
    logo: resolveImage(row.logo),
    ringkasan: row.ringkasan,
    deskripsi: row.deskripsi,
    unggulan: row.unggulan,
    tampilDiMbkm: row.tampil_di_mbkm,
    urutan: row.urutan,
    kontakPublik: row.kontak_publik,
    kontak: {
      nama: row.kontak_nama,
      jabatan: row.kontak_jabatan,
      email: row.kontak_email,
      telepon: row.kontak_telepon,
    },
    naskah: row.naskah.map((n) => ({
      id: String(n.id_kerja_sama),
      jenis: n.jenis,
      preview: resolveImage(n.preview),
      bisaDiunduh: n.berkas.length > 0,
      status: n.status,
      mulai: toIsoDate(n.mulai),
      berakhir: n.berakhir ? toIsoDate(n.berakhir) : null,
      bentuk: n.bentuk.map((b) => b.nama),
    })),
    kegiatan: row.naskah.flatMap((n) =>
      n.kegiatan.map((k) => ({
        judul: k.judul,
        uraian: k.uraian,
        bidang: BIDANG_TO_LABEL[k.bidang],
        bentuk: k.bentuk?.nama ?? null,
        tanggalMulai: toIsoDate(k.tanggal_mulai),
      })),
    ),
  }
}

/** Daftar mitra untuk halaman /profil/kerja-sama. Pengganti getKerjaSama() di landing. */
export async function getKerjaSamaPublik(): Promise<MitraPublik[]> {
  const rows = await prisma.tbl_mitra.findMany({
    where: { tampil_publik: true },
    include: PUBLIK_INCLUDE,
  })

  const today = todayJakarta()
  const hasil = rows.flatMap((row) => {
    const mitra = susunMitraPublik(toSumber(row), today)
    return mitra ? [{ mitra, urutan: row.urutan }] : []
  })

  return urutkanMitraPublik(hasil)
}

export async function getMitraPublikBySlug(slug: string): Promise<MitraPublik | null> {
  const row = await prisma.tbl_mitra.findFirst({
    where: { slug, tampil_publik: true },
    include: PUBLIK_INCLUDE,
  })
  return row ? susunMitraPublik(toSumber(row)) : null
}

/** Mitra yang ditandai untuk halaman MBKM dan masih aktif. */
export async function getMitraMbkmPublik(limit = 12): Promise<MitraPublik[]> {
  const semua = await getKerjaSamaPublik()
  return semua.filter((m) => m.tampilDiMbkm && m.status === "Aktif").slice(0, limit)
}

export async function getStatistikKerjaSamaPublik(): Promise<StatistikKerjaSamaPublik> {
  return hitungStatistikPublik(await getKerjaSamaPublik())
}