"use client"

import { useCallback, useEffect, useState } from "react"

import type { DosenAdmin, StrukturArah, StrukturPosisiAdmin } from "@/types"

const POSISI_URL = "/api/dashboard/struktur/posisi"
const TUPOKSI_URL = "/api/dashboard/struktur/tupoksi"
const DOSEN_URL = "/api/dashboard/sdm/dosen"

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

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  return (await response.json()) as ApiResponse<T>
}

export function useStrukturBoard(initialData: StrukturPosisiAdmin[]) {
  const [posisi, setPosisi] = useState<StrukturPosisiAdmin[]>(initialData)
  const [dosenOptions, setDosenOptions] = useState<DosenAdmin[]>([])
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" })
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const response = await fetch(POSISI_URL, { credentials: "include" })
    const result = await parseResponse<StrukturPosisiAdmin[]>(response)
    if (result.success && result.data) setPosisi(result.data)
  }, [])

  useEffect(() => {
    fetch(DOSEN_URL, { credentials: "include" })
      .then((response) => parseResponse<DosenAdmin[]>(response))
      .then((result) => {
        if (result.success && result.data) setDosenOptions(result.data)
      })
      .catch(() => {})
  }, [])

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

  async function submitPosisi(values: { jabatan: string; dosenId: string | null; nama: string | null }) {
    if (dialog.mode === "closed") return

    setIsSaving(true)
    setErrorMessage(null)
    try {
      const response =
        dialog.mode === "create"
          ? await fetch(POSISI_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ referenceId: dialog.referenceId, arah: dialog.arah, ...values }),
            })
          : await fetch(`${POSISI_URL}/${dialog.posisiId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(values),
            })

      const result = await parseResponse<StrukturPosisiAdmin>(response)
      if (!result.success) {
        setErrorMessage(result.message ?? "Gagal menyimpan posisi.")
        return
      }

      await refresh()
      closeDialog()
    } finally {
      setIsSaving(false)
    }
  }

  async function deletePosisiNode(id: string) {
    const response = await fetch(`${POSISI_URL}/${id}`, { method: "DELETE", credentials: "include" })
    const result = await parseResponse<null>(response)
    if (!result.success) {
      setErrorMessage(result.message ?? "Gagal menghapus posisi.")
      return
    }
    await refresh()
  }

  async function movePosisiNode(id: string, posX: number, posY: number) {
    setPosisi((prev) => prev.map((item) => (item.id === id ? { ...item, posX, posY } : item)))
    await fetch(`${POSISI_URL}/${id}/posisi`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ posX, posY }),
    })
  }

  async function addTupoksi(posisiId: string, isi: string) {
    const response = await fetch(TUPOKSI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ posisiId, isi }),
    })
    const result = await parseResponse<unknown>(response)
    if (result.success) await refresh()
    return result
  }

  async function updateTupoksiItem(id: string, isi: string) {
    const response = await fetch(`${TUPOKSI_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isi }),
    })
    const result = await parseResponse<unknown>(response)
    if (result.success) await refresh()
    return result
  }

  async function deleteTupoksiItem(id: string) {
    await fetch(`${TUPOKSI_URL}/${id}`, { method: "DELETE", credentials: "include" })
    await refresh()
  }

  return {
    posisi,
    dosenOptions,
    dialog,
    isSaving,
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
  }
}