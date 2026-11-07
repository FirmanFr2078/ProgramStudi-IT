import { DownloadIcon } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import type { Dokumen } from "@/types"

export function DokumenList({ items }: { items: Dokumen[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((d) => (
        <li
          key={d.id}
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4",
            d.aktif && "border-lime/60"
          )}
        >
          <div>
            <p className="font-semibold">{d.label}</p>
            {d.aktif && (
              <span className="mt-1 inline-block rounded-full bg-lime/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-lime uppercase">
                Tahun Aktif
              </span>
            )}
          </div>
          <a
            href={d.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5"
            )}
          >
            <DownloadIcon className="size-3.5" />
            Unduh
          </a>
        </li>
      ))}
    </ul>
  )
}