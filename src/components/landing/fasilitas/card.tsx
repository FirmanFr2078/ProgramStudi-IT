import Image from "next/image"
import { MapPinIcon, UsersIcon } from "lucide-react"

import type { Fasilitas } from "@/types"

export function FasilitasCard({ item }: { item: Fasilitas }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-black/10 bg-card transition-colors hover:border-primary/40 dark:border-white/12">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-accent">
        {item.foto ? (
          <Image src={item.foto} alt={item.nama} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Foto belum tersedia
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-bold">{item.nama}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinIcon className="size-3.5 shrink-0" aria-hidden="true" />
            {item.lokasi}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">{item.deskripsi}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs">
                  {item.kapasitas && (
                    <span className="flex items-center gap-1 text-primary">
                      <UsersIcon className="size-3" aria-hidden="true" />
                      {item.kapasitas} orang
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    {item.fitur.slice(0, 3).join(" · ")}
                    {item.fitur.length > 3 && ` · +${item.fitur.length - 3} lainnya`}
                  </span>
                </div>
      </div>
    </article>
  )
}