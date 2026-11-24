"use client"

import { useMemo, useState } from "react"
import { cn } from "cn"

import { HARI_URUT, type JadwalItem } from "@/types"

export function DaySchedule({ items }: { items: JadwalItem[] }) {
  const kelasList = useMemo(
    () => Array.from(new Set(items.map((i) => i.kelas))).sort(),
    [items]
  )
  const [hari, setHari] = useState(HARI_URUT[0])
  const [kelas, setKelas] = useState("Semua")

  const filtered = items
    .filter((i) => i.hari === hari)
    .filter((i) => kelas === "Semua" || i.kelas === kelas)
    .sort((a, b) => a.jamMulai.localeCompare(b.jamMulai))

  return (
    <div>
      <div className="flex flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
        <div className="flex min-w-0 shrink-0 items-center gap-x-4 sm:gap-x-6">
          {HARI_URUT.map((h) => {
          const isActive = hari === h
          return (
            <button
              key={h}
              type="button"
              onClick={() => setHari(h)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative min-h-11 pt-2 pb-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                isActive
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {h}
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
        <select
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
          aria-label="Pilih kelas"
          className="ml-auto min-h-11 shrink-0 self-start rounded-full border bg-card px-4 py-2 text-sm sm:self-auto"
        >
          <option value="Semua">Semua Kelas</option>
          {kelasList.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Tidak ada jadwal untuk {hari}
            {kelas !== "Semua" && `, ${kelas}`}.
          </p>
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-baseline gap-3">
              <span className="w-28 shrink-0 font-mono text-sm text-muted-foreground">
                {item.jamMulai}–{item.jamSelesai}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{item.mataKuliah}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.dosen} · {item.sks} SKS
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs">
              <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                {item.kelas}
              </span>
              <span className="rounded-full border px-2.5 py-1 text-muted-foreground">
                {item.ruang}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}