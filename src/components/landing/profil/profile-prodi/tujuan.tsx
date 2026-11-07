import { Reveal } from "@/components/landing/reveal"

export function Tujuan({ items }: { items: string[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
          Tujuan
        </p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
          Tujuan Program Studi
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14">
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="flex h-full items-start gap-4 rounded-2xl border bg-card p-5">
              <span className="font-heading text-2xl font-extrabold text-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-muted-foreground sm:text-base">{item}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}