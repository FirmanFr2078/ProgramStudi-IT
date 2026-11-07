import type { BentukKegiatan } from "@/types"

export function BentukKegiatanGrid({ items }: { items: BentukKegiatan[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map(({ id, nama, icon: Icon }) => (
        <div
          key={id}
          className="flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center"
        >
          <Icon className="size-6 text-lavender" />
          <span className="text-sm font-medium">{nama}</span>
        </div>
      ))}
    </div>
  )
}