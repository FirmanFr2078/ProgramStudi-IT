import Link from "next/link"
import { cn } from "cn"

import type { Kabar } from "@/types"
import { formatTanggal } from "@/lib/utils"

export function KabarCard({ kabar }: { kabar: Kabar }) {
  return (
    <Link
      href={`/informasi/kabar/${kabar.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-black/10 bg-card transition-colors hover:border-primary/40 dark:border-white/12"
    >
      <div
              className="h-36 w-full bg-muted"
              style={
                kabar.gambar
                  ? {
                      backgroundImage: `url(${kabar.gambar})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span
          className={cn(
            "w-fit rounded-full px-2.5 py-1 text-xs",
            kabar.kategori === "Pengumuman"
              ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
          )}
        >
          {kabar.kategori}
        </span>
        <h3 className="font-bold leading-snug">{kabar.judul}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {kabar.ringkasan}
        </p>
        <p className="mt-auto pt-2 text-xs text-muted-foreground">
          {formatTanggal(kabar.tanggal)}
        </p>
      </div>
    </Link>
  )
}