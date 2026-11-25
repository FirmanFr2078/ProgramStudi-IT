/**
 * Logika murni struktur organisasi (tanpa React, tanpa Prisma) -- dipakai
 * bersama oleh board dashboard (client), server (validasi sebelum simpan),
 * dan nanti halaman landing (read-only).
 *
 * MODEL
 * - Tiap posisi punya 1 atasan (parentId), kecuali posisi paling atas.
 * - Bawahan sebuah posisi dikelompokkan per `level` (baris 1, 2, 3, ...).
 * - Di satu baris, tiap bawahan punya `jalur`:
 *     "kiri"   -> kartu di sisi kiri garis utama
 *     "lurus"  -> kartu tepat di garis utama (maks. 1 per baris, dan hanya di
 *                 baris TERAKHIR, karena garis utama berakhir/lanjut di situ)
 *     "kanan"  -> kartu di sisi kanan garis utama
 * - `urutan` mengatur susunan kiri -> kanan di dalam grup jalur yang sama.
 * - Posisi dihitung dari struktur (layoutStruktur), BUKAN disimpan sebagai
 *   koordinat -- jadi "sebaris = selevel" selalu terjaga dan selalu rapi.
 *
 * MODE PER BARIS (parentId + level) -- terkunci otomatis, BUKAN kolom baru:
 * - "tembus"      : baris ini berisi kiri/kanan TANPA kartu lurus. Garis
 *                   otoritas tetap tembus lurus ke bawah walau cuma 1 sisi
 *                   terisi. Baris ini SELAMANYA tidak boleh punya "lurus".
 * - "tiga-posisi" : baris ini punya kartu lurus (plus kiri/kanan opsional).
 *                   Mode ini yang dideteksi `levelMode()` dari isi baris
 *                   saat ini (lihat catatan di levelMode).
 * - `jarakKosong` hanya berarti di baris mode "tembus": jumlah baris kosong
 *   (tanpa row sama sekali) yang di-skip tepat sebelum baris ini.
 */

export type Jalur = "lurus" | "kiri" | "kanan"

export type TreeNode = {
  id: string
  parentId: string | null
  level: number
  jalur: Jalur
  urutan: number
  isKaprodi: boolean
  /** BARU. Hanya berarti di baris mode "tembus" (lihat levelMode). */
  jarakKosong: number
}

const RANK: Record<Jalur, number> = { kiri: 0, lurus: 1, kanan: 2 }

// ============================================================
// QUERY DASAR
// ============================================================

function compareInRow(a: TreeNode, b: TreeNode): number {
  return RANK[a.jalur] - RANK[b.jalur] || a.urutan - b.urutan
}

/** Bawahan langsung, urut per level lalu kiri -> kanan. */
export function childrenOf<T extends TreeNode>(list: T[], parentId: string | null): T[] {
  return list
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.level - b.level || compareInRow(a, b))
}

/** Satu baris (satu level) bawahan, urut kiri -> kanan. */
export function rowOf<T extends TreeNode>(list: T[], parentId: string | null, level: number): T[] {
  return list
    .filter((item) => item.parentId === parentId && item.level === level)
    .sort(compareInRow)
}

export function maxLevelOf(list: TreeNode[], parentId: string): number {
  let max = 0
  for (const item of list) if (item.parentId === parentId && item.level > max) max = item.level
  return max
}

export function descendantIds(list: TreeNode[], id: string): string[] {
  const result: string[] = []
  let frontier = [id]
  while (frontier.length > 0) {
    const next = list.filter((item) => item.parentId !== null && frontier.includes(item.parentId)).map((item) => item.id)
    result.push(...next)
    frontier = next
  }
  return result
}

/** Atasan terdekat dulu, sampai posisi paling atas. */
export function ancestorIds(list: TreeNode[], id: string): string[] {
  const byId = new Map(list.map((item) => [item.id, item]))
  const result: string[] = []
  let current = byId.get(id)
  const guard = new Set<string>()
  while (current && current.parentId !== null && !guard.has(current.id)) {
    guard.add(current.id)
    result.push(current.parentId)
    current = byId.get(current.parentId)
  }
  return result
}

export function kaprodiIdOf(list: TreeNode[]): string | null {
  return list.find((item) => item.isKaprodi)?.id ?? null
}

