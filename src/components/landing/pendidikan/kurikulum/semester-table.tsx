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
      <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-black/10 dark:border-white/12">
        {SEMESTER.map((s) => {
          const isActive = semester === s
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSemester(s)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative min-h-11 pt-2 pb-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                isActive
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Semester {s}
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 transition-colors",
                  isActive ? "bg-primary" : "bg-transparent"
                )}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted-foreground">
          Semester {semester} ·{" "}
          <span className="font-semibold text-foreground">{totalSks} SKS</span>
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Belum ada data mata kuliah untuk Semester {semester}.
          </p>
        )}
        {filtered.map((m) => (
          <div
            key={m.kode}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-card p-4 dark:border-white/12"
          >
            <div className="min-w-0">
              <span className="font-mono text-xs text-muted-foreground">
                {m.kode}
              </span>
              <h3 className="font-semibold">{m.nama}</h3>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs">
              <span
                className={cn(
                  "text-xs",
                  m.jenis === "Wajib"
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                {m.jenis}
              </span>
              <span className="text-muted-foreground">{m.sks} SKS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}