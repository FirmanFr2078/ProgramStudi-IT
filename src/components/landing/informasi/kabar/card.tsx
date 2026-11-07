import Link from "next/link"
import { cn } from "cn"

import type { Kabar } from "@/types"
import { formatTanggal } from "@/lib/utils"

export function KabarCard({ kabar }: { kabar: Kabar }) {
  return (
    <Link
      href={`/informasi/kabar/${kabar.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-lime"
    >
      <div
        className="h-36 w-full"
        style={
          kabar.gambar
            ? {
                backgroundImage: `url(${kabar.gambar})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                backgroundImage:
                  "radial-gradient(60% 60% at 30% 20%, color-mix(in oklab, var(--c-lilac) 16%, transparent), transparent)",
                backgroundColor: "var(--accent)",
              }
        }
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span
          className={cn(
            "w-fit rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase",
            kabar.kategori === "Pengumuman"
              ? "bg-lime/10 text-lime"
              : "bg-accent text-lavender"
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