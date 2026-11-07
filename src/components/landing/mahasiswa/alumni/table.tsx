"use client"

import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import type { Alumni } from "@/types"

const PER_PAGE = 15

const statusStyle: Record<string, string> = {
  Bekerja: "bg-lime/10 text-lime",
  Wirausaha: "bg-lavender/10 text-lavender",
  "Melanjutkan Studi": "bg-accent text-foreground",
  "Mencari Kerja": "bg-accent text-muted-foreground",
}

export function AlumniTable({ items }: { items: Alumni[] }) {
  const tahunList = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.tahunLulus))).sort((a, b) => b - a),
    [items]
  )
  const [tahun, setTahun] = useState<string>("Semua")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((i) => {
      const cocokTahun = tahun === "Semua" || i.tahunLulus === Number(tahun)
      const cocokQuery =
        q === "" ||
        i.nama.toLowerCase().includes(q) ||
        i.pekerjaan?.toLowerCase().includes(q)
      return cocokTahun && cocokQuery
    })
  }, [items, tahun, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleTahunChange(value: string) {
    setTahun(value)
    setPage(1)
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    setPage(1)
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Cari nama atau instansi…"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={tahun}
            onChange={(e) => handleTahunChange(e.target.value)}
            className="rounded-full border bg-card px-4 py-2 text-sm"
          >
            <option value="Semua">Semua Angkatan</option>
            {tahunList.map((t) => (
              <option key={t} value={t}>
                Lulus {t}
              </option>
            ))}
          </select>
          <p className="shrink-0 text-xs text-muted-foreground">
            {filtered.length} alumni
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-160 text-left text-sm">
          <thead>
            <tr className="border-b bg-card text-xs text-muted-foreground uppercase">
              <th className="w-12 px-4 py-3 font-medium">No</th>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">NIM</th>
              <th className="w-24 px-4 py-3 font-medium">Lulus</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Karier / Instansi</th>
            </tr>
          </thead>
          <tbody>
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Tidak ada alumni yang cocok dengan pencarian.
                </td>
              </tr>
            )}
            {current.map((item, i) => (
              <tr
                key={item.id}
                className="border-b last:border-b-0 even:bg-card/40"
              >
                <td className="px-4 py-3 text-muted-foreground">
                  {(page - 1) * PER_PAGE + i + 1}
                </td>
                <td className="px-4 py-3 font-medium">{item.nama}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {item.nim}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.tahunLulus}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${statusStyle[item.statusKarier]}`}
                  >
                    {item.statusKarier}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.pekerjaan ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-full border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  )
}