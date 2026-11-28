import "server-only"

import { createHmac, randomInt } from "node:crypto"

import { Prisma, type tbl_kerja_sama_kode_unduh } from "@generated/client"

import { logEntityMutation, type Actor } from "@/lib/authorship"
import { KODE_ALFABET, KODE_PANJANG, formatKode, hitungStatusKode, kodeMasihBerlaku, MASA_UNDUH_MS, normalisasiKode } from "@/lib/kerja-sama-kode"
import { createBerkasSignedUrl } from "@/lib/kerja-sama-storage"
import { prisma } from "@/lib/prisma"
import type { KodeUnduhAdmin, KodeUnduhBaru, KodeUnduhInput } from "@/types"

import { KerjaSamaRuleError, toId } from "./shared"

const ENTITY = "tbl_kerja_sama_kode_unduh"

/** Unduhan sah mengembalikan signed URL yang hanya hidup sebentar: cukup untuk memulai download. */
const SIGNED_URL_UNDUHAN_DETIK = 60

/** Pembatasan tebak-tebakan kode: gagal sebanyak ini dalam jendela ini -> diblokir sementara. */
export const BATAS_GAGAL = 5
export const JENDELA_GAGAL_MENIT = 15

// ============================================================
// HASH
// Kode utuh TIDAK pernah disimpan. Yang tersimpan hanya HMAC-SHA256-nya, dengan
// id naskah ikut di-hash: kode naskah A tidak bisa dipakai untuk naskah B, dan
// pencurian isi tabel tidak membuka kodenya (tanpa pepper di env).
// ============================================================

function pepper(): string {
  const value = process.env.KODE_UNDUH_PEPPER
  if (!value || value.length < 32) {
    throw new Error("KODE_UNDUH_PEPPER belum diatur (minimal 32 karakter acak).")
  }
  return value
}

function hashKode(naskahId: bigint, kodeBaku: string): string {
  return createHmac("sha256", pepper()).update(`kode:${naskahId}:${kodeBaku}`).digest("hex")
}

/** Alamat IP tidak disimpan mentah; cukup untuk menghitung percobaan gagal. */
export function hashIp(ip: string): string {
  return createHmac("sha256", pepper()).update(`ip:${ip}`).digest("hex").slice(0, 32)
}

function bangkitkanKode(): string {
  let mentah = ""
  for (let i = 0; i < KODE_PANJANG; i++) {
    mentah += KODE_ALFABET[randomInt(KODE_ALFABET.length)]
  }
  return formatKode(mentah)
}

// ============================================================
// MAPPING
// ============================================================

const KODE_INCLUDE = {
  dibuat_oleh: { select: { id_profile: true, nama: true } },
} satisfies Prisma.tbl_kerja_sama_kode_unduhInclude

type KodeRow = Prisma.tbl_kerja_sama_kode_unduhGetPayload<{ include: typeof KODE_INCLUDE }>

function toKodeAdmin(row: KodeRow, sekarang: Date): KodeUnduhAdmin {
  const { status, sisaDetik } = hitungStatusKode(
    { dipakaiPertamaPada: row.dipakai_pertama_pada, dicabutPada: row.dicabut_pada },
    sekarang,
  )

  return {
    id: String(row.id_kode),
    kerjaSamaId: String(row.kerja_sama_id),
    petunjuk: row.petunjuk,
    peminta: row.peminta,
    catatan: row.catatan,
    status,
    sisaDetik,
    jumlahUnduhan: row.jumlah_unduhan,
    createdAt: row.created_at.toISOString(),
    dipakaiPertamaPada: row.dipakai_pertama_pada?.toISOString() ?? null,
    terakhirDiunduhPada: row.terakhir_diunduh_pada?.toISOString() ?? null,
    dicabutPada: row.dicabut_pada?.toISOString() ?? null,
    dibuatOleh: row.dibuat_oleh
      ? { id: row.dibuat_oleh.id_profile, nama: row.dibuat_oleh.nama }
      : null,
  }
}

// ============================================================
// ADMIN: BUAT, LIHAT, CABUT
// ============================================================

/**
 * Satu naskah boleh punya banyak kode sekaligus (satu per peminta). Kode utuh hanya
 * ada di nilai kembalian ini -- tampilkan sekali di dashboard lalu hilang. Jangan
 * pernah dimasukkan ke log aktivitas.
 */
