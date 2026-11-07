import { TrophyIcon } from "lucide-react"
import { cn } from "cn"

import type { Prestasi, TingkatPrestasi } from "@/types"

const tingkatStyle: Record<TingkatPrestasi, string> = {
  Internasional: "bg-lime/10 text-lime",
  Nasional: "bg-lavender/10 text-lavender",
  Provinsi: "bg-accent text-foreground",
  Kampus: "bg-accent text-muted-foreground",
}

export function PrestasiCard({ item }: { item: Prestasi }) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-6 transition-colors hover:border-lime">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            tingkatStyle[item.tingkat]
          )}
        >
          {item.tingkat}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {item.tahun}
        </span>
      </div>

      <div className="flex items-start gap-2">
        <TrophyIcon className="mt-0.5 size-5 shrink-0 text-lime" />
        <p className="text-sm font-bold">{item.peringkat}</p>
      </div>

      <h3 className="text-sm leading-snug font-semibold">{item.judul}</h3>
      <p className="text-xs text-muted-foreground">{item.penyelenggara}</p>

      <div className="mt-auto flex flex-col gap-1 border-t pt-3 text-xs text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Mahasiswa:</span>{" "}
          {item.mahasiswa.join(", ")}
        </p>
        {item.pembimbing && (
          <p>
            <span className="font-medium text-foreground">Pembimbing:</span>{" "}
            {item.pembimbing}
          </p>
        )}
      </div>
    </div>
  )
}