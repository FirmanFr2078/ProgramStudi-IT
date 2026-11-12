import { Reveal } from "@/components/landing/reveal"
import type { VisiMisi as VisiMisiType } from "@/types"

export function VisiMisi({ data }: { data: VisiMisiType }) {
  return (
    <section id="visi-misi" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal className="flex flex-col justify-center gap-4 rounded-3xl border bg-card p-6 sm:p-8">
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Visi
          </p>
          <p className="font-heading text-xl leading-snug font-bold sm:text-2xl">
            “{data.visi}”
          </p>
        </Reveal>

        <Reveal delay={100} className="flex flex-col gap-4 rounded-3xl border p-6 sm:p-8">
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Misi
          </p>
          <ol className="flex flex-col gap-3">
            {data.misi.map((m, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground sm:text-base">
                <span className="font-mono text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}