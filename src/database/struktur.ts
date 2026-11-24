import "server-only"

import type { Prisma } from "@generated/client"

import { KETUA_PROGRAM_STUDI } from "@/config/structural-roles"
import { logEntityMutation, type Actor } from "@/lib/authorship"
import { parseBigIntId } from "@/lib/ids"
import { prisma } from "@/lib/prisma"
import { getPublicUrl } from "@/lib/storage"
import { normalizeStruktur, validateStruktur } from "@/lib/struktur-tree"
import type { KaprodiInvalid, StrukturPosisiAdmin, StrukturSaveInput } from "@/types"

const ENTITY = "tbl_struktur_posisi"
const REAL_ID = /^\d+$/

export class StrukturError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StrukturError"
  }
}

const POSISI_ADMIN_INCLUDE = {
  dosen: { select: { id_dosen: true, nama: true, nidn: true, foto: true } },
  tupoksi: { orderBy: { urutan: "asc" } },
} satisfies Prisma.tbl_struktur_posisiInclude

type PosisiRow = Prisma.tbl_struktur_posisiGetPayload<{ include: typeof POSISI_ADMIN_INCLUDE }>

type DosenCard = { id_dosen: bigint; nama: string; nidn: string; foto: string | null }

function resolveFoto(value: string | null): string | null {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return getPublicUrl("images", value) ?? value
}

/**
 * Kartu Kaprodi TIDAK menyimpan dosen sendiri: datanya selalu diambil langsung
 * dari modul Dosen (jabatan_struktural = "Ketua Program Studi"). Kalau tidak
 * ada atau lebih dari satu dosen yang ditandai, kartu menampilkan status
 * "invalid" supaya admin memperbaikinya di menu Dosen.
 */
function toStrukturPosisiAdmin(row: PosisiRow, kaprodiDosen: DosenCard[]): StrukturPosisiAdmin {
  const isKaprodi = row.is_kaprodi
  const kaprodiInvalid: KaprodiInvalid = !isKaprodi
    ? null
    : kaprodiDosen.length === 0
      ? "kosong"
      : kaprodiDosen.length > 1
        ? "ganda"
        : null

  const dosen: DosenCard | null = isKaprodi ? (kaprodiDosen.length === 1 ? kaprodiDosen[0] : null) : row.dosen

  return {
    id: String(row.id_posisi),
    parentId: row.parent_id !== null ? String(row.parent_id) : null,
    jabatan: isKaprodi ? KETUA_PROGRAM_STUDI : row.jabatan,
    nama: dosen || isKaprodi ? null : row.nama,
    dosenId: dosen ? String(dosen.id_dosen) : null,
    dosenNama: dosen?.nama ?? null,
    dosenNidn: dosen?.nidn ?? null,
    dosenFoto: dosen ? resolveFoto(dosen.foto) : null,
    level: row.level,
    jalur: row.jalur_sambung,
    urutan: row.urutan,
    jarakKosong: row.jarak_kosong,
    isKaprodi,
    kaprodiInvalid,
    tupoksi: row.tupoksi.map((item) => ({
      id: String(item.id_tupoksi),
      isi: item.isi,
      urutan: item.urutan,
    })),
  }
}

/**
 * Kartu Kaprodi dilindungi lewat flag is_kaprodi (bukan "siapa pun yang paling
 * atas"), karena Kaprodi boleh punya atasan (Dekan, Rektor, dst.).
 */
async function ensureKaprodi() {
  const flagged = await prisma.tbl_struktur_posisi.findFirst({ where: { is_kaprodi: true } })
  if (flagged) return flagged

  // Data lama (sebelum ada flag): posisi tanpa atasan dianggap Kaprodi.
  const legacyRoot = await prisma.tbl_struktur_posisi.findFirst({ where: { parent_id: null } })
  if (legacyRoot) {
    return prisma.tbl_struktur_posisi.update({
      where: { id_posisi: legacyRoot.id_posisi },
      data: { is_kaprodi: true },
    })
  }

  return prisma.tbl_struktur_posisi.create({
    data: { jabatan: KETUA_PROGRAM_STUDI, is_kaprodi: true, jalur_sambung: "lurus", level: 1, urutan: 0, jarak_kosong: 0 },
  })
}

// ============================================================
// QUERY
// ============================================================

export async function getStrukturTreeAdmin(): Promise<StrukturPosisiAdmin[]> {
  await ensureKaprodi()

  const [rows, kaprodiDosen] = await Promise.all([
    prisma.tbl_struktur_posisi.findMany({
      include: POSISI_ADMIN_INCLUDE,
      orderBy: { id_posisi: "asc" },
    }),
    prisma.tbl_dosen.findMany({
      where: { jabatan_struktural: KETUA_PROGRAM_STUDI },
      select: { id_dosen: true, nama: true, nidn: true, foto: true },
      orderBy: { id_dosen: "asc" },
      take: 2, // cukup untuk membedakan 0 / 1 / lebih dari 1
    }),
  ])

  return normalizeStruktur(rows.map((row) => toStrukturPosisiAdmin(row, kaprodiDosen)))
}

// ============================================================
// SIMPAN -- seluruh struktur sekaligus, dalam satu transaksi
// ============================================================

