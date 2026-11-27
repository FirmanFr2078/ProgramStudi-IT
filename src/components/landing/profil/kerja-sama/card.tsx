import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import type { Mitra } from "@/types"

export function MitraCard({
  mitra,
  onDetail,
}: {
  mitra: Mitra
  onDetail: (mitra: Mitra) => void
}) {
  const initials = mitra.nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  const tampil = mitra.lingkup.slice(0, 3)
  const sisa = mitra.lingkup.length - tampil.length

  return (
    <button
      type="button"
      onClick={() => onDetail(mitra)}
      className="group flex w-full flex-col gap-4 rounded-xl border border-black/10 bg-card p-5 text-left transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:border-white/12"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-bold text-primary">
          {initials}
        </span>
        <span className="flex shrink-0 items-center gap-2.5 pt-1">
          <span
            className={cn(
              "size-2 rounded-full",
              mitra.berakhir ? "bg-muted-foreground/40" : "bg-primary"
            )}
            aria-hidden="true"
          />
          <span className="sr-only">{mitra.berakhir ? "Kerja sama sudah berakhir" : "Kerja sama masih berjalan"}</span>
        </span>
      </span>

      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-heading text-sm leading-snug font-bold text-foreground sm:text-base">
          {mitra.nama}
        </span>
        <span className="text-xs text-primary">{mitra.kategori}</span>
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          {tampil.map((l, i) => (
            <span key={l} className="flex items-baseline gap-x-2">
              {i > 0 && <span className="text-border" aria-hidden="true">·</span>}
              {l}
            </span>
          ))}
          {sisa > 0 && <span>+{sisa}</span>}
        </span>
      </span>

      <span className="mt-auto flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-foreground">
        Lihat detail
        <ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </button>
  )
}