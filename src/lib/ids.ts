/** Dilempar kalau id dari URL/body bukan angka valid. */
export class InvalidIdError extends Error {}

/** Ubah id dari URL (string) jadi BigInt -- dipakai semua tabel yang PK-nya BigInt autoincrement. */
export function parseBigIntId(id: string): bigint {
  if (!/^\d+$/.test(id)) {
    throw new InvalidIdError(`Id "${id}" tidak valid.`)
  }
  try {
    return BigInt(id)
  } catch {
    throw new InvalidIdError(`Id "${id}" tidak valid.`)
  }
}