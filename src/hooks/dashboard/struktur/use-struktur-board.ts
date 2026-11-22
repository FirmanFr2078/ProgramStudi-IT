"use client"

import { useEffect, useState } from "react"

import type { DosenAdmin, StrukturArah, StrukturPosisiAdmin } from "@/types"

const POSISI_URL = "/api/dashboard/struktur/posisi"
const TUPOKSI_URL = "/api/dashboard/struktur/tupoksi"
const DOSEN_URL = "/api/dashboard/sdm/dosen"
const GAP_X = 260
const GAP_Y = 180

type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[] | undefined>
}

export type DialogState =
  | { mode: "closed" }
  | { mode: "create"; referenceId: string; arah: StrukturArah }
  | { mode: "edit"; posisiId: string }

// Satu entri = satu aksi yang sudah dilakukan user secara lokal, tapi belum
// dikirim ke server. "Simpan Struktur" nge-replay semua ini berurutan lewat
// endpoint yang sama kayak sebelumnya; "Batal" cukup buang array ini.
type PendingAction =
  | { kind: "create"; tempId: string; referenceId: string; arah: StrukturArah; jabatan: string; dosenId: string | null; nama: string | null }
  | { kind: "update"; id: string; jabatan: string; dosenId: string | null; nama: string | null }
  | { kind: "move"; id: string; posX: number; posY: number }
  | { kind: "delete"; id: string }
  | { kind: "tupoksi-create"; tempId: string; posisiId: string; isi: string }
  | { kind: "tupoksi-update"; id: string; isi: string }
  | { kind: "tupoksi-delete"; id: string }

type BoardState = { draft: StrukturPosisiAdmin[]; actions: PendingAction[] }

let tempCounter = 0
function createTempId(prefix: string) {
  tempCounter += 1
  return `${prefix}-${Date.now()}-${tempCounter}`
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  return (await response.json()) as ApiResponse<T>
}

function descendantIds(list: StrukturPosisiAdmin[], rootId: string): string[] {
  const ids: string[] = []
  let frontier = [rootId]
  while (frontier.length > 0) {
    const children = list.filter((item) => item.parentId !== null && frontier.includes(item.parentId)).map((item) => item.id)
    ids.push(...children)
    frontier = children
  }
  return ids
}

function resolveDosenFields(dosenId: string | null, dosenOptions: DosenAdmin[]) {
  if (!dosenId) return { dosenId: null, dosenNama: null, dosenNidn: null, dosenFoto: null }
  const dosen = dosenOptions.find((item) => item.id === dosenId)
  return { dosenId, dosenNama: dosen?.nama ?? null, dosenNidn: dosen?.nidn ?? null, dosenFoto: dosen?.foto ?? null }
}

/** Preview lokal doang -- server tetap sumber kebenaran akhir pas Simpan. */
function applyCreateLocal(
  list: StrukturPosisiAdmin[],
  dosenOptions: DosenAdmin[],
  action: Extract<PendingAction, { kind: "create" }>,
): StrukturPosisiAdmin[] {
  const reference = list.find((item) => item.id === action.referenceId)
  if (!reference) return list

  const base = {
    id: action.tempId,
    jabatan: action.jabatan,
    nama: action.dosenId ? null : action.nama,
    ...resolveDosenFields(action.dosenId, dosenOptions),
    isKaprodi: false,
    tupoksi: [],
  }

  if (action.arah === "bawah") {
    const siblingCount = list.filter((item) => item.parentId === reference.id).length
    return [
      ...list,
      { ...base, parentId: reference.id, urutan: siblingCount, posX: reference.posX + siblingCount * GAP_X, posY: reference.posY + GAP_Y },
    ]
  }

  if (action.arah === "atas") {
    const descendants = descendantIds(list, reference.id)
    const shifted = list.map((item) =>
      item.id === reference.id
        ? { ...item, parentId: action.tempId, posY: item.posY + GAP_Y }
        : descendants.includes(item.id)
          ? { ...item, posY: item.posY + GAP_Y }
          : item,
    )
    return [...shifted, { ...base, parentId: reference.parentId, urutan: reference.urutan, posX: reference.posX, posY: reference.posY }]
  }

  if (reference.parentId === null) return list

  if (action.arah === "kiri") {
    const shifted = list.map((item) =>
      item.parentId === reference.parentId && item.urutan >= reference.urutan
        ? { ...item, urutan: item.urutan + 1, posX: item.posX + GAP_X }
        : item,
    )
    return [...shifted, { ...base, parentId: reference.parentId, urutan: reference.urutan, posX: reference.posX, posY: reference.posY }]
  }

  const shifted = list.map((item) =>
    item.parentId === reference.parentId && item.urutan > reference.urutan
      ? { ...item, urutan: item.urutan + 1, posX: item.posX + GAP_X }
      : item,
  )
  return [...shifted, { ...base, parentId: reference.parentId, urutan: reference.urutan + 1, posX: reference.posX + GAP_X, posY: reference.posY }]
}