/** Id yang dilewati jalur dari posisi paling atas sampai Kaprodi (termasuk Kaprodi). */
export function kaprodiPathIds(list: TreeNode[]): Set<string> {
  const kid = kaprodiIdOf(list)
  if (!kid) return new Set()
  return new Set([kid, ...ancestorIds(list, kid)])
}

/**
 * Garis hijau = rantai "lurus" mulai dari Kaprodi ke bawah.
 * Kaprodi sendiri hijau; bawahan hijau hanya kalau jalurnya lurus DAN
 * atasannya hijau. Rantai di atas Kaprodi dan semua cabang samping tidak hijau.
 */
export function greenIds(list: TreeNode[]): Set<string> {
  const green = new Set<string>()
  const kid = kaprodiIdOf(list)
  if (!kid) return green
  green.add(kid)
  let frontier = [kid]
  while (frontier.length > 0) {
    const next: string[] = []
    for (const item of list) {
      if (item.parentId !== null && frontier.includes(item.parentId) && item.jalur === "lurus") {
        green.add(item.id)
        next.push(item.id)
      }
    }
    frontier = next
  }
  return green
}

/** Posisi yang garis utamanya boleh punya (+) sisip: Kaprodi, rantai di atasnya, dan rantai hijau di bawahnya. */
export function spineOwnerIds(list: TreeNode[]): Set<string> {
  return new Set([...kaprodiPathIds(list), ...greenIds(list)])
}

// ============================================================
// MODE PER BARIS (tembus / tiga-posisi) -- diturunkan, bukan disimpan
// ============================================================

export type LevelMode = "tembus" | "tiga-posisi" | null

/**
 * Mode satu baris (parentId + level) dideteksi dari ISI BARIS SAAT INI:
 * - ada kartu "lurus" di baris itu -> "tiga-posisi" (kiri/kanan baru muncul setelah tengah)
 * - tidak ada "lurus" tapi ada kiri/kanan -> "tembus" (lurus selamanya terkunci)
 * - baris kosong total -> null (belum ditentukan, dialog akan nanya)
 *
 * Catatan: karena ini dihitung dari snapshot saat ini (bukan histori), baris
 * "tiga-posisi" yang kartu tengahnya kebetulan sedang kosong (baru dihapus,
 * belum dibuat ulang) akan sementara terbaca "tembus" sampai tengahnya diisi
 * lagi. Simplifikasi yang disengaja -- bilang kalau mau dikunci lebih ketat.
 */
export function levelMode(list: TreeNode[], parentId: string, level: number): LevelMode {
  const row = list.filter((item) => item.parentId === parentId && item.level === level)
  if (row.length === 0) return null
  return row.some((item) => item.jalur === "lurus") ? "tiga-posisi" : "tembus"
}

// ============================================================
// NORMALISASI -- menjaga invariant, dipanggil setelah tiap operasi
// ============================================================

/**
 * - level tiap kelompok bawahan dirapatkan jadi 1..n tanpa lubang
 * - maksimal 1 "lurus" per baris (Kaprodi diprioritaskan), sisanya jadi "kanan"
 * - "lurus" hanya boleh di baris terakhir; kalau tidak, jadi "kanan"
 * - urutan dirapikan 0..n per (atasan, level, jalur)
 * - Kaprodi selalu "lurus"
 * - `jarakKosong` dibiarkan apa adanya (bukan urusan normalisasi level);
 *   konsistensinya dicek di `validateStruktur`.
 */
