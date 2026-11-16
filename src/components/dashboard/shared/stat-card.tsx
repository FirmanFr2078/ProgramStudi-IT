import type { LucideIcon } from "lucide-react"
import { cn } from "cn"

type StatCardProps = {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: string // mis. "+12% bulan ini" -- opsional, kosong = ga tampil
  className?: string
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 transition-colors hover:border-lime",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs tracking-[0.25em] text-lavender uppercase">
          {label}
        </p>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </div>

      <p className="mt-3 font-heading text-3xl font-extrabold text-lime">
        {value}
      </p>

      {trend && <p className="mt-1 text-sm text-muted-foreground">{trend}</p>}
    </div>
  )
}