import type { TanggalPenting } from "@/types"

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatRentang(mulai: string, selesai?: string) {
  if (!selesai) return formatTanggal(mulai)
  const a = new Date(mulai)
  const b = new Date(selesai)
  if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()) {
    const bulanTahun = b.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    })
    return `${a.getDate()}–${b.getDate()} ${bulanTahun}`
  }
  return `${formatTanggal(mulai)} – ${formatTanggal(selesai)}`
}

export function TanggalPentingList({ items }: { items: TanggalPenting[] }) {
  return (
    <ol className="flex flex-col divide-y rounded-2xl border">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <span className="font-medium">{item.keterangan}</span>
          <span className="font-mono text-sm text-lavender">
            {formatRentang(item.mulai, item.selesai)}
          </span>
        </li>
      ))}
    </ol>
  )
}