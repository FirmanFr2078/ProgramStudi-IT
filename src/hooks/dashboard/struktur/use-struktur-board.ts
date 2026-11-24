"use client"

import { useEffect, useState } from "react"

import {
  addChild,
  insertAbove,
  insertAtSkip,
  insertOnSpine,
  insertSide,
  normalizeStruktur,
  removeNode,
  setJalur,
  type DeleteMode,
  type Jalur,
} from "@/lib/struktur-tree"
import type { DosenAdmin, StrukturPosisiAdmin } from "@/types"

const STRUKTUR_URL = "/api/dashboard/struktur"
const DOSEN_URL = "/api/dashboard/sdm/dosen"
const REAL_ID = /^\d+$/

type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
}

/** Dari mana (+) ditekan -- menentukan operasi yang dijalankan setelah dialog diisi. */
export type CreateTarget =
  | { kind: "child"; parentId: string }
  | { kind: "side"; referenceId: string; side: "kiri" | "kanan" }
  | { kind: "spine"; parentId: string; index: number }
  | { kind: "skip"; parentId: string; level: number; position: number }
  | { kind: "above"; referenceId: string }

export type DialogState =
  | { mode: "closed" }
  | { mode: "create"; target: CreateTarget }
  | { mode: "edit"; posisiId: string }

export type PosisiFormValues = {
  jabatan: string
  dosenId: string | null
  nama: string | null
  jalur: Jalur
  /** BARU -- hanya dipakai saat wizard "Tembus" (target kind "child"/"spine"). */
  jarakKosong: number
}

let tempCounter = 0
function createTempId(prefix: string) {
  tempCounter += 1
  return `${prefix}-${Date.now()}-${tempCounter}`
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  return (await response.json()) as ApiResponse<T>
}

function resolveDosenFields(dosenId: string | null, dosenOptions: DosenAdmin[]) {
  if (!dosenId) return { dosenId: null, dosenNama: null, dosenNidn: null, dosenFoto: null }
  const dosen = dosenOptions.find((item) => item.id === dosenId)
  return {
    dosenId,
    dosenNama: dosen?.nama ?? null,
    dosenNidn: dosen?.nidn ?? null,
    dosenFoto: dosen?.foto ?? null,
  }
}

function toPayload(item: StrukturPosisiAdmin) {
  return {
    id: item.id,
    parentId: item.parentId,
    jabatan: item.jabatan,
    nama: item.isKaprodi ? null : item.nama,
    dosenId: item.isKaprodi ? null : item.dosenId,
    level: item.level,
    jalur: item.jalur,
    urutan: item.urutan,
    jarakKosong: item.jarakKosong,
    isKaprodi: item.isKaprodi,
    tupoksi: item.tupoksi.map((entry) => ({
      id: REAL_ID.test(entry.id) ? entry.id : null,
      isi: entry.isi,
    })),
  }
}

/**
 * BARU -- dosen yang sudah dipakai di posisi manapun dalam DRAFT saat ini
 * (termasuk kartu Kaprodi, yang juga punya dosenId) disembunyikan dari
 * dropdown, kecuali dosen milik kartu yang sedang diedit (`editingId`).
 * Difilter dari draft (bukan query ulang server) supaya langsung reflect
 * assignment yang belum "Simpan Struktur".
 */
export function availableDosenOptions(options: DosenAdmin[], posisi: StrukturPosisiAdmin[], editingId: string | null): DosenAdmin[] {
  const used = new Set(posisi.filter((item) => item.id !== editingId && item.dosenId).map((item) => item.dosenId))
  return options.filter((item) => !used.has(item.id))
}

/**
 * Seluruh perubahan dikerjakan di `draft` (lokal). Server baru disentuh saat
 * "Simpan Struktur": satu request PUT, satu transaksi -- berhasil semua atau
 * tidak sama sekali. Layout tidak disimpan; dihitung ulang dari struktur
 * (lihat src/lib/struktur-tree.ts).
 */
