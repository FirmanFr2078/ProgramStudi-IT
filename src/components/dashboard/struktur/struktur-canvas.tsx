"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"
import { Maximize2Icon, PlusIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react"
import { cn } from "cn"

import type { CreateTarget } from "@/hooks/dashboard/struktur/use-struktur-board"
import { layoutStruktur } from "@/lib/struktur-tree"
import type { StrukturPosisiAdmin } from "@/types"
import { PosisiNode } from "./posisi-node"

const MIN_SCALE = 0.25
const MAX_SCALE = 2

type View = { scale: number; x: number; y: number }

type Props = {
  posisi: StrukturPosisiAdmin[]
  readOnly?: boolean
  /** Warna garis utama. Dashboard: hijau. Landing page: putih. */
  spineColor?: string
  /** Warna garis lainnya. */
  lineColor?: string
  onEdit?: (id: string) => void
  onCreate?: (target: CreateTarget) => void
  /** Konten tambahan di pojok kanan atas / kanan bawah (info, tombol simpan). */
  topRight?: ReactNode
  bottomRight?: ReactNode
  className?: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

const BUTTON_CLASS =
  "flex size-8 items-center justify-center rounded-lg border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary/50 hover:text-primary"

/**
 * Kanvas struktur: posisi kartu & garis dihitung dari struktur (layoutStruktur),
 * jadi sebaris selalu selevel dan garis utama selalu lurus. Yang bisa
 * dilakukan pengguna: geser latar (pan) dan zoom -- bukan menggeser kartu.
 * "Kembalikan tampilan" = zoom pas ke seluruh bagan.
 */
export function StrukturCanvas({
  posisi,
  readOnly = false,
  spineColor = "#22c55e",
  lineColor = "color-mix(in oklab, var(--foreground) 38%, transparent)",
  onEdit,
  onCreate,
  topRight,
  bottomRight,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null)
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)

  const layout = useMemo(() => layoutStruktur(posisi), [posisi])
  const byId = useMemo(() => new Map(posisi.map((item) => [item.id, item])), [posisi])
  const parentIds = useMemo(
    () => new Set(posisi.map((item) => item.parentId).filter((value): value is string => value !== null)),
    [posisi],
  )

  const fit = useCallback(() => {
    const element = containerRef.current
    if (!element || element.clientWidth === 0 || element.clientHeight === 0) return

    const scale = clamp(
      Math.min(1, element.clientWidth / layout.width, element.clientHeight / layout.height),
      MIN_SCALE,
      1,
    )
    setView({
      scale,
      x: (element.clientWidth - layout.width * scale) / 2,
      y: Math.max(0, (element.clientHeight - layout.height * scale) / 2),
    })
  }, [layout.width, layout.height])

  // Pas-kan tampilan saat pertama muncul, saat ukuran bagan berubah, dan saat ukuran kotak berubah.
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    fit()
    const observer = new ResizeObserver(() => fit())
    observer.observe(element)
    return () => observer.disconnect()
  }, [fit])

  const zoomAt = useCallback((factor: number, originX: number, originY: number) => {
    setView((prev) => {
      const scale = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE)
      const ratio = scale / prev.scale
      return { scale, x: originX - (originX - prev.x) * ratio, y: originY - (originY - prev.y) * ratio }
    })
  }, [])

  // Ctrl/Cmd + scroll = zoom (scroll biasa tetap menggulung halaman).
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    function onWheel(event: WheelEvent) {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const rect = (element as HTMLDivElement).getBoundingClientRect()
      zoomAt(event.deltaY < 0 ? 1.1 : 1 / 1.1, event.clientX - rect.left, event.clientY - rect.top)
    }

    element.addEventListener("wheel", onWheel, { passive: false })
    return () => element.removeEventListener("wheel", onWheel)
  }, [zoomAt])

  function zoomFromCenter(factor: number) {
    const element = containerRef.current
    if (!element) return
    zoomAt(factor, element.clientWidth / 2, element.clientHeight / 2)
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    if ((event.target as HTMLElement).closest("[data-no-pan]")) return

    dragRef.current = { startX: event.clientX, startY: event.clientY, originX: view.x, originY: view.y }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsPanning(true)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag) return
    setView((prev) => ({
      ...prev,
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    }))
  }

  function handlePointerEnd() {
    dragRef.current = null
    setIsPanning(false)
  }

  const normalLines = layout.lines.filter((line) => !line.green)
  const greenLines = layout.lines.filter((line) => line.green)

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      className={cn(
        "relative touch-none overflow-hidden select-none",
        isPanning ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
    >
      <div
        className="absolute top-0 left-0"
        style={{
          width: layout.width,
          height: layout.height,
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          transformOrigin: "0 0",
        }}
      >
        <svg width={layout.width} height={layout.height} className="pointer-events-none absolute inset-0 overflow-visible" fill="none">
          {normalLines.map((line) => (
            <path key={line.key} d={line.d} style={{ stroke: lineColor }} strokeWidth={1.75} strokeLinecap="square" />
          ))}
          {greenLines.map((line) => (
            <path key={line.key} d={line.d} style={{ stroke: spineColor }} strokeWidth={2.5} strokeLinecap="square" />
          ))}
        </svg>

        {layout.boxes.map((box) => {
          const item = byId.get(box.id)
          if (!item) return null
          return (
            <div
              key={box.id}
              data-no-pan
              className="absolute"
              style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
            >
              <PosisiNode
                posisi={item}
                hasChildren={parentIds.has(item.id)}
                readOnly={readOnly}
                onEdit={onEdit}
                onCreate={onCreate}
              />
            </div>
          )
        })}

        {/* (+) bulat di garis utama: sisipkan posisi / level baru. Titik "skip" (jarakKosong) dibedakan bentuknya. */}
        {!readOnly &&
          onCreate &&
          layout.spots.map((spot) => (
            <button
              key={spot.key}
              type="button"
              data-no-pan
              title={spot.skip ? "Sisipkan posisi di baris kosong ini" : "Sisipkan posisi di garis ini"}
              aria-label={spot.skip ? "Sisipkan posisi di baris kosong ini" : "Sisipkan posisi di garis ini"}
              onClick={() =>
                spot.skip
                  ? onCreate({ kind: "skip", parentId: spot.skip.parentId, level: spot.skip.level, position: spot.skip.position })
                  : onCreate({ kind: "spine", parentId: spot.parentId, index: spot.index })
              }
              className={cn(
                "absolute flex items-center justify-center rounded-full border-2 shadow-sm transition-transform hover:scale-110",
                spot.skip ? "size-5 border-dashed" : "size-6",
                spot.green
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-muted-foreground/60 bg-background text-muted-foreground hover:text-primary",
              )}
              style={{ left: spot.x - (spot.skip ? 10 : 12), top: spot.y - (spot.skip ? 10 : 12) }}
            >
              <PlusIcon className={spot.skip ? "size-3" : "size-3.5"} />
            </button>
        ))}
      </div>

      <div data-no-pan className="absolute bottom-3 left-3 flex gap-1.5">
        <button type="button" title="Perbesar" aria-label="Perbesar" onClick={() => zoomFromCenter(1.2)} className={BUTTON_CLASS}>
          <ZoomInIcon className="size-4" />
        </button>
        <button type="button" title="Perkecil" aria-label="Perkecil" onClick={() => zoomFromCenter(1 / 1.2)} className={BUTTON_CLASS}>
          <ZoomOutIcon className="size-4" />
        </button>
        <button type="button" title="Kembalikan tampilan" aria-label="Kembalikan tampilan" onClick={fit} className={BUTTON_CLASS}>
          <Maximize2Icon className="size-4" />
        </button>
      </div>

      {topRight && (
        <div data-no-pan className="absolute top-3 right-3">
          {topRight}
        </div>
      )}
      {bottomRight && (
        <div data-no-pan className="absolute right-3 bottom-3 flex gap-2">
          {bottomRight}
        </div>
      )}
    </div>
  )
}