export function normalizeStruktur<T extends TreeNode>(list: T[]): T[] {
  const next = list.map((item) => ({ ...item }))
  const groups = new Map<string | null, T[]>()
  for (const item of next) {
    const key = item.parentId
    const bucket = groups.get(key) ?? []
    bucket.push(item)
    groups.set(key, bucket)
  }

  for (const [parentId, kids] of groups) {
    if (parentId === null) {
      // Posisi paling atas: tidak punya "baris" -- cukup netral.
      for (const item of kids) {
        item.level = 1
        item.jalur = "lurus"
        item.urutan = 0
        item.jarakKosong = 0
      }
      continue
    }

    const levels = [...new Set(kids.map((item) => item.level))].sort((a, b) => a - b)
    const levelMap = new Map(levels.map((value, index) => [value, index + 1]))
    for (const item of kids) item.level = levelMap.get(item.level) ?? 1
    const lastLevel = levels.length

    for (let level = 1; level <= lastLevel; level += 1) {
      const row = kids.filter((item) => item.level === level)
      row.sort((a, b) => compareInRow(a, b))

      const lurusCards = row.filter((item) => item.jalur === "lurus")
      if (lurusCards.length > 1) {
        const kaprodiCard = lurusCards.find((item) => item.isKaprodi)
        if (kaprodiCard) {
          for (const item of lurusCards) if (item !== kaprodiCard) item.jalur = "kanan"
        } else {
          // Konflik (mis. data lama): sebar simetris -- separuh kiri, yang tengah (kalau ganjil) lurus, sisanya kanan.
          const count = lurusCards.length
          const middle = count % 2 === 1 ? (count - 1) / 2 : -1
          lurusCards.forEach((item, index) => {
            item.urutan = index
            item.jalur = index === middle ? "lurus" : index < count / 2 ? "kiri" : "kanan"
          })
        }
      }

      // "lurus" hanya sah di baris terakhir.
      if (level < lastLevel) {
        for (const item of row) if (item.jalur === "lurus" && !item.isKaprodi) item.jalur = "kanan"
      }
    }

    for (let level = 1; level <= lastLevel; level += 1) {
      const row = kids.filter((item) => item.level === level)
      row.sort((a, b) => compareInRow(a, b))
      const counters: Record<Jalur, number> = { kiri: 0, lurus: 0, kanan: 0 }
      for (const item of row) {
        item.urutan = counters[item.jalur]
        counters[item.jalur] += 1
      }
    }
  }

  for (const item of next) if (item.isKaprodi) item.jalur = "lurus"
  return next
}

function renumberRow<T extends TreeNode>(ordered: T[]): T[] {
  const counters: Record<Jalur, number> = { kiri: 0, lurus: 0, kanan: 0 }
  return ordered.map((item) => {
    const urutan = counters[item.jalur]
    counters[item.jalur] += 1
    return { ...item, urutan }
  })
}

function replaceMany<T extends TreeNode>(list: T[], replacements: T[]): T[] {
  const map = new Map(replacements.map((item) => [item.id, item]))
  return list.map((item) => map.get(item.id) ?? item)
}

// ============================================================
// OPERASI TAMBAH
// ============================================================

/** (+) kiri / kanan di tepi kartu: tambah kartu selevel (satu baris) di sebelah `refId`. */
export function insertSide<T extends TreeNode>(list: T[], refId: string, side: "kiri" | "kanan", node: T): T[] {
  const ref = list.find((item) => item.id === refId)
  if (!ref || ref.parentId === null) return list

  const row = rowOf(list, ref.parentId, ref.level)
  const index = row.findIndex((item) => item.id === refId)
  let jalur: Jalur = ref.jalur
  if (ref.jalur === "lurus") {
    jalur = side
  } else if (ref.jalur === "kiri" && side === "kanan") {
    // Di kanan kartu kiri: kalau sudah paling dekat garis utama dan tidak ada kartu lurus, seberangi garis.
    const next = row[index + 1]
    jalur = !next || next.jalur === "kanan" ? "kanan" : "kiri"
  } else if (ref.jalur === "kanan" && side === "kiri") {
    const prev = row[index - 1]
    jalur = !prev || prev.jalur === "kiri" ? "kiri" : "kanan"
  }
  // Kartu baru mengikuti baris yang sama -> jarakKosong ikut baris (ambil dari ref, bukan dari node yang dikirim form).
  const created: T = { ...node, parentId: ref.parentId, level: ref.level, jalur, urutan: 0, jarakKosong: ref.jarakKosong }

  const ordered = [...row]
  ordered.splice(side === "kiri" ? index : index + 1, 0, created)
  const renumbered = renumberRow(ordered)

  return normalizeStruktur([...replaceMany(list, renumbered.filter((item) => item.id !== created.id)), renumbered.find((item) => item.id === created.id)!])
}

/**
 * (+) bawah di kartu yang belum punya bawahan: bawahan pertama -- ini juga
 * titik di mana MODE baris itu pertama kali ditentukan (dialog wizard).
 * jalur "lurus" -> mode "tiga-posisi", wajib jarakKosong 0.
 * jalur "kiri"/"kanan" -> mode "tembus", jarakKosong ikut yang dipilih di wizard.
 */