export function useStrukturBoard(initialData: StrukturPosisiAdmin[]) {
  const [saved, setSaved] = useState<StrukturPosisiAdmin[]>(initialData)
  const [draft, setDraft] = useState<StrukturPosisiAdmin[]>(initialData)
  const [isDirty, setIsDirty] = useState(false)
  const [dosenOptions, setDosenOptions] = useState<DosenAdmin[]>([])
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" })
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch(DOSEN_URL, { credentials: "include" })
      .then((response) => parseResponse<DosenAdmin[]>(response))
      .then((result) => {
        if (result.success && result.data) setDosenOptions(result.data)
      })
      .catch(() => {})
  }, [])

  function mutate(change: (list: StrukturPosisiAdmin[]) => StrukturPosisiAdmin[]) {
    setDraft((prev) => normalizeStruktur(change(prev)))
    setIsDirty(true)
  }

  function openCreateDialog(target: CreateTarget) {
    setErrorMessage(null)
    setDialog({ mode: "create", target })
  }

  function openEditDialog(posisiId: string) {
    setErrorMessage(null)
    setDialog({ mode: "edit", posisiId })
  }

  function closeDialog() {
    setDialog({ mode: "closed" })
  }

  function submitPosisi(values: PosisiFormValues) {
    if (dialog.mode === "closed") return

    if (dialog.mode === "create") {
      const target = dialog.target
      const node: StrukturPosisiAdmin = {
        id: createTempId("posisi"),
        parentId: null,
        jabatan: values.jabatan,
        nama: values.dosenId ? null : values.nama,
        ...resolveDosenFields(values.dosenId, dosenOptions),
        level: 1,
        jalur: values.jalur,
        urutan: 0,
        jarakKosong: values.jalur === "lurus" ? 0 : values.jarakKosong,
        isKaprodi: false,
        kaprodiInvalid: null,
        tupoksi: [],
      }

      mutate((list) => {
        if (target.kind === "child") return addChild(list, target.parentId, values.jalur, node)
        if (target.kind === "side") return insertSide(list, target.referenceId, target.side, node)
        if (target.kind === "spine") return insertOnSpine(list, target.parentId, target.index, values.jalur, node)
        if (target.kind === "skip") {
          const side = values.jalur === "lurus" ? "kiri" : values.jalur
          return insertAtSkip(list, target.parentId, target.level, target.position, side, node)
        }
        return insertAbove(list, target.referenceId, node)
      })
    } else {
      const posisiId = dialog.posisiId
      mutate((list) => {
        const current = list.find((item) => item.id === posisiId)
        if (!current || current.isKaprodi) return list

        const updated = list.map((item) =>
          item.id === posisiId
            ? {
                ...item,
                jabatan: values.jabatan,
                nama: values.dosenId ? null : values.nama,
                ...resolveDosenFields(values.dosenId, dosenOptions),
              }
            : item,
        )
        return setJalur(updated, posisiId, values.jalur)
      })
    }

    closeDialog()
  }

  function deletePosisiNode(id: string, mode: DeleteMode) {
    mutate((list) => removeNode(list, id, mode))
  }

  function addTupoksi(posisiId: string, isi: string) {
    const tempId = createTempId("tupoksi")
    mutate((list) =>
      list.map((item) =>
        item.id === posisiId
          ? { ...item, tupoksi: [...item.tupoksi, { id: tempId, isi, urutan: item.tupoksi.length }] }
          : item,
      ),
    )
  }

  function updateTupoksiItem(id: string, isi: string) {
    mutate((list) =>
      list.map((item) => ({
        ...item,
        tupoksi: item.tupoksi.map((entry) => (entry.id === id ? { ...entry, isi } : entry)),
      })),
    )
  }

  function deleteTupoksiItem(id: string) {
    mutate((list) =>
      list.map((item) => ({
        ...item,
        tupoksi: item.tupoksi
          .filter((entry) => entry.id !== id)
          .map((entry, index) => ({ ...entry, urutan: index })),
      })),
    )
  }

  function discardDraft() {
    setDraft(saved)
    setIsDirty(false)
    setErrorMessage(null)
  }

  async function commitDraft() {
    setIsSaving(true)
    setErrorMessage(null)

    try {
      const response = await fetch(STRUKTUR_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ posisi: draft.map(toPayload) }),
      })
      const result = await parseResponse<StrukturPosisiAdmin[]>(response)

      if (!result.success || !result.data) {
        throw new Error(result.message ?? "Gagal menyimpan struktur.")
      }

      setSaved(result.data)
      setDraft(result.data)
      setIsDirty(false)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan struktur. Coba lagi.")
    } finally {
      setIsSaving(false)
    }
  }

  return {
    posisi: draft,
    dosenOptions,
    dialog,
    isSaving,
    isDirty,
    errorMessage,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    submitPosisi,
    deletePosisiNode,
    addTupoksi,
    updateTupoksiItem,
    deleteTupoksiItem,
    commitDraft,
    discardDraft,
  }
}