import { z } from "zod";

// ============================================================
// HELPER SKEMA ZOD YANG DIPAKAI LEBIH DARI SATU MODUL
// Sengaja TIDAK di-export dari "@/types" (index) supaya nama generik di sini
// tidak bentrok dengan modul lain. Impor langsung dari "@/types/shared-schema".
// ============================================================

export function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** "YYYY-MM-DD" yang benar-benar ada di kalender (menolak 2026-02-31). */
export function isRealIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function dedupeCaseInsensitive(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Teks opsional: "" / null / undefined semuanya jadi null. */
export const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} maksimal ${max} karakter`)
    .nullable()
    .optional()
    .transform((value) => (value ? value : null));

/** Tautan yang dipakai sebagai href di halaman publik: wajib https. */
export const optionalHttpsUrl = (label: string) =>
  optionalText(255, label).refine(
    (value) => value === null || isHttpsUrl(value),
    `${label} harus berupa tautan yang diawali https://`,
  );

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug wajib diisi")
  .max(150, "Slug maksimal 150 karakter")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)",
  );

/** Id BigInt dikirim sebagai string angka lewat JSON (BigInt tidak bisa di-JSON). */
export const idSchema = (label: string) =>
  z.string().trim().regex(/^\d+$/, `${label} tidak valid`);

export const optionalIdSchema = (label: string) =>
  z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => (value ? value : null))
    .refine(
      (value) => value === null || /^\d+$/.test(value),
      `${label} tidak valid`,
    );

export const isoDateSchema = (label: string) =>
  z
    .string()
    .trim()
    .refine(isRealIsoDate, `${label} harus berupa tanggal yang valid`);

export const optionalIsoDateSchema = (label: string) =>
  z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => (value ? value : null))
    .refine(
      (value) => value === null || isRealIsoDate(value),
      `${label} harus berupa tanggal yang valid`,
    );

/** Daftar tag pendek: dipangkas, dibuang duplikatnya (tanpa peduli huruf besar/kecil). */
export const textListSchema = (
  label: string,
  {
    min = 0,
    maxItems,
    maxLength,
  }: { min?: number; maxItems: number; maxLength: number },
) =>
  z
    .array(
      z
        .string()
        .trim()
        .min(1, `${label} tidak boleh kosong`)
        .max(maxLength, `${label} maksimal ${maxLength} karakter`),
    )
    .min(min, min > 0 ? `Isi minimal ${min} ${label.toLowerCase()}` : "")
    .max(maxItems, `${label} maksimal ${maxItems} item`)
    .transform(dedupeCaseInsensitive);

/** Daftar paragraf: baris kosong dibuang diam-diam (form boleh punya kotak kosong). */
export const paragraphListSchema = (
  label: string,
  maxItems: number,
  maxLength: number,
) =>
  z
    .array(z.string())
    .transform((items) => items.map((item) => item.trim()).filter(Boolean))
    .pipe(
      z
        .array(
          z
            .string()
            .max(
              maxLength,
              `Tiap paragraf ${label.toLowerCase()} maksimal ${maxLength} karakter`,
            ),
        )
        .max(maxItems, `${label} maksimal ${maxItems} paragraf`),
    );
