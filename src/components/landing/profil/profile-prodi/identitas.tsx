import { cn } from "cn"

import { Reveal } from "@/components/landing/reveal"
import type { IdentitasItem } from "@/types"

export function Identitas({ items }: { items: IdentitasItem[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
          Identitas
        </p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
          Identitas Program Studi
        </h2>
      </Reveal>

      <Reveal delay={100} className="mt-10 overflow-hidden rounded-2xl border md:mt-14">
        <dl>
          {items.map(({ label, value }, i) => (
            <div
              key={label}
              className={cn(
                "flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6",
                i !== 0 && "border-t"
              )}
            >
              <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase sm:w-56 sm:shrink-0">
                {label}
              </dt>
              <dd className="text-sm sm:text-base">{value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}