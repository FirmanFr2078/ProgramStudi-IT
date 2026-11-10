"use client"

import { useState } from "react"

type UsePaginationOptions = {
  totalItems: number
  pageSize?: number
}

/**
 * Generik buat semua tabel dashboard. Ga nyimpen data apapun -- cuma
 * ngitung batas index, dipakai bareng data yang udah difilter duluan
 * lewat useTableFilter.
 */
export function usePagination({ totalItems, pageSize = 10 }: UsePaginationOptions) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  // Kalau data abis difilter jadi lebih sedikit dan halaman sekarang ga
  // valid lagi, tampilin halaman terakhir yang valid (tanpa setState di
  // render -- biar ga kena warning React).
  const safePage = Math.min(page, totalPages)

  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  return {
    page: safePage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    goToPage: (next: number) => setPage(Math.min(Math.max(1, next), totalPages)),
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    reset: () => setPage(1),
  }
}