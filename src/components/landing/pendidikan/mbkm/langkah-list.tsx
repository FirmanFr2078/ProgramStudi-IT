import type { LangkahMbkm } from "@/types"

export function LangkahList({ items }: { items: LangkahMbkm[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map(({ id, judul, deskripsi }) => (
        <div key={id}>
          <span className="font-heading text-3xl font-extrabold text-lime">
            {id.padStart(2, "0")}
          </span>
          <h3 className="mt-2 font-semibold">{judul}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{deskripsi}</p>
        </div>
      ))}
    </div>
  )
}