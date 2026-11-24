"use client"

import { cn } from "cn"

export function KategoriFilter({
  kategoriList,
  active,
  onChange,
}: {
  kategoriList: string[]
  active: string
  onChange: (kategori: string) => void
}) {
  const options = ["Semua", ...kategoriList]

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
                          "relative min-h-11 pt-2 pb-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
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