"use client"

import { useCallback, useEffect, useState } from "react"

import type { DosenAdmin } from "@/types"

type ListResponse = { success: boolean; data?: DosenAdmin[]; message?: string }
type DeleteResponse = { success: boolean; message?: string }

const ENDPOINT = "/api/dashboard/sdm/dosen"

async function requestList(signal?: AbortSignal): Promise<DosenAdmin[]> {
  const response = await fetch(ENDPOINT, { credentials: "include", signal })
  const result = (await response.json()) as ListResponse

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? "Gagal memuat daftar dosen.")
  }
  return result.data ?? []
}

export function useDosenList() {
  const [data, setData] = useState<DosenAdmin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      setData(await requestList())
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan saat memuat dosen.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    requestList(controller.signal)
      .then((items) => setData(items))
      .catch((error) => {
        if (controller.signal.aborted) return
        setErrorMessage(
          error instanceof Error ? error.message : "Terjadi kesalahan saat memuat dosen.",
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  async function deleteDosen(id: string) {
    setDeletingId(id)
    setErrorMessage(null)

    try {
      const response = await fetch(`${ENDPOINT}/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const result = (await response.json()) as DeleteResponse

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal menghapus data dosen.")
      }

      setData((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus.",
      )
    } finally {
      setDeletingId(null)
    }
  }

  return { data, isLoading, errorMessage, deletingId, deleteDosen, refresh }
}