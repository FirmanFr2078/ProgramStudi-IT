"use client"

import { cn } from "cn"

export function TingkatFilter({
  tingkatList,
  active,
  onChange,
}: {
  tingkatList: string[]
  active: string
  onChange: (tingkat: string) => void
}) {
  const options = ["Semua", ...tingkatList]

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-black/10 dark:border-white/12">
      {options.map((opt) => {
        const isActive = active === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "relative pb-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              isActive
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt}
            <span
              className={cn(
                "absolute inset-x-0 bottom-0 h-0.5 transition-colors",
                isActive ? "bg-primary" : "bg-transparent"
              )}
              aria-hidden="true"
            />
          </button>
        )
      })}
    </div>
  )
}