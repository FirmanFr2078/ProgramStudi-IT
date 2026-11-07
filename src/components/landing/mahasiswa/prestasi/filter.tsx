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
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
            active === opt
              ? "border-lime bg-lime/10 text-lime"
              : "text-muted-foreground hover:border-lime/40 hover:text-foreground"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}