"use client"

import { useState } from "react"
import { cn } from "cn"

import type { MataKuliah } from "@/types"

const SEMESTER = [1, 2, 3, 4, 5, 6, 7, 8]

export function SemesterTable({ items }: { items: MataKuliah[] }) {
  const [semester, setSemester] = useState(1)
  const filtered = items.filter((m) => m.semester === semester)
  const totalSks = filtered.reduce((sum, m) => sum + m.sks, 0)

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto border-b pb-4">
        {SEMESTER.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSemester(s)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              semester === s
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Semester {s}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Belum ada data mata kuliah untuk Semester {semester}.
          </p>
        )}
        {filtered.map((m) => (
          <div
            key={m.kode}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4"
          >
            <div>
              <span className="font-mono text-xs text-muted-foreground">
                {m.kode}
              </span>
              <h3 className="font-semibold">{m.nama}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span
                className={cn(
                  "rounded-full px-2.5 py-1",
                  m.jenis === "Wajib"
                    ? "bg-accent text-lavender"
                    : "border text-muted-foreground"
                )}
              >
                {m.jenis}
              </span>
              <span className="rounded-full border px-2.5 py-1 text-muted-foreground">
                {m.sks} SKS
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 0 && (
        <p className="mt-4 text-right text-sm text-muted-foreground">
          Total:{" "}
          <span className="font-semibold text-foreground">
            {totalSks} SKS
          </span>
        </p>
      )}
    </div>
  )
}