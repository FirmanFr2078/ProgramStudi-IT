import { Reveal } from "@/components/landing/reveal"
import type { VisiMisi as VisiMisiType } from "@/types"

export function VisiMisi({ data }: { data: VisiMisiType }) {
  return (
    <section id="visi-misi" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <div className="grid gap-10 border-y border-border py-8 sm:py-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <Reveal className="flex flex-col justify-center gap-4">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">Visi</span>
          <p className="max-w-xl font-heading text-xl leading-snug font-bold sm:text-2xl">{data.visi}</p>
        </Reveal>

        <Reveal delay={100} className="flex flex-col gap-4 md:border-l md:border-border md:pl-10">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">Misi</span>
          <ol className="flex flex-col divide-y divide-border">
            {data.misi.map((m, i) => (
              <li key={i} className="flex gap-4 py-3 text-sm text-muted-foreground sm:text-base">
                <span className="font-mono text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span>{m}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}