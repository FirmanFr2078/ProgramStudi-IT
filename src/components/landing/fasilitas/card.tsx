import Image from "next/image"
import { MapPinIcon, UsersIcon } from "lucide-react"

import type { Fasilitas } from "@/types"

export function FasilitasCard({ item }: { item: Fasilitas }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-lime">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-accent">
        {item.foto ? (
          <Image src={item.foto} alt={item.nama} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
            Foto belum tersedia
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-bold">{item.nama}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="size-3.5 shrink-0" />
            {item.lokasi}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">{item.deskripsi}</p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {item.kapasitas && (
            <span className="flex items-center gap-1 rounded-full bg-lime/10 px-2.5 py-1 text-[11px] font-medium text-lime">
              <UsersIcon className="size-3" />
              {item.kapasitas} orang
            </span>
          )}
          {item.fitur.slice(0, 3).map((f) => (
            <span
              key={f}
              className="rounded-full bg-accent px-2.5 py-1 text-[11px] text-lavender"
            >
              {f}
            </span>
          ))}
          {item.fitur.length > 3 && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] text-muted-foreground">
              +{item.fitur.length - 3}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}