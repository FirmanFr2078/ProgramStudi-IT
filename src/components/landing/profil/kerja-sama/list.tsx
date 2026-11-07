"use client"

import { useMemo, useState } from "react"

import type { Mitra } from "@/types"
import { Reveal } from "@/components/landing/reveal"
import { KategoriFilter } from "@/components/landing/profil/kerja-sama/filter"
import { MitraCard } from "@/components/landing/profil/kerja-sama/card"
import { DetailMitraSheet } from "@/components/landing/profil/kerja-sama/detail-sheet"

export function KerjaSamaList({ data }: { data: Mitra[] }) {
  const [active, setActive] = useState("Semua")
  const [selected, setSelected] = useState<Mitra | null>(null)

  const kategoris = useMemo(
    () => Array.from(new Set(data.map((m) => m.kategori))),
    [data]
  )

  const filtered =
    active === "Semua" ? data : data.filter((m) => m.kategori === active)

  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <KategoriFilter kategoris={kategoris} active={active} onChange={setActive} />
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((mitra, i) => (
          <Reveal key={mitra.slug} delay={i * 60}>
            <MitraCard mitra={mitra} onDetail={setSelected} />
          </Reveal>
        ))}
      </div>

      <DetailMitraSheet mitra={selected} onClose={() => setSelected(null)} />
    </div>
  )
}