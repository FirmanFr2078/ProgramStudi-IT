import type { MasaBerlaku, StatusMitra, StatusNaskah } from "@/types"

// Tanpa "server-only": dipakai bersama oleh server (database, landing) dan
// client (badge di dashboard), supaya aturan status hanya ada di satu tempat.

/** Naskah dianggap "segera berakhir" bila sisa harinya <= angka ini. */
export const SEGERA_BERAKHIR_HARI = 90

/** Tanggal hari ini di zona WIB sebagai "YYYY-MM-DD" (aman dibandingkan sebagai string). */
export function todayJakarta(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
}

/** Selisih hari kalender (ke - dari) antara dua "YYYY-MM-DD". */
export function selisihHari(dari: string, ke: string): number {
  const a = Date.parse(`${dari}T00:00:00.000Z`)
  const b = Date.parse(`${ke}T00:00:00.000Z`)
  return Math.round((b - a) / 86_400_000)
}

type NaskahWaktu = { status: StatusNaskah; mulai: string; berakhir: string | null }

/**
 * Masa berlaku dihitung dari TANGGAL, bukan disimpan. Hari `berakhir` sendiri
 * masih dihitung berlaku. `berakhir` kosong = tanpa batas waktu.
 */
export function hitungMasaBerlaku(
  naskah: NaskahWaktu,
  today: string = todayJakarta(),
): { masa: MasaBerlaku; sisaHari: number | null } {
  if (naskah.status === "Draft") return { masa: "Draft", sisaHari: null }
  if (naskah.status === "Dibatalkan") return { masa: "Dibatalkan", sisaHari: null }

  if (naskah.mulai > today) return { masa: "Belum Mulai", sisaHari: null }
  if (naskah.berakhir === null) return { masa: "Berlaku", sisaHari: null }

  const sisaHari = selisihHari(today, naskah.berakhir)
  if (sisaHari < 0) return { masa: "Berakhir", sisaHari }
  if (sisaHari <= SEGERA_BERAKHIR_HARI) return { masa: "Segera Berakhir", sisaHari }
  return { masa: "Berlaku", sisaHari }
}

/**
 * Status mitra diturunkan dari naskahnya. Draft dan Dibatalkan tidak ikut dihitung.
 * - Aktif        : ada naskah Berlaku / Segera Berakhir
 * - Berakhir     : tidak ada yang aktif, tapi pernah ada naskah yang berakhir
 * - Belum Aktif  : semua naskah belum mulai
 * - Tanpa Naskah : belum punya naskah yang dihitung
 */
export function hitungStatusMitra(
  daftar: NaskahWaktu[],
  today: string = todayJakarta(),
): StatusMitra {
  const masa = daftar
    .filter((n) => n.status === "Berlaku")
    .map((n) => hitungMasaBerlaku(n, today).masa)

  if (masa.length === 0) return "Tanpa Naskah"
  if (masa.some((m) => m === "Berlaku" || m === "Segera Berakhir")) return "Aktif"
  if (masa.some((m) => m === "Berakhir")) return "Berakhir"
  return "Belum Aktif"
}

/** Tahun akademik dari tanggal: Agustus-Desember tahun Y -> "Y/Y+1", Januari-Juli -> "Y-1/Y". */
export function tahunAkademik(isoDate: string): string {
  const tahun = Number(isoDate.slice(0, 4))
  const bulan = Number(isoDate.slice(5, 7))
  return bulan >= 8 ? `${tahun}/${tahun + 1}` : `${tahun - 1}/${tahun}`
}
