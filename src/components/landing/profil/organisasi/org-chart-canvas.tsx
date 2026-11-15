"use client"

import { useEffect, useRef, useState } from "react"
import { MinusIcon, PlusIcon, RotateCcwIcon } from "lucide-react"

import type { StrukturOrganisasi } from "@/types"
import { cn } from "cn"

function Node({ title, subtitle, accent = false }: { title: string; subtitle?: string; accent?: boolean }) {
  return (
    <div className={cn("w-56 shrink-0 border px-4 py-3 text-center", accent ? "border-primary bg-primary/10" : "border-border bg-card")}>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export function OrgChartCanvas({ data }: { data: StrukturOrganisasi }) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const start = useRef({ x: 0, y: 0 })
  const scrollRef = useRef<HTMLDivElement>(null)

  const zoom = (amount: number) => setScale((current) => Math.min(1.8, Math.max(0.65, Number((current + amount).toFixed(2)))))
  const reset = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
    const el = scrollRef.current
    if (el) el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2)
  }

  // Bagan lebih lebar dari kontainer di layar sempit, jadi scroll dimulai dari tengah.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2)
  }, [data])

  return (
    <div className="relative mt-10 overflow-hidden border border-border bg-muted/20" aria-label="Bagan organisasi yang dapat diperbesar dan digeser">
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 border border-border bg-background p-1">
        <button type="button" aria-label="Perkecil bagan" onClick={() => zoom(-0.1)} className="flex size-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"><MinusIcon className="size-4" /></button>
        <button type="button" aria-label="Kembalikan ukuran bagan" onClick={reset} className="flex size-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"><RotateCcwIcon className="size-4" /></button>
        <button type="button" aria-label="Perbesar bagan" onClick={() => zoom(0.1)} className="flex size-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"><PlusIcon className="size-4" /></button>
      </div>
      <div
        ref={scrollRef}
        role="group"
        tabIndex={0}
        aria-label="Bagan organisasi, gunakan tombol panah untuk menggeser"
        className={`min-h-[28rem] overflow-auto touch-none p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset sm:min-h-[32rem] sm:p-12 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        onWheel={(event) => { event.preventDefault(); zoom(event.deltaY > 0 ? -0.1 : 0.1) }}
        onPointerDown={(event) => { setDragging(true); start.current = { x: event.clientX - offset.x, y: event.clientY - offset.y }; event.currentTarget.setPointerCapture(event.pointerId) }}
        onPointerMove={(event) => { if (dragging) setOffset({ x: event.clientX - start.current.x, y: event.clientY - start.current.y }) }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
        onKeyDown={(event) => {
          const el = scrollRef.current
          if (!el) return
          const step = 80
          const moves: Record<string, () => void> = {
            ArrowLeft: () => { el.scrollLeft -= step },
            ArrowRight: () => { el.scrollLeft += step },
            ArrowUp: () => { el.scrollTop -= step },
            ArrowDown: () => { el.scrollTop += step },
          }
          const move = moves[event.key]
          if (move) { event.preventDefault(); move() }
        }}
      >
        <div className="flex w-max min-w-full justify-center transition-transform duration-150" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: "center top" }}>
          <div className="flex flex-col items-center">
            <p className="text-xs text-muted-foreground">{data.pimpinanFakultas.jabatan}</p>
            <div className="my-3 h-8 w-px bg-border" />
            <Node title={data.ketuaProdi.jabatan} subtitle={data.ketuaProdi.nama} accent />
            <div className="h-8 w-px bg-border" />
            <Node title={data.sekretarisProdi.jabatan} subtitle={data.sekretarisProdi.nama} />
            <div className="h-8 w-px bg-border" />
            <div className="relative flex gap-5 border-t border-border pt-8">
              {data.koordinator.map((position) => (
                <div key={position.id} className="relative">
                  <span className="absolute -top-8 left-1/2 h-8 w-px -translate-x-1/2 bg-border" />
                  <Node title={position.jabatan} />
                </div>
              ))}
            </div>
            <div className="h-8 w-px bg-border" />
            <Node title="Dosen dan tenaga kependidikan" />
          </div>
        </div>
      </div>
      <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">Geser bagan dengan tarik, scroll, atau tombol panah. Gunakan kontrol kanan untuk memperbesar.</p>
    </div>
  )
}