export async function buatKodeUnduh(
  input: KodeUnduhInput,
  actor: Actor,
): Promise<KodeUnduhBaru> {
  const naskahId = toId(input.kerjaSamaId)

  const naskah = await prisma.tbl_kerja_sama.findUnique({
    where: { id_kerja_sama: naskahId },
    select: {
      judul: true,
      status: true,
      berkas: { where: { utama: true, path: { not: null } }, select: { id_berkas: true } },
    },
  })
  if (!naskah) {
    throw new KerjaSamaRuleError("Naskah tidak ditemukan.", { kerjaSamaId: ["Naskah tidak ditemukan."] })
  }
  if (naskah.status === "Dibatalkan") {
    throw new KerjaSamaRuleError("Naskah yang dibatalkan tidak bisa dibuatkan kode unduh.")
  }
  if (naskah.berkas.length === 0) {
    throw new KerjaSamaRuleError(
      "Naskah ini belum punya berkas utama. Unggah file naskah dan tandai sebagai berkas utama dulu.",
    )
  }

  // Tabrakan hash hampir mustahil (1 : 1 triliun per naskah), tapi ulangi beberapa kali
  // daripada gagal -- P2002 di sini hanya bisa berarti kode kembar.
  for (let percobaan = 0; percobaan < 5; percobaan++) {
    const kode = bangkitkanKode()
    try {
      const row = await prisma.tbl_kerja_sama_kode_unduh.create({
        data: {
          kerja_sama_id: naskahId,
          kode_hash: hashKode(naskahId, kode),
          petunjuk: kode.slice(-4),
          peminta: input.peminta,
          catatan: input.catatan,
          dibuat_oleh_id: actor.id,
        },
        include: KODE_INCLUDE,
      })

      await logEntityMutation({
        actor,
        action: "create",
        entity: ENTITY,
        entityId: row.id_kode,
        deskripsi: `${actor.nama} membuat kode unduh naskah "${naskah.judul}" untuk ${input.peminta}.`,
        dataBaru: { kerjaSamaId: input.kerjaSamaId, peminta: input.peminta, petunjuk: row.petunjuk },
      })

      return { ...toKodeAdmin(row, new Date()), kode }
    } catch (error) {
      const kembar = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
      if (!kembar) throw error
    }
  }

  throw new Error("Gagal membuat kode unik setelah beberapa percobaan.")
}

export async function listKodeUnduh(naskahId: bigint): Promise<KodeUnduhAdmin[]> {
  const rows = await prisma.tbl_kerja_sama_kode_unduh.findMany({
    where: { kerja_sama_id: naskahId },
    include: KODE_INCLUDE,
    orderBy: { created_at: "desc" },
  })
  const sekarang = new Date()
  return rows.map((row) => toKodeAdmin(row, sekarang))
}

/** Hanya kode yang masih bisa dipakai yang perlu dicabut; sisanya sudah mati sendiri. */
export async function cabutKodeUnduh(id: bigint, actor: Actor): Promise<KodeUnduhAdmin> {
  const before = await prisma.tbl_kerja_sama_kode_unduh.findUniqueOrThrow({
    where: { id_kode: id },
    include: KODE_INCLUDE,
  })

  const { status } = hitungStatusKode({
    dipakaiPertamaPada: before.dipakai_pertama_pada,
    dicabutPada: before.dicabut_pada,
  })
  if (!kodeMasihBerlaku(status)) {
    throw new KerjaSamaRuleError(`Kode ini sudah ${status.toLowerCase()}, tidak perlu dicabut.`)
  }

  const row = await prisma.tbl_kerja_sama_kode_unduh.update({
    where: { id_kode: id },
    data: { dicabut_pada: new Date(), dicabut_oleh_id: actor.id },
    include: KODE_INCLUDE,
  })

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: id,
    deskripsi: `${actor.nama} mencabut kode unduh milik ${before.peminta} (…${before.petunjuk}).`,
    dataLama: { status },
    dataBaru: { status: "Dicabut" },
  })

  return toKodeAdmin(row, new Date())
}

// ============================================================
// PUBLIK: VERIFIKASI KODE DAN KELUARKAN URL UNDUHAN
//
// Aturan (sesuai permintaan prodi):
//  - Kode tidak punya batas waktu selama belum dipakai.
//  - Saat PERTAMA dipakai, masa unduh 10 menit dimulai. Di dalam masa itu kode boleh
//    dipakai lagi (mis. unduhan terputus), setelahnya hangus.
//  - Kode dicabut admin = langsung mati.
// Dua langkah updateMany di bawah bersifat atomik di database, jadi dua permintaan
// bersamaan tidak bisa sama-sama "menjadi yang pertama".
// ============================================================

export type HasilUnduh =
  | { ok: true; url: string }
  | { ok: false; alasan: "terlalu_banyak_percobaan" | "tidak_valid" | "berkas_tidak_tersedia" }

