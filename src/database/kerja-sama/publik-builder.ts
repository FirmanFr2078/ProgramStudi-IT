import { hitungMasaBerlaku, hitungStatusMitra, todayJakarta } from "@/lib/kerja-sama-status"
import type {
  BidangKerjaSama,
  JenisNaskah,
  KegiatanPublik,
  MasaBerlaku,
  MitraPublik,
  NaskahPublik,
  StatistikKerjaSamaPublik,
  StatusNaskah,
  TingkatKerjaSama,
} from "@/types"

// Fungsi murni (tanpa prisma / server-only): aturan "apa yang tampil di landing"
// ada di sini supaya bisa diuji tanpa database.

export type MitraPublikSumber = {
  slug: string
  nama: string
  namaSingkat: string | null
  kategori: string
  tingkat: TingkatKerjaSama
  negara: string
  kota: string | null
  website: string | null
  logo: string | null // sudah berupa URL siap pakai
  ringkasan: string
  deskripsi: string[]
  unggulan: boolean
  tampilDiMbkm: boolean
  urutan: number
  kontakPublik: boolean
  kontak: { nama: string | null; jabatan: string | null; email: string | null; telepon: string | null }
  naskah: Array<{
    id: string
    jenis: JenisNaskah
    preview: string | null // URL publik gambar pratinjau
    bisaDiunduh: boolean
    status: StatusNaskah
    mulai: string
    berakhir: string | null
    bentuk: string[]
  }>
  kegiatan: Array<{
    judul: string
    uraian: string | null
    bidang: BidangKerjaSama
    bentuk: string | null
    tanggalMulai: string
  }>
}

const TAMPIL_DI_PUBLIK: MasaBerlaku[] = ["Berlaku", "Segera Berakhir", "Berakhir"]

/**
 * Mengubah satu mitra menjadi bentuk publik. Mengembalikan null bila mitra belum
 * layak tampil: tidak punya naskah berstatus Berlaku, atau semuanya belum mulai.
 * Naskah Draft/Dibatalkan, nomor surat, catatan internal, dan berkas tidak pernah ikut.
 */
export function susunMitraPublik(
  sumber: MitraPublikSumber,
  today: string = todayJakarta(),
): MitraPublik | null {
  const status = hitungStatusMitra(sumber.naskah, today)
  if (status !== "Aktif" && status !== "Berakhir") return null

  const dihitung = sumber.naskah
    .filter((n) => n.status === "Berlaku")
    .map((n) => ({ ...n, masa: hitungMasaBerlaku(n, today).masa }))
    .filter((n) => TAMPIL_DI_PUBLIK.includes(n.masa))
    .sort((a, b) => (a.mulai < b.mulai ? 1 : a.mulai > b.mulai ? -1 : 0))

  const aktif = dihitung.filter((n) => n.masa === "Berlaku" || n.masa === "Segera Berakhir")
  const segeraBerakhir = aktif.length > 0 && aktif.every((n) => n.masa === "Segera Berakhir")

  const mulai = dihitung.reduce((min, n) => (n.mulai < min ? n.mulai : min), dihitung[0].mulai)
  const berakhir = dihitung.some((n) => n.berakhir === null)
    ? null
    : dihitung.reduce((max, n) => (n.berakhir! > max ? n.berakhir! : max), dihitung[0].berakhir!)

  const lingkup: string[] = []
  for (const naskah of dihitung) {
    for (const nama of naskah.bentuk) {
      if (!lingkup.some((x) => x.toLowerCase() === nama.toLowerCase())) lingkup.push(nama)
    }
  }

  // Banner kartu: naskah AKTIF terbaru yang punya pratinjau; kalau tidak ada yang aktif,
  // riwayat terbaru yang punya pratinjau. `dihitung` sudah urut dari yang terbaru.
  const pratinjau =
    aktif.find((n) => n.preview)?.preview ?? dihitung.find((n) => n.preview)?.preview ?? null

  const naskahPublik: NaskahPublik[] = dihitung.map((n) => ({
    id: n.id,
    jenis: n.jenis,
    bisaDiunduh: n.bisaDiunduh,
    mulai: n.mulai,
    berakhir: n.berakhir,
    masa: n.masa,
  }))

  const kegiatan: KegiatanPublik[] = [...sumber.kegiatan]
    .sort((a, b) => (a.tanggalMulai < b.tanggalMulai ? 1 : a.tanggalMulai > b.tanggalMulai ? -1 : 0))
    .map((k) => ({
      judul: k.judul,
      uraian: k.uraian,
      bidang: k.bidang,
      bentuk: k.bentuk,
      tahun: Number(k.tanggalMulai.slice(0, 4)),
    }))

  return {
    slug: sumber.slug,
    nama: sumber.nama,
    namaSingkat: sumber.namaSingkat,
    kategori: sumber.kategori,
    tingkat: sumber.tingkat,
    negara: sumber.negara,
    kota: sumber.kota,
    website: sumber.website,
    logo: sumber.logo,
    pratinjau,
    ringkasan: sumber.ringkasan,
    deskripsi: sumber.deskripsi,
    lingkup,
    status,
    segeraBerakhir,
    mulai,
    berakhir,
    unggulan: sumber.unggulan,
    tampilDiMbkm: sumber.tampilDiMbkm,
    kontak: sumber.kontakPublik ? sumber.kontak : null,
    naskah: naskahPublik,
    kegiatan,
  }
}

/** Urutan landing: aktif dulu, lalu unggulan, lalu `urutan` manual, lalu nama. */
export function urutkanMitraPublik(
  daftar: Array<{ mitra: MitraPublik; urutan: number }>,
): MitraPublik[] {
  return [...daftar]
    .sort((a, b) => {
      const aktif = Number(b.mitra.status === "Aktif") - Number(a.mitra.status === "Aktif")
      if (aktif !== 0) return aktif
      const unggulan = Number(b.mitra.unggulan) - Number(a.mitra.unggulan)
      if (unggulan !== 0) return unggulan
      if (a.urutan !== b.urutan) return a.urutan - b.urutan
      return a.mitra.nama.localeCompare(b.mitra.nama, "id")
    })
    .map((x) => x.mitra)
}

export function hitungStatistikPublik(
  daftar: MitraPublik[],
  today: string = todayJakarta(),
): StatistikKerjaSamaPublik {
  const tahunIni = Number(today.slice(0, 4))
  const negara = new Set(daftar.map((m) => m.negara.trim().toLowerCase()))

  return {
    mitraAktif: daftar.filter((m) => m.status === "Aktif").length,
    totalMitra: daftar.length,
    jumlahNegara: negara.size,
    kegiatanTahunIni: daftar.reduce(
      (total, m) => total + m.kegiatan.filter((k) => k.tahun === tahunIni).length,
      0,
    ),
  }
}