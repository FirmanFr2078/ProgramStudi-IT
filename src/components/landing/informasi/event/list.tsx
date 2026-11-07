"use client"

import { useMemo, useState } from "react"

import type { Event } from "@/types"
import { Reveal } from "@/components/landing/reveal"
import { KategoriFilter } from "@/components/landing/informasi/filter"
import { EventCard } from "@/components/landing/informasi/event/card"

export function EventList({
  data,
  initialKategori = "Semua",
}: {
  data: Event[]
  initialKategori?: string
}) {
  const [active, setActive] = useState(initialKategori)

  const kategoriList = useMemo(
    () => Array.from(new Set(data.map((d) => d.kategori))),
    [data]
  )

  const filtered = useMemo(
    () => (active === "Semua" ? data : data.filter((d) => d.kategori === active)),
    [data, active]
  )

  const { akanDatang, sudahBerlalu } = useMemo(() => {
    const hariIni = new Date()
    hariIni.setHours(0, 0, 0, 0)
    const akan: Event[] = []
    const lalu: Event[] = []
    for (const e of filtered) {
      const tanggal = new Date(e.tanggalMulai)
      tanggal.setHours(0, 0, 0, 0)
      if (tanggal >= hariIni) akan.push(e)
      else lalu.push(e)
    }
    akan.sort((a, b) => a.tanggalMulai.localeCompare(b.tanggalMulai))
    lalu.sort((a, b) => b.tanggalMulai.localeCompare(a.tanggalMulai))
    return { akanDatang: akan, sudahBerlalu: lalu }
  }, [filtered])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Reveal>
          <KategoriFilter
            kategoriList={kategoriList}
            active={active}
            onChange={setActive}
          />
        </Reveal>
        <p className="text-xs text-muted-foreground">{filtered.length} event</p>
      </div>

      <div>
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Akan Datang
        </h2>
        <div className="mt-5 flex flex-col gap-3">
          {akanDatang.length === 0 && (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              Belum ada event mendatang untuk kategori ini.
            </p>
          )}
          {akanDatang.map((e, i) => (
            <Reveal key={e.slug} delay={Math.min(i, 7) * 60}>
              <EventCard event={e} akanDatang />
            </Reveal>
          ))}
        </div>
      </div>

      {sudahBerlalu.length > 0 && (
        <div>
          <h2 className="font-heading text-xl font-bold sm:text-2xl">
            Sudah Berlalu
          </h2>
          <div className="mt-5 flex flex-col gap-3">
            {sudahBerlalu.map((e, i) => (
              <Reveal key={e.slug} delay={Math.min(i, 7) * 60}>
                <EventCard event={e} akanDatang={false} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}