import type { LangkahMbkm } from "@/types"

export function LangkahList({ items }: { items: LangkahMbkm[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map(({ id, judul, deskripsi }) => (
        <div key={id} className="flex gap-4">
          <span
            className="font-mono text-sm font-semibold text-primary"
            aria-hidden="true"
          >
            {id.padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold">{judul}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{deskripsi}</p>
          </div>
        </div>
      ))}
    </div>
  )
}