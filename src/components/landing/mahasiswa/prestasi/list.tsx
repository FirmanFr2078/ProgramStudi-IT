"use client"

import { useMemo, useState } from "react"

import type { Prestasi } from "@/types"
import { Reveal } from "@/components/landing/reveal"
import { TingkatFilter } from "@/components/landing/mahasiswa/prestasi/filter"
import { PrestasiCard } from "@/components/landing/mahasiswa/prestasi/card"

export function PrestasiList({ data }: { data: Prestasi[] }) {
  const [active, setActive] = useState("Semua")

  const tingkatList = useMemo(
    () => Array.from(new Set(data.map((d) => d.tingkat))),
    [data]
  )

  const filtered =
    active === "Semua" ? data : data.filter((d) => d.tingkat === active)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Reveal>
          <TingkatFilter
            tingkatList={tingkatList}
            active={active}
            onChange={setActive}
          />
        </Reveal>
        <p className="text-xs text-muted-foreground">{filtered.length} prestasi</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, i) => (
          <Reveal key={item.id} delay={Math.min(i, 7) * 60} className="h-full">
            <PrestasiCard item={item} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}