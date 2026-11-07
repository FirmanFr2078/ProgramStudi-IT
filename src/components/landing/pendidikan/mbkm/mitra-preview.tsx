import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import type { Mitra } from "@/types"

export function MitraPreview({ items }: { items: Mitra[] }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((m) => (
          <span
            key={m.slug}
            className="rounded-full border bg-card px-3 py-1.5 text-sm"
          >
            {m.nama}
          </span>
        ))}
      </div>
      <Link
        href="/profil/kerja-sama"
        className="group mt-4 flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Lihat semua mitra
        <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}