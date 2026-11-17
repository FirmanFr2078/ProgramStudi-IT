import { DownloadIcon } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import type { Dokumen } from "@/types"

// Href yang tidak menuju berkas nyata: "#" dan string kosong. Dipakai untuk
// menonaktifkan tombol, bukan mengarahkannya ke atas halaman.
function adaBerkas(url: string) {
  const t = url.trim()
  return t !== "" && t !== "#"
}

export function DokumenList({ items }: { items: Dokumen[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((d) => {
        const bisaUnduh = adaBerkas(d.url)
        return (
          <li
            key={d.id}
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-card p-4 dark:border-white/12",
              d.aktif && "border-primary/40"
            )}
          >
            <div className="min-w-0">
              <p className="font-semibold">{d.label}</p>
              {d.aktif && (
                <span className="mt-1 inline-block text-xs text-primary">
                  Tahun aktif
                </span>
              )}
            </div>

            {bisaUnduh ? (
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "min-h-11 gap-1.5"
                )}
              >
                <DownloadIcon className="size-4" aria-hidden="true" />
                Unduh
              </a>
            ) : (
              <button
                type="button"
                disabled
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "min-h-11 gap-1.5"
                )}
              >
                <DownloadIcon className="size-4" aria-hidden="true" />
                Segera tersedia
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}