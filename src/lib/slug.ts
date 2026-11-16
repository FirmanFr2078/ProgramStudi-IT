/** Ubah teks bebas jadi slug URL: huruf kecil, angka, dan tanda hubung. */
export function slugify(value: string, maxLength = 150) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
}

// Gelar di depan nama: "Prof. Dr. Ir. H. Ahmad" -> "Ahmad"
const GELAR_DEPAN = /^(?:(?:prof|dr|drs|dra|ir|h|hj)\.?\s+)+/i

/**
 * Slug dari nama dosen/tendik. Gelar depan dan semua gelar belakang
 * (setelah koma pertama) dibuang, supaya
 * "Dr. Bambang Setiawan, M.Kom." -> "bambang-setiawan",
 * bukan "dr-bambang-setiawan-m-kom".
 */
export function slugFromNama(nama: string) {
  const tanpaGelarBelakang = nama.split(",")[0] ?? ""
  return slugify(tanpaGelarBelakang.replace(GELAR_DEPAN, ""))
}