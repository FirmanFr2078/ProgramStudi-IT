import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { UserIcon } from "lucide-react"

type CardFooterRowProps = {
  label: ReactNode
  icon?: LucideIcon
  actions?: ReactNode
}

export function CardFooterRow({ label, icon: Icon = UserIcon, actions }: CardFooterRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-t px-(--card-spacing) py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-3" />
        </span>
        <span className="truncate text-xs text-muted-foreground">{label}</span>
      </div>
      {actions && <div className="flex shrink-0 items-center">{actions}</div>}
    </div>
  )
}