function applyDeleteLocal(list: StrukturPosisiAdmin[], id: string): StrukturPosisiAdmin[] {
  const toRemove = new Set([id, ...descendantIds(list, id)])
  return list.filter((item) => !toRemove.has(item.id))
}

/** Buang create + aksi turunannya kalau kartu yang sama dibuat lalu dihapus lagi dalam draft yang sama. */
function compactActions(actions: PendingAction[]): PendingAction[] {
  const dropped = new Set<string>()
  let changed = true
  while (changed) {
    changed = false
    for (const action of actions) {
      if (action.kind === "delete" && !dropped.has(action.id)) {
        const createdThisDraft = actions.some((item) => item.kind === "create" && item.tempId === action.id)
        if (createdThisDraft) {
          dropped.add(action.id)
          changed = true
        }
      }
      if (action.kind === "create" && dropped.has(action.referenceId) && !dropped.has(action.tempId)) {
        dropped.add(action.tempId)
        changed = true
      }
    }
  }

  return actions.filter((action) => {
    if (action.kind === "create") return !dropped.has(action.tempId)
    if (action.kind === "tupoksi-create") return !dropped.has(action.posisiId)
    if ("id" in action) return !dropped.has(action.id)
    return true
  })
}

export function useStrukturBoard(initialData: StrukturPosisiAdmin[]) {
  const [savedPosisi, setSavedPosisi] = useState<StrukturPosisiAdmin[]>(initialData)
  const [state, setState] = useState<BoardState>({ draft: initialData, actions: [] })
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

  const isDirty = state.actions.length > 0

  function openCreateDialog(referenceId: string, arah: StrukturArah) {
    setErrorMessage(null)
    setDialog({ mode: "create", referenceId, arah })
  }

  function openEditDialog(posisiId: string) {
    setErrorMessage(null)
    setDialog({ mode: "edit", posisiId })
  }

  function closeDialog() {
    setDialog({ mode: "closed" })
  }

  function submitPosisi(values: { jabatan: string; dosenId: string | null; nama: string | null }) {
    if (dialog.mode === "closed") return

    if (dialog.mode === "create") {
      const tempId = createTempId("posisi")
      const action: PendingAction = { kind: "create", tempId, referenceId: dialog.referenceId, arah: dialog.arah, ...values }
      setState((prev) => ({ draft: applyCreateLocal(prev.draft, dosenOptions, action), actions: [...prev.actions, action] }))
    } else {
      const posisiId = dialog.posisiId
      setState((prev) => ({
        draft: prev.draft.map((item) =>
          item.id === posisiId
            ? { ...item, jabatan: values.jabatan, nama: values.dosenId ? null : values.nama, ...resolveDosenFields(values.dosenId, dosenOptions) }
            : item,
        ),
        actions: [...prev.actions, { kind: "update", id: posisiId, ...values }],
      }))
    }
    closeDialog()
  }

  function deletePosisiNode(id: string) {
    setState((prev) => {
      const removedIds = new Set([id, ...descendantIds(prev.draft, id)])
      const survivors = prev.actions.filter((action) => {
        if (action.kind === "delete") return true
        if (action.kind === "create") return !removedIds.has(action.tempId)
        if (action.kind === "tupoksi-create") return !removedIds.has(action.posisiId)
        if ("id" in action) return !removedIds.has(action.id)
        return true
      })
      return { draft: applyDeleteLocal(prev.draft, id), actions: [...survivors, { kind: "delete", id }] }
    })
  }

  function movePosisiNode(id: string, posX: number, posY: number) {
    setState((prev) => ({
      draft: prev.draft.map((item) => (item.id === id ? { ...item, posX, posY } : item)),
      actions: [...prev.actions, { kind: "move", id, posX, posY }],
    }))
  }

  function addTupoksi(posisiId: string, isi: string) {
    const tempId = createTempId("tupoksi")
    setState((prev) => ({
      draft: prev.draft.map((item) =>
        item.id === posisiId ? { ...item, tupoksi: [...item.tupoksi, { id: tempId, isi, urutan: item.tupoksi.length }] } : item,
      ),
      actions: [...prev.actions, { kind: "tupoksi-create", tempId, posisiId, isi }],
    }))
  }

  function updateTupoksiItem(id: string, isi: string) {
    setState((prev) => ({
      draft: prev.draft.map((item) => ({ ...item, tupoksi: item.tupoksi.map((t) => (t.id === id ? { ...t, isi } : t)) })),
      actions: [...prev.actions, { kind: "tupoksi-update", id, isi }],
    }))
  }

  function deleteTupoksiItem(id: string) {
    setState((prev) => ({
      draft: prev.draft.map((item) => ({ ...item, tupoksi: item.tupoksi.filter((t) => t.id !== id) })),
      actions: [...prev.actions, { kind: "tupoksi-delete", id }],
    }))
  }

  function discardDraft() {
    setState({ draft: savedPosisi, actions: [] })
    setErrorMessage(null)
  }

  async function commitDraft() {
    setIsSaving(true)
    setErrorMessage(null)

    const actions = compactActions(state.actions)
    const idMap = new Map<string, string>()
    const resolve = (id: string) => idMap.get(id) ?? id

    try {
      for (const action of actions) {
        if (action.kind === "create") {
          const response = await fetch(POSISI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              referenceId: resolve(action.referenceId),
              arah: action.arah,
              jabatan: action.jabatan,
              dosenId: action.dosenId,
              nama: action.nama,
            }),
          })
          const result = await parseResponse<StrukturPosisiAdmin>(response)
          if (!result.success || !result.data) throw new Error(result.message ?? "Gagal menyimpan posisi baru.")
          idMap.set(action.tempId, result.data.id)
        } else if (action.kind === "update") {
          const response = await fetch(`${POSISI_URL}/${resolve(action.id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ jabatan: action.jabatan, dosenId: action.dosenId, nama: action.nama }),
          })
          const result = await parseResponse<unknown>(response)
          if (!result.success) throw new Error(result.message ?? "Gagal menyimpan perubahan posisi.")
        } else if (action.kind === "move") {
          await fetch(`${POSISI_URL}/${resolve(action.id)}/posisi`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ posX: action.posX, posY: action.posY }),
          })
        } else if (action.kind === "delete") {
          await fetch(`${POSISI_URL}/${resolve(action.id)}`, { method: "DELETE", credentials: "include" })
        } else if (action.kind === "tupoksi-create") {
          const response = await fetch(TUPOKSI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ posisiId: resolve(action.posisiId), isi: action.isi }),
          })
          const result = await parseResponse<{ id: string }>(response)
          if (!result.success) throw new Error(result.message ?? "Gagal menyimpan tupoksi.")
          if (result.data) idMap.set(action.tempId, result.data.id)
        } else if (action.kind === "tupoksi-update") {
          await fetch(`${TUPOKSI_URL}/${resolve(action.id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ isi: action.isi }),
          })
        } else {
          await fetch(`${TUPOKSI_URL}/${resolve(action.id)}`, { method: "DELETE", credentials: "include" })
        }
      }

      const response = await fetch(POSISI_URL, { credentials: "include" })
      const result = await parseResponse<StrukturPosisiAdmin[]>(response)
      if (result.success && result.data) {
        setSavedPosisi(result.data)
        setState({ draft: result.data, actions: [] })
      } else {
        setState((prev) => ({ draft: prev.draft, actions: [] }))
      }
    } catch (error) {
      // Catatan: kalau gagal di tengah, sebagian aksi mungkin sudah kesimpen
      // di server. Reload halaman buat lihat kondisi aktualnya.
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan struktur. Coba lagi.")
    } finally {
      setIsSaving(false)
    }
  }

  return {
    posisi: state.draft,
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
    movePosisiNode,
    addTupoksi,
    updateTupoksiItem,
    deleteTupoksiItem,
    commitDraft,
    discardDraft,
  }
}