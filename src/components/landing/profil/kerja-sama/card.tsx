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
    <div className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 transition-colors hover:border-lime">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lime/10 font-heading text-sm font-extrabold text-lime">
            {initials}
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              {mitra.kategori}
            </p>
            <h3 className="text-sm leading-snug font-bold">{mitra.nama}</h3>
          </div>
        </div>
        <span
          className={cn(
            "mt-1 size-2 shrink-0 rounded-full",
            mitra.berakhir ? "bg-muted-foreground/40" : "bg-lime"
          )}
          title={mitra.berakhir ? "Kerja sama sudah berakhir" : "Kerja sama masih berjalan"}
        />
      </div>

      <p className="text-sm text-muted-foreground">{mitra.ringkasan}</p>

      <div className="flex flex-wrap gap-1.5">
        {tampil.map((l) => (
          <span
            key={l}
            className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-lavender"
          >
            {l}
          </span>
        ))}
        {sisa > 0 && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-muted-foreground">
            +{sisa}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDetail(mitra)}
        className="group mt-auto flex items-center gap-1 text-sm font-medium text-foreground"
      >
        Lihat Detail
        <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </button>
    </div>
  )
}