import type { Alumni, StatusKarier } from "@/types"

const urutanStatus: StatusKarier[] = [
  "Bekerja",
  "Wirausaha",
  "Melanjutkan Studi",
  "Mencari Kerja",
]

export function AlumniSummary({ data }: { data: Alumni[] }) {
  const total = data.length
  const perStatus = urutanStatus.map((status) => ({
    status,
    jumlah: data.filter((a) => a.statusKarier === status).length,
  }))

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <div className="rounded-2xl border bg-card p-4">
        <p className="font-heading text-2xl font-extrabold text-lime">{total}</p>
        <p className="mt-1 text-xs text-muted-foreground">Total Alumni</p>
      </div>
      {perStatus.map(({ status, jumlah }) => (
        <div key={status} className="rounded-2xl border bg-card p-4">
          <p className="font-heading text-2xl font-extrabold">{jumlah}</p>
          <p className="mt-1 text-xs text-muted-foreground">{status}</p>
        </div>
      ))}
    </div>
  )
}