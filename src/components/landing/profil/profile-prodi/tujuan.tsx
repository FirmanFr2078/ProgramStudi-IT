import { Reveal } from "@/components/landing/reveal"

export function Tujuan({ items }: { items: string[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal>
        <span className="text-sm font-medium text-primary">
          Tujuan
        </span>
        <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
          Tujuan program studi
        </h2>
      </Reveal>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="grid gap-3 py-5 sm:grid-cols-[5rem_1fr] sm:items-start">
              <span className="font-mono text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{item}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}