import { KODE_MASA_UNDUH_MENIT, type StatusKode } from "@/types"

// Tanpa "server-only" dan tanpa crypto: dipakai server (verifikasi) dan client
// (badge status + hitung mundur di dashboard, normalisasi input di dialog landing).
// Pembuatan dan hashing kode ada di database/kerja-sama/kode-unduh.ts.

/**
 * 32 simbol: huruf tanpa I dan O, angka tanpa 0 dan 1 (menghindari salah baca
 * saat kode diketik dari chat). 8 karakter = 32^8 (~1,1 triliun) kemungkinan.
 */
export const KODE_ALFABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
export const KODE_PANJANG = 8

/** "ABCD1234" -> "KS-ABCD-1234" */
export function formatKode(mentah: string): string {
  return `KS-${mentah.slice(0, 4)}-${mentah.slice(4, 8)}`
}

/**
 * Menerima kode seperti yang diketik orang: huruf kecil, spasi, tanpa "KS-", tanpa
 * tanda hubung. Mengembalikan bentuk baku "KS-XXXX-XXXX", atau null kalau bukan kode
 * yang mungkin valid. Bentuk baku inilah yang di-hash.
 */
export function normalisasiKode(input: string): string | null {
  let bersih = input.toUpperCase().replace(/[^A-Z0-9]/g, "")
  if (bersih.length === KODE_PANJANG + 2 && bersih.startsWith("KS")) bersih = bersih.slice(2)
  if (bersih.length !== KODE_PANJANG) return null
  for (const huruf of bersih) {
    if (!KODE_ALFABET.includes(huruf)) return null
  }
  return formatKode(bersih)
}

type KodeWaktu = {
  dipakaiPertamaPada: Date | null
  dicabutPada: Date | null
}

export const MASA_UNDUH_MS = KODE_MASA_UNDUH_MENIT * 60_000

/**
 * Status dihitung dari tanggal, bukan disimpan. Kode tidak punya kedaluwarsa
 * sebelum dipakai; masa 10 menit baru mulai saat PERTAMA KALI dipakai.
 */
export function hitungStatusKode(
  kode: KodeWaktu,
  sekarang: Date = new Date(),
): { status: StatusKode; sisaDetik: number | null } {
  if (kode.dicabutPada) return { status: "Dicabut", sisaDetik: null }
  if (!kode.dipakaiPertamaPada) return { status: "Aktif", sisaDetik: null }

  const sisaMs = kode.dipakaiPertamaPada.getTime() + MASA_UNDUH_MS - sekarang.getTime()
  if (sisaMs <= 0) return { status: "Habis", sisaDetik: null }
  return { status: "Dalam Masa Unduh", sisaDetik: Math.ceil(sisaMs / 1000) }
}

/** Kode masih bisa dipakai untuk mengunduh. */
export function kodeMasihBerlaku(status: StatusKode): boolean {
  return status === "Aktif" || status === "Dalam Masa Unduh"
}