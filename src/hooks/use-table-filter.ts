"use client"

import { useMemo, useState } from "react"

type UseTableFilterOptions<T> = {
  data: T[]
  // Field-field yang ikut dicocokkan ke kata kunci pencarian.
  searchableFields: (item: T) => string[]
}

/**
 * Pencarian client-side generik. Cocok dipakai karena data per modul
 * (dosen, kabar, dst) jumlahnya ga sampai ribuan baris -- filter di
 * server baru perlu kalau nanti datanya udah sangat banyak.
 */
export function useTableFilter<T>({ data, searchableFields }: UseTableFilterOptions<T>) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return data

    return data.filter((item) =>
      searchableFields(item).some((field) => field.toLowerCase().includes(keyword))
    )
  }, [data, query, searchableFields])

  return { query, setQuery, filtered }
}