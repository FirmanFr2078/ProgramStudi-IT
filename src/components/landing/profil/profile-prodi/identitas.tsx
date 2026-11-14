import { cn } from "cn"

import { Reveal } from "@/components/landing/reveal"
import type { IdentitasItem } from "@/types"

export function Identitas({ items }: { items: IdentitasItem[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal>
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          Identitas
        </span>
        <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
          Identitas Program Studi
        </h2>
      </Reveal>

      <Reveal delay={100} className="mt-8 border-y border-border">
        <dl>
          {items.map(({ label, value }, i) => (
            <div key={label} className={cn("grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6", i !== 0 && "border-t border-border")}>
              <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
              <dd className="text-sm text-foreground sm:text-base">{value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}