export async function saveStrukturTree(
  input: StrukturSaveInput,
  actor: Actor,
): Promise<StrukturPosisiAdmin[]> {
  const kaprodiRow = await ensureKaprodi()

  // Dirapikan ulang di server supaya apa pun yang dikirim klien tetap konsisten.
  const posisi = normalizeStruktur(input.posisi.map((item) => ({ ...item })))

  const problem = validateStruktur(posisi)
  if (problem) throw new StrukturError(problem)

  const kaprodiClient = posisi.find((item) => item.isKaprodi)
  if (!kaprodiClient || kaprodiClient.id !== String(kaprodiRow.id_posisi)) {
    throw new StrukturError("Posisi Ketua Program Studi tidak valid. Muat ulang halaman lalu coba lagi.")
  }

  const existing = await prisma.tbl_struktur_posisi.findMany({ select: { id_posisi: true } })
  const existingIds = new Set(existing.map((row) => String(row.id_posisi)))

  for (const item of posisi) {
    if (REAL_ID.test(item.id) && !existingIds.has(item.id)) {
      throw new StrukturError("Ada posisi yang sudah tidak ada di server. Muat ulang halaman lalu coba lagi.")
    }
  }

  const dosenIds = [
    ...new Set(posisi.filter((item) => !item.isKaprodi && item.dosenId).map((item) => item.dosenId as string)),
  ]
  if (dosenIds.length > 0) {
    const found = await prisma.tbl_dosen.findMany({
      where: { id_dosen: { in: dosenIds.map((value) => parseBigIntId(value)) } },
      select: { id_dosen: true },
    })
    if (found.length !== dosenIds.length) {
      throw new StrukturError("Ada dosen yang dipilih sudah tidak ada. Muat ulang halaman lalu coba lagi.")
    }
  }

  const idMap = new Map<string, bigint>() // id dari klien -> id sebenarnya di database

  await prisma.$transaction(
    async (tx) => {
      // 1. Buat posisi baru dulu (atasan diisi di langkah berikutnya).
      for (const item of posisi) {
        if (REAL_ID.test(item.id)) {
          idMap.set(item.id, BigInt(item.id))
          continue
        }

        const created = await tx.tbl_struktur_posisi.create({
          data: {
            jabatan: item.jabatan,
            jalur_sambung: item.jalur,
            level: item.level,
            urutan: item.urutan,
            jarak_kosong: item.jarakKosong,
          },
        })
        idMap.set(item.id, created.id_posisi)
      }

      // 2. Isi atasan, jalur, level, dan data tiap posisi.
      for (const item of posisi) {
        const realId = idMap.get(item.id) as bigint
        const dosenId = !item.isKaprodi && item.dosenId ? parseBigIntId(item.dosenId) : null

        await tx.tbl_struktur_posisi.update({
          where: { id_posisi: realId },
          data: {
            parent_id: item.parentId ? (idMap.get(item.parentId) as bigint) : null,
            jabatan: item.isKaprodi ? KETUA_PROGRAM_STUDI : item.jabatan,
            nama: item.isKaprodi || dosenId ? null : item.nama,
            dosen_id: dosenId,
            jalur_sambung: item.jalur,
            level: item.level,
            urutan: item.urutan,
            jarak_kosong: item.jarakKosong,
          },
        })
      }

      // 3. Hapus posisi yang sudah tidak ada. Sebelumnya semua posisi yang
      //    dipertahankan sudah dipindah atasannya, jadi cascade hanya kena
      //    posisi yang memang dihapus.
      const kept = new Set([...idMap.values()].map((value) => String(value)))
      const removed = existing.filter((row) => !kept.has(String(row.id_posisi))).map((row) => row.id_posisi)
      if (removed.length > 0) {
        await tx.tbl_struktur_posisi.deleteMany({ where: { id_posisi: { in: removed } } })
      }

      // 4. Tupoksi: perbarui yang sudah ada, tambah yang baru, hapus yang hilang.
      const existingTupoksi = await tx.tbl_struktur_tupoksi.findMany({
        where: { posisi_id: { in: [...idMap.values()] } },
      })
      const tupoksiById = new Map(existingTupoksi.map((row) => [String(row.id_tupoksi), row]))
      const referenced = new Set<string>()

      for (const item of posisi) {
        const posisiId = idMap.get(item.id) as bigint

        for (let index = 0; index < item.tupoksi.length; index += 1) {
          const entry = item.tupoksi[index]
          const known = entry.id && REAL_ID.test(entry.id) ? tupoksiById.get(entry.id) : undefined

          if (known && known.posisi_id === posisiId) {
            referenced.add(String(known.id_tupoksi))
            if (known.isi !== entry.isi || known.urutan !== index) {
              await tx.tbl_struktur_tupoksi.update({
                where: { id_tupoksi: known.id_tupoksi },
                data: { isi: entry.isi, urutan: index },
              })
            }
          } else {
            await tx.tbl_struktur_tupoksi.create({
              data: { posisi_id: posisiId, isi: entry.isi, urutan: index },
            })
          }
        }
      }

      const stale = existingTupoksi.filter((row) => !referenced.has(String(row.id_tupoksi))).map((row) => row.id_tupoksi)
      if (stale.length > 0) {
        await tx.tbl_struktur_tupoksi.deleteMany({ where: { id_tupoksi: { in: stale } } })
      }
    },
    { timeout: 30_000, maxWait: 10_000 },
  )

  await logEntityMutation({
    actor,
    action: "update",
    entity: ENTITY,
    entityId: kaprodiRow.id_posisi,
    deskripsi: `${actor.nama} menyimpan struktur organisasi (${posisi.length} posisi).`,
    dataBaru: posisi.map((item) => ({
      id: item.id,
      parentId: item.parentId,
      jabatan: item.jabatan,
      level: item.level,
      jalur: item.jalur,
    })),
  })

  return getStrukturTreeAdmin()
}