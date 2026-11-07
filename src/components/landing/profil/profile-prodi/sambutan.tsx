import { QuoteIcon } from "lucide-react"

import type { Sambutan as SambutanType } from "@/types"
import { Reveal } from "@/components/landing/reveal"

export function Sambutan({ data }: { data: SambutanType }) {
  const initials = data.nama
    .replace(/[[\]]/g, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal className="grid gap-8 rounded-3xl border bg-card p-6 sm:p-10 md:grid-cols-[auto_1fr] md:items-start">
        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-lime/10 font-heading text-2xl font-extrabold text-lime">
            {initials}
          </div>
          <div className="md:mt-1">
            <p className="font-bold">{data.nama}</p>
            <p className="text-sm text-muted-foreground">{data.jabatan}</p>
          </div>
        </div>

        <div className="relative pl-8">
          <QuoteIcon className="absolute -top-2 left-0 size-8 text-lime/20" />
          <p className="mb-3 font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Sambutan
          </p>
          <div className="flex flex-col gap-4">
            {data.isi.map((p, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}