"use client"

import { useMemo, useState } from "react"

import type { Kabar } from "@/types"
import { Reveal } from "@/components/landing/reveal"
import { KategoriFilter } from "@/components/landing/informasi/filter"
import { KabarCard } from "@/components/landing/informasi/kabar/card"

export function KabarList({
  data,
  initialKategori = "Semua",
}: {
  data: Kabar[]
  initialKategori?: string
}) {
  const [active, setActive] = useState(initialKategori)

  const kategoriList = useMemo(
    () => Array.from(new Set(data.map((d) => d.kategori))),
    [data]
  )

  const filtered =
    active === "Semua" ? data : data.filter((d) => d.kategori === active)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Reveal>
          <KategoriFilter
            kategoriList={kategoriList}
            active={active}
            onChange={setActive}
          />
        </Reveal>
        <p className="text-xs text-muted-foreground">{filtered.length} kabar</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, i) => (
          <Reveal key={item.slug} delay={Math.min(i, 7) * 60} className="h-full">
            <KabarCard kabar={item} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}