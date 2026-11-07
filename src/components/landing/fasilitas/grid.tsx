import { Reveal } from "@/components/landing/reveal"
import { FasilitasCard } from "@/components/landing/fasilitas/card"
import type { Fasilitas } from "@/types"

export function FasilitasGrid({ items }: { items: Fasilitas[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
        Belum ada data untuk kategori ini.
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <Reveal key={item.slug} delay={Math.min(i, 7) * 60} className="h-full">
          <FasilitasCard item={item} />
        </Reveal>
      ))}
    </div>
  )
}