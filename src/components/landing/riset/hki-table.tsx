"use client"

import { useMemo, useState } from "react"

import type { HkiItem } from "@/types"

const PER_PAGE = 10

export function HkiTable({ items }: { items: HkiItem[] }) {
  const tahunList = useMemo(
    () => Array.from(new Set(items.map((i) => i.tahun))).sort((a, b) => b - a),
    [items]
  )
  const [tahun, setTahun] = useState<string>("Semua")
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () =>
      tahun === "Semua" ? items : items.filter((i) => i.tahun === Number(tahun)),
    [items, tahun]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleTahunChange(value: string) {
    setTahun(value)
    setPage(1)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <select
          value={tahun}
          onChange={(e) => handleTahunChange(e.target.value)}
          className="rounded-full border bg-card px-4 py-2 text-sm"
        >
          <option value="Semua">Semua Tahun</option>
          {tahunList.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">{filtered.length} data</p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-160 text-left text-sm">
          <thead>
            <tr className="border-b bg-card text-xs text-muted-foreground uppercase">
              <th className="w-12 px-4 py-3 font-medium">No</th>
              <th className="px-4 py-3 font-medium">Judul Karya</th>
              <th className="px-4 py-3 font-medium">Jenis</th>
              <th className="px-4 py-3 font-medium">Pencipta</th>
              <th className="px-4 py-3 font-medium">Nomor</th>
              <th className="w-20 px-4 py-3 font-medium">Tahun</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Tidak ada data untuk tahun ini.
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
                <td className="px-4 py-3 font-medium">{item.judul}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.jenis}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.pencipta.join(", ")}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {item.nomor}
                </td>
                <td className="px-4 py-3">{item.tahun}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      item.status === "Terdaftar"
                        ? "rounded-full bg-lime/10 px-2 py-0.5 text-xs text-lime"
                        : "rounded-full bg-accent px-2 py-0.5 text-xs text-muted-foreground"
                    }
                  >
                    {item.status}
                  </span>
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