export function addChild<T extends TreeNode>(list: T[], parentId: string, jalur: Jalur, node: T): T[] {
  const created: T = { ...node, parentId, level: 1, jalur, urutan: 0, jarakKosong: jalur === "lurus" ? 0 : node.jarakKosong }
  return normalizeStruktur([...list, created])
}

/**
 * (+) di garis utama milik `parentId`, di celah ke-`index`
 * (0 = tepat di bawah kartu atasan, m = di bawah baris terakhir).
 * Sama seperti `addChild`, ini SELALU membuat baris (level) baru dari nol --
 * jadi ini juga titik tempat MODE baris itu ditentukan lewat wizard.
 *
 * - jalur "lurus": kartu baru jadi satu-satunya kartu lurus di baris index+1 dan
 *   SEMUA baris di bawahnya ikut jadi bawahannya -- susunan di bawah tidak berubah,
 *   hanya turun satu tingkat (inilah "menyisipkan tanpa mengubah yang bawah").
 * - jalur "kiri"/"kanan": menambah baris baru berisi satu kartu samping di celah itu.
 */
export function insertOnSpine<T extends TreeNode>(list: T[], parentId: string, index: number, jalur: Jalur, node: T): T[] {
  const created: T = { ...node, parentId, level: index + 1, jalur, urutan: 0, jarakKosong: jalur === "lurus" ? 0 : node.jarakKosong }

  if (jalur === "lurus") {
    const moved = list
      .filter((item) => item.parentId === parentId && item.level > index)
      .map((item) => ({ ...item, parentId: created.id, level: item.level - index }))
    return normalizeStruktur([...replaceMany(list, moved), created])
  }

  const shifted = list
    .filter((item) => item.parentId === parentId && item.level > index)
    .map((item) => ({ ...item, level: item.level + 1 }))
  return normalizeStruktur([...replaceMany(list, shifted), created])
}

/**
 * BARU -- klik titik (+) "Penyisipan level vertikal" di TENGAH baris kosong
 * (jarakKosong) milik satu anchor tembus. Memecah jarakKosong jadi 2 bagian:
 * sisi atas (sebelum kartu baru, = `position`) dan sisa di anchor lama
 * (= jarakKosong lama - position - 1), lalu anchor digeser turun 1 level.
 * Hanya untuk mode "tembus" (jalur dibatasi kiri/kanan di UI).
 */
export function insertAtSkip<T extends TreeNode>(
  list: T[],
  parentId: string,
  anchorLevel: number,
  position: number,
  side: "kiri" | "kanan",
  node: T,
): T[] {
  const anchorRow = list.filter((item) => item.parentId === parentId && item.level === anchorLevel)
  if (anchorRow.length === 0) return list

  const currentSkip = anchorRow[0].jarakKosong ?? 0
  if (position < 0 || position >= currentSkip) return list

  const remainingSkip = currentSkip - position - 1
  const created: T = { ...node, parentId, level: anchorLevel, jalur: side, urutan: 0, jarakKosong: position }

  const shifted = list
    .filter((item) => item.parentId === parentId && item.level >= anchorLevel)
    .map((item) => ({ ...item, level: item.level + 1, jarakKosong: remainingSkip }))

  return normalizeStruktur([...replaceMany(list, shifted), created])
}

/** (+) atas di posisi paling atas (tanpa atasan): kartu baru jadi atasannya. */
export function insertAbove<T extends TreeNode>(list: T[], refId: string, node: T): T[] {
  const ref = list.find((item) => item.id === refId)
  if (!ref || ref.parentId !== null) return list

  const created: T = { ...node, parentId: null, level: 1, jalur: "lurus", urutan: 0, jarakKosong: 0 }
  const moved = { ...ref, parentId: created.id, level: 1, jalur: "lurus" as const, urutan: 0 }
  return normalizeStruktur([...replaceMany(list, [moved]), created])
}

// ============================================================
// UBAH JALUR
// ============================================================

/**
 * Jalur "lurus" hanya sah kalau:
 * - bukan baris yang terkunci mode "tembus" (selamanya tidak boleh lurus)
 * - belum ada kartu lurus lain di baris itu
 * - barisnya yang terakhir
 */