async function klaimKode(row: tbl_kerja_sama_kode_unduh, sekarang: Date): Promise<boolean> {
  // 1) Pemakaian pertama: hanya satu permintaan yang bisa mengubah dipakai_pertama_pada dari null.
  const pertama = await prisma.tbl_kerja_sama_kode_unduh.updateMany({
    where: { id_kode: row.id_kode, dipakai_pertama_pada: null, dicabut_pada: null },
    data: {
      dipakai_pertama_pada: sekarang,
      terakhir_diunduh_pada: sekarang,
      jumlah_unduhan: { increment: 1 },
    },
  })
  if (pertama.count === 1) return true

  // 2) Sudah pernah dipakai: masih boleh selama dalam masa unduh dan belum dicabut.
  const batas = new Date(sekarang.getTime() - MASA_UNDUH_MS)
  const lanjutan = await prisma.tbl_kerja_sama_kode_unduh.updateMany({
    where: { id_kode: row.id_kode, dicabut_pada: null, dipakai_pertama_pada: { gt: batas } },
    data: { terakhir_diunduh_pada: sekarang, jumlah_unduhan: { increment: 1 } },
  })
  return lanjutan.count === 1
}

async function catatGagal(ipHash: string, sekarang: Date) {
  await prisma.tbl_kerja_sama_kode_gagal.create({ data: { ip_hash: ipHash } })
  // Bersih-bersih ringan: catatan lebih dari sehari tidak berguna lagi.
  await prisma.tbl_kerja_sama_kode_gagal.deleteMany({
    where: { created_at: { lt: new Date(sekarang.getTime() - 24 * 3_600_000) } },
  })
}

function namaUnduhan(namaMitra: string, jenis: string, path: string) {
  const slug = namaMitra.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  const ekstensi = path.split(".").pop() ?? "pdf"
  return `${slug || "naskah"}-${jenis}.${ekstensi}`
}

/**
 * Pesan ke pengunjung SENGAJA sama untuk kode salah, hangus, atau dicabut: tidak ada
 * petunjuk bagi orang yang menebak. Pembatas tebakan dihitung per alamat IP (di-hash).
 */
export async function verifikasiKodeUnduh(input: {
  naskahId: string
  kode: string
  ip: string
}): Promise<HasilUnduh> {
  const sekarang = new Date()
  const ipHash = hashIp(input.ip)

  const gagalBaruBaru = await prisma.tbl_kerja_sama_kode_gagal.count({
    where: {
      ip_hash: ipHash,
      created_at: { gte: new Date(sekarang.getTime() - JENDELA_GAGAL_MENIT * 60_000) },
    },
  })
  if (gagalBaruBaru >= BATAS_GAGAL) return { ok: false, alasan: "terlalu_banyak_percobaan" }

  const kodeBaku = normalisasiKode(input.kode)
  let naskahId: bigint
  try {
    naskahId = toId(input.naskahId)
  } catch {
    await catatGagal(ipHash, sekarang)
    return { ok: false, alasan: "tidak_valid" }
  }
  if (!kodeBaku) {
    await catatGagal(ipHash, sekarang)
    return { ok: false, alasan: "tidak_valid" }
  }

  const row = await prisma.tbl_kerja_sama_kode_unduh.findUnique({
    where: { kode_hash: hashKode(naskahId, kodeBaku) },
  })
  if (!row) {
    await catatGagal(ipHash, sekarang)
    return { ok: false, alasan: "tidak_valid" }
  }

  // Cek berkas SEBELUM mengklaim kode, supaya kode tidak terpakai sia-sia
  // kalau ternyata file-nya sudah dihapus admin.
  const naskah = await prisma.tbl_kerja_sama.findUnique({
    where: { id_kerja_sama: naskahId },
    select: {
      jenis: true,
      mitra: { select: { nama: true } },
      berkas: { where: { utama: true, path: { not: null } }, select: { path: true }, take: 1 },
    },
  })
  const path = naskah?.berkas[0]?.path
  if (!naskah || !path) return { ok: false, alasan: "berkas_tidak_tersedia" }

  if (!(await klaimKode(row, sekarang))) {
    await catatGagal(ipHash, sekarang)
    return { ok: false, alasan: "tidak_valid" }
  }

  const url = await createBerkasSignedUrl(path, {
    downloadName: namaUnduhan(naskah.mitra.nama, naskah.jenis, path),
    ttlDetik: SIGNED_URL_UNDUHAN_DETIK,
  })
  // Kode sudah terpakai tapi masih dalam masa unduh: pengunjung boleh mencoba lagi.
  if (!url) return { ok: false, alasan: "berkas_tidak_tersedia" }

  return { ok: true, url }
}