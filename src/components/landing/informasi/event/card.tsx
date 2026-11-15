import Link from "next/link"
import { MapPinIcon } from "lucide-react"
import { cn } from "cn"

import type { Event } from "@/types"

function hitungSelisihHari(iso: string) {
  const hariIni = new Date()
  hariIni.setHours(0, 0, 0, 0)
  const target = new Date(iso)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - hariIni.getTime()) / 86_400_000)
}

function labelCountdown(iso: string) {
  const selisih = hitungSelisihHari(iso)
  if (selisih === 0) return "Hari Ini"
  if (selisih === 1) return "Besok"
  if (selisih > 1) return `H-${selisih}`
  return null
}

export function EventCard({
  event,
  akanDatang,
}: {
  event: Event
  akanDatang: boolean
}) {
  const tanggal = new Date(event.tanggalMulai)
  const countdown = akanDatang ? labelCountdown(event.tanggalMulai) : null

  return (
    <Link
      href={`/informasi/event/${event.slug}`}
      className={cn(
        "group flex items-center gap-4 rounded-xl border border-black/10 bg-card p-4 transition-colors hover:border-primary/40 dark:border-white/12",
        !akanDatang && "opacity-70 grayscale-[0.4] hover:opacity-100 hover:grayscale-0"
      )}
    >
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl border bg-background py-2">
        <span className="font-heading text-2xl font-extrabold leading-none">
          {tanggal.getDate()}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          {tanggal.toLocaleDateString("id-ID", { month: "short" })}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            {event.kategori}
          </span>
          {countdown && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
              {countdown}
            </span>
          )}
        </div>
        <h3 className="mt-1.5 truncate font-bold">{event.judul}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPinIcon className="size-3 shrink-0" />
          <span className="truncate">{event.lokasi}</span>
        </p>
      </div>
    </Link>
  )
}