export function canBeLurus(list: TreeNode[], id: string): boolean {
  const node = list.find((item) => item.id === id)
  if (!node || node.parentId === null) return false
  if (node.isKaprodi) return true
  if (levelMode(list, node.parentId, node.level) === "tembus") return false
  const last = maxLevelOf(list, node.parentId)
  if (node.level !== last) return false
  return !list.some((item) => item.id !== id && item.parentId === node.parentId && item.level === node.level && item.jalur === "lurus")
}

export function setJalur<T extends TreeNode>(list: T[], id: string, jalur: Jalur): T[] {
  const node = list.find((item) => item.id === id)
  if (!node || node.parentId === null || node.isKaprodi || node.jalur === jalur) return list
  if (jalur === "lurus" && !canBeLurus(list, id)) return list

  const others = rowOf(list, node.parentId, node.level).filter((item) => item.id !== id)
  const kiriCount = others.filter((item) => item.jalur === "kiri").length
  const lurusCount = others.filter((item) => item.jalur === "lurus").length
  // Kartu yang pindah jalur ditaruh paling dekat garis utama.
  const at = jalur === "kiri" ? kiriCount : jalur === "lurus" ? kiriCount : kiriCount + lurusCount

  const ordered = [...others]
  ordered.splice(at, 0, { ...node, jalur, jarakKosong: jalur === "lurus" ? 0 : node.jarakKosong })
  return normalizeStruktur(replaceMany(list, renumberRow(ordered)))
}

// ============================================================
// HAPUS
// ============================================================

export type DeleteMode = "cascade" | "promote"

export type DeletePlan = {
  /** Kartu yang bisa dihapus? false untuk Kaprodi. */
  allowed: boolean
  /** Bawahan langsung yang berada di jalur menuju Kaprodi (selalu dipertahankan). */
  pathChildId: string | null
  /** Bawahan langsung selain pathChild. Kalau ada, admin perlu memilih mode. */
  otherChildIds: string[]
  /** "Naikkan turunannya" bisa dipakai? false kalau tidak ada atasan untuk menampung. */
  canPromote: boolean
}

export function planDelete(list: TreeNode[], id: string): DeletePlan {
  const node = list.find((item) => item.id === id)
  if (!node || node.isKaprodi) {
    return { allowed: false, pathChildId: null, otherChildIds: [], canPromote: false }
  }

  const kids = childrenOf(list, id)
  const path = kaprodiPathIds(list)
  const pathChild = kids.find((item) => path.has(item.id)) ?? null
  const others = kids.filter((item) => item.id !== pathChild?.id)

  // Posisi paling atas tidak punya atasan: hanya boleh menaikkan kalau penggantinya tunggal.
  const canPromote = node.parentId !== null || kids.length <= 1
  return { allowed: true, pathChildId: pathChild?.id ?? null, otherChildIds: others.map((item) => item.id), canPromote }
}

/** Id yang akan hilang kalau `id` dihapus dengan mode tertentu. */
export function idsRemoved(list: TreeNode[], id: string, mode: DeleteMode): string[] {
  const plan = planDelete(list, id)
  if (!plan.allowed) return []
  if (mode === "promote") return [id]

  const kept = new Set<string>()
  if (plan.pathChildId) {
    kept.add(plan.pathChildId)
    for (const d of descendantIds(list, plan.pathChildId)) kept.add(d)
  }
  return [id, ...descendantIds(list, id)].filter((item) => !kept.has(item))
}

/**
 * Hapus satu posisi.
 * - Kaprodi tidak pernah bisa dihapus (langsung maupun lewat turunan).
 * - Bawahan yang dipertahankan (semua bawahan untuk "promote"; hanya yang
 *   menuju Kaprodi untuk "cascade") menggantikan tempat posisi yang dihapus,
 *   di baris yang sama. Jalur: kalau yang dihapus "lurus", tiap bawahan
 *   memakai jalurnya sendiri (hanya satu yang boleh lurus); kalau tidak,
 *   mereka mewarisi jalur yang dihapus.
 */
