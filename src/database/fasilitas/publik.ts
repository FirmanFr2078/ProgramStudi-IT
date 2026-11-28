import "server-only"

import type { Prisma } from "@generated/client"

import { prisma } from "@/lib/prisma"
import type { FasilitasPublik, KategoriFasilitasRef } from "@/types"

import { STATUS_TO_LABEL } from "./enums"
import { listKategoriFasilitas } from "./referensi"
import { resolveImage, toNumberOrNull } from "./shared"

const PUBLIK_INCLUDE = {
  kategori: { select: { nama: true, slug: true } },
  gedung: { select: { nama: true } },
  alat: {
    where: { tampil_publik: true },
    select: { nama: true, jumlah_unit: true },
    orderBy: { nama: "asc" },
  },
  berkas: {
    where: { jenis: "Foto" },
    select: { path: true },
    orderBy: [{ urutan: "asc" }, { created_at: "asc" }],
  },
} satisfies Prisma.tbl_fasilitasInclude

type PublikRow = Prisma.tbl_fasilitasGetPayload<{ include: typeof PUBLIK_INCLUDE }>

function toFasilitasPublik(row: PublikRow): FasilitasPublik {
  const alatRingkas = row.alat.slice(0, 3).map((a) => (a.jumlah_unit > 1 ? `${a.nama} (${a.jumlah_unit})` : a.nama))

  return {
    slug: row.slug,
    nama: row.nama,
    kategori: row.kategori.nama,
    kategoriSlug: row.kategori.slug,
    gedung: row.gedung?.nama ?? null,
    lantai: row.lantai,
    deskripsi: row.deskripsi,
    foto: resolveImage(row.foto),
    luasM2: toNumberOrNull(row.luas_m2),
    kapasitas: row.kapasitas,
    status: STATUS_TO_LABEL[row.status],
    aksesibelDifabel: row.aksesibel_difabel,
    alatRingkas,
    jumlahAlatLainnya: Math.max(0, row.alat.length - alatRingkas.length),
    galeri: row.berkas.map((b) => resolveImage(b.path) ?? b.path),
  }
}

/** Dipakai landing untuk susun menu dropdown "Fasilitas". */
export async function getKategoriFasilitasPublik(): Promise<KategoriFasilitasRef[]> {
  return listKategoriFasilitas({ hanyaAktif: true })
}

/** Daftar fasilitas untuk satu halaman kategori, mis. /fasilitas/laboratorium. */
export async function getFasilitasPublikByKategori(kategoriSlug: string): Promise<FasilitasPublik[]> {
  const rows = await prisma.tbl_fasilitas.findMany({
    where: {
      tampil_publik: true,
      status: { not: "TidakDigunakan" },
      kategori: { slug: kategoriSlug },
    },
    include: PUBLIK_INCLUDE,
    orderBy: [{ unggulan: "desc" }, { urutan: "asc" }, { nama: "asc" }],
  })
  return rows.map(toFasilitasPublik)
}

export async function getFasilitasPublikBySlug(slug: string): Promise<FasilitasPublik | null> {
  const row = await prisma.tbl_fasilitas.findFirst({
    where: { slug, tampil_publik: true, status: { not: "TidakDigunakan" } },
    include: PUBLIK_INCLUDE,
  })
  return row ? toFasilitasPublik(row) : null
}