export function removeNode<T extends TreeNode>(list: T[], id: string, mode: DeleteMode): T[] {
  const plan = planDelete(list, id)
  const node = list.find((item) => item.id === id)
  if (!plan.allowed || !node) return list
  if (mode === "promote" && !plan.canPromote) return list

  const removed = new Set(idsRemoved(list, id, mode))
  const survivors = childrenOf(list, id).filter((item) => !removed.has(item.id))
  const remaining = list.filter((item) => !removed.has(item.id))
  if (survivors.length === 0) return normalizeStruktur(remaining)

  const parentId = node.parentId
  const base: Jalur = node.jalur
  let lurusUsed = false
  const promoted = survivors.map((item) => {
    let jalur: Jalur
    if (base === "lurus") {
      if (item.jalur === "lurus" && !lurusUsed) {
        jalur = "lurus"
        lurusUsed = true
      } else {
        jalur = item.jalur === "kiri" ? "kiri" : "kanan"
      }
    } else {
      jalur = base
    }
    return { ...item, parentId, level: node.level, jalur }
  })

  if (parentId === null) {
    return normalizeStruktur(replaceMany(remaining, promoted))
  }

  const row = rowOf(remaining, parentId, node.level)
  const at = node.jalur === "lurus" ? row.filter((item) => item.jalur === "kiri").length : row.filter((item) => compareInRow(item, node) < 0).length
  const merged = [...row]
  merged.splice(at, 0, ...promoted.map((item) => ({ ...item, urutan: 0 })))
  const renumbered = renumberRow(merged)

  const survivorIds = new Set(survivors.map((item) => item.id))
  const rest = remaining.filter((item) => !survivorIds.has(item.id))
  return normalizeStruktur([...replaceMany(rest, renumbered.filter((item) => !survivorIds.has(item.id))), ...renumbered.filter((item) => survivorIds.has(item.id))])
}

// ============================================================
// VALIDASI (dipakai server sebelum menyimpan)
// ============================================================

export function validateStruktur(list: TreeNode[]): string | null {
  if (list.length === 0) return "Struktur kosong."
  const ids = new Set(list.map((item) => item.id))
  if (ids.size !== list.length) return "Ada id posisi yang ganda."

  const kaprodi = list.filter((item) => item.isKaprodi)
  if (kaprodi.length !== 1) return "Struktur harus punya tepat satu posisi Ketua Program Studi."

  const roots = list.filter((item) => item.parentId === null)
  if (roots.length !== 1) return "Struktur harus punya tepat satu posisi paling atas."

  for (const item of list) {
    if (item.parentId !== null && !ids.has(item.parentId)) return "Ada posisi dengan atasan yang tidak ditemukan."
  }

  const reachable = new Set<string>([roots[0].id, ...descendantIds(list, roots[0].id)])
  if (reachable.size !== list.length) return "Ada posisi yang terputus atau saling merujuk (siklus)."

  // BARU -- validasi per baris (parentId + level): max 1 lurus, jarakKosong konsisten antar sibling,
  // dan baris mode "tiga-posisi" (punya lurus) tidak boleh punya jarakKosong.
  const groups = new Map<string, TreeNode[]>()
  for (const item of list) {
    if (item.parentId === null) continue
    const key = `${item.parentId}::${item.level}`
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  for (const [, rows] of groups) {
    const lurusCount = rows.filter((item) => item.jalur === "lurus").length
    if (lurusCount > 1) return "Satu baris tidak boleh punya lebih dari satu posisi lurus."

    const skipValues = new Set(rows.map((item) => item.jarakKosong ?? 0))
    if (skipValues.size > 1) return "Nilai lewati-baris-kosong tidak konsisten dalam satu baris yang sama."

    if (lurusCount > 0 && rows.some((item) => (item.jarakKosong ?? 0) > 0)) {
      return "Baris dengan kartu lurus (mode 3 Posisi Terisi) tidak boleh melewati baris kosong."
    }
  }

  return null
}

// ============================================================
// LAYOUT
// ============================================================

export const CARD_W = 232
export const CARD_H = 64
const GAP_X = 36
const ROW_GAP = 84
const BAR_OFFSET = 28
/** Jarak si garis spine (titik tanpa kartu tengah) ke kartu kiri/kanan terdekat, biar garisnya
 *  gak nempel ke kartu. Ini konstanta kecil, bukan pengganti lebar kartu. */
const SPINE_CLEARANCE = 14
export const BOARD_PAD = 48

export type LayoutBox = { id: string; x: number; y: number; w: number; h: number }
export type LayoutLine = { key: string; d: string; green: boolean }
export type LayoutSpot = {
  key: string
  parentId: string
  index: number
  x: number
  y: number
  green: boolean
  skip?: { parentId: string; level: number; position: number }
}
export type LayoutResult = {
  boxes: LayoutBox[]
  lines: LayoutLine[]
  spots: LayoutSpot[]
  width: number
  height: number
}

/**
 * CATATAN ARSITEKTUR -- jarak antar-kartu di satu baris SELALU konstan (CARD_W/2 + GAP_X dari
 * garis tengah), TIDAK PERNAH ikut melebar karena subtree di bawah salah satu kartu lebar.
 * Dulu `measure()` menghitung lebar tiap node dari subtree terdalamnya (standar "tidy tree"), dan
 * lebar itu dipakai lagi oleh PARENT-nya buat jarak ke saudara-saudaranya -- efeknya nambah kartu di
 * level yang dalam bisa "menjalar" ngubah jarak di level yang jauh di atasnya, gak terkait sama
 * sekali. Sekarang distabilkan: subtree boleh melebar sebebas-bebasnya ke bawah, tapi pelebaran itu
 * berhenti di situ, gak pernah naik ke atas. Konsekuensinya: kalau 1 kartu subtree-nya SANGAT lebar,
 * dia bisa visual numpuk ke kolom tetangganya -- diterima sebagai trade-off, bukan dianggap bug.
 */
type Placed = { node: TreeNode }
type RowBlock = {
  level: number
  left: Placed[] // urut dari kiri ke kanan
  center: Placed | null
  right: Placed[]
}
type Block = { rows: RowBlock[] }

export function layoutStruktur(list: TreeNode[]): LayoutResult {
  const byParent = new Map<string | null, TreeNode[]>()
  for (const item of list) {
    const bucket = byParent.get(item.parentId) ?? []
    bucket.push(item)
    byParent.set(item.parentId, bucket)
  }

  const green = greenIds(list)
  const spineOwners = spineOwnerIds(list)
  const memo = new Map<string, Block>()

  function measure(node: TreeNode): Block {
    const cached = memo.get(node.id)
    if (cached) return cached

    const kids = byParent.get(node.id) ?? []
    const levels = [...new Set(kids.map((item) => item.level))].sort((a, b) => a - b)
    const toPlaced = (item: TreeNode): Placed => ({ node: item })

    const rows: RowBlock[] = levels.map((level) => {
      const cards = kids.filter((item) => item.level === level).sort(compareInRow)
      const centerNode = cards.find((item) => item.jalur === "lurus")
      return {
        level,
        left: cards.filter((item) => item.jalur === "kiri").map(toPlaced),
        center: centerNode ? toPlaced(centerNode) : null,
        right: cards.filter((item) => item.jalur === "kanan").map(toPlaced),
      }
    })

    const block: Block = { rows }
    memo.set(node.id, block)
    return block
  }

  const boxes: LayoutBox[] = []
  const lines: LayoutLine[] = []
  const spots: LayoutSpot[] = []

  const segment = (key: string, x1: number, y1: number, x2: number, y2: number, isGreen: boolean) => {
    lines.push({ key, d: `M${x1} ${y1}L${x2} ${y2}`, green: isGreen })
  }

  function place(node: TreeNode, ax: number, top: number) {
    const block = measure(node)
    boxes.push({ id: node.id, x: ax - CARD_W / 2, y: top, w: CARD_W, h: CARD_H })
    if (block.rows.length === 0) return

    const isGreen = green.has(node.id)
    const hasSpine = spineOwners.has(node.id)
    const bottom = top + CARD_H
    const lastRow = block.rows[block.rows.length - 1]
    let rowTop = bottom + ROW_GAP
    const rowTops: number[] = []

    block.rows.forEach((row) => {
      // Titik skip "Penyisipan level vertikal" untuk jarakKosong baris ini.
      const rowCards = [...row.left, ...(row.center ? [row.center] : []), ...row.right]
      const skip = rowCards[0]?.node.jarakKosong ?? 0
      if (skip > 0) {
        for (let s = 0; s < skip; s += 1) {
          spots.push({
            key: `${node.id}-skip-${row.level}-${s}`,
            parentId: node.id,
            index: 0,
            x: ax,
            y: rowTop + s * (ROW_GAP + CARD_H) + ROW_GAP / 2 - BAR_OFFSET,
            green: isGreen,
            skip: { parentId: node.id, level: row.level, position: s },
          })
        }
        rowTop += skip * (ROW_GAP + CARD_H)
      }

      rowTops.push(rowTop)
      const barY = rowTop - BAR_OFFSET
      // Bar & stub ke kartu kiri/kanan SELALU netral -- hijau cuma dibawa oleh garis spine tunggal di bawah.
      const isAuthority = false
      const key = `${node.id}-r${row.level}`

      // Jarak tiap kartu samping dari garis tengah: KONSTAN (CARD_W/2 + GAP_X), tidak peduli
      // subtree di bawah kartu itu selebar apa.
      const axes: { placed: Placed; x: number }[] = []
      const innerL = row.center ? CARD_W / 2 : SPINE_CLEARANCE
      const innerR = row.center ? CARD_W / 2 : SPINE_CLEARANCE

      let edge = ax - innerL - GAP_X
      for (let i = row.left.length - 1; i >= 0; i -= 1) {
        const item = row.left[i]
        const x = edge - CARD_W / 2
        axes.push({ placed: item, x })
        edge = x - CARD_W / 2 - GAP_X
      }
      edge = ax + innerR + GAP_X
      for (const item of row.right) {
        const x = edge + CARD_W / 2
        axes.push({ placed: item, x })
        edge = x + CARD_W / 2 + GAP_X
      }

      if (axes.length > 0) {
        const xs = axes.map((item) => item.x)
        const from = Math.min(ax, ...xs)
        const to = Math.max(ax, ...xs)
        segment(`${key}-bar`, from, barY, to, barY, isAuthority)
        for (const item of axes) {
          segment(`${key}-stub-${item.placed.node.id}`, item.x, barY, item.x, rowTop, isAuthority)
        }
      }

      if (row.center) {
        place(row.center.node, ax, rowTop)
      }
      for (const item of axes) place(item.placed.node, item.x, rowTop)

      rowTop += CARD_H + ROW_GAP
    })

    const lastTop = rowTops[rowTops.length - 1]
    const needsAppendSpot = hasSpine && !lastRow.center
    const spineEnd = lastRow.center ? lastTop : needsAppendSpot ? lastTop + CARD_H + BAR_OFFSET : lastTop - BAR_OFFSET
    segment(`${node.id}-spine`, ax, bottom, ax, spineEnd, isGreen)

    if (hasSpine) {
      for (let i = 0; i < block.rows.length; i += 1) {
        spots.push({ key: `${node.id}-spot-${i}`, parentId: node.id, index: i, x: ax, y: rowTops[i] - BAR_OFFSET - 28, green: isGreen })
      }
      if (needsAppendSpot) {
        spots.push({ key: `${node.id}-spot-${block.rows.length}`, parentId: node.id, index: block.rows.length, x: ax, y: spineEnd, green: isGreen })
      }
    }
  }

  const roots = (byParent.get(null) ?? []).sort((a, b) => a.urutan - b.urutan)
  let cursor = 0
  for (const root of roots) {
    place(root, cursor + CARD_W / 2, 0)
    cursor += CARD_W + GAP_X * 2
  }

  const minX = Math.min(0, ...boxes.map((item) => item.x))
  const maxX = Math.max(0, ...boxes.map((item) => item.x + item.w))
  const maxY = Math.max(0, ...boxes.map((item) => item.y + item.h), ...spots.map((item) => item.y + 14))
  const shiftX = BOARD_PAD - minX
  const shiftY = BOARD_PAD

  const shiftedLines = lines.map((line) => ({
    ...line,
    d: line.d.replace(/M([-\d.]+) ([-\d.]+)L([-\d.]+) ([-\d.]+)/, (_m, x1, y1, x2, y2) => `M${Number(x1) + shiftX} ${Number(y1) + shiftY}L${Number(x2) + shiftX} ${Number(y2) + shiftY}`),
  }))

  return {
    boxes: boxes.map((item) => ({ ...item, x: item.x + shiftX, y: item.y + shiftY })),
    lines: shiftedLines,
    spots: spots.map((item) => ({ ...item, x: item.x + shiftX, y: item.y + shiftY })),
    width: maxX - minX + BOARD_PAD * 2,
    height: maxY + BOARD_PAD * 2,
  }
}