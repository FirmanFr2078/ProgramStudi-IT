import Link from "next/link"

import { focusAreas } from "@/config/focus-areas"
import { Reveal } from "@/components/landing/reveal"

export function FocusAreas() {
  return (
    <section id="bidang-minat" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Bidang minat dan keahlian</p>
        <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Belajar dari fondasi, memilih arah.</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Peminatan membantu mahasiswa menghubungkan mata kuliah, proyek, dan rencana karir tanpa membatasi kemungkinan untuk terus mengeksplorasi.
        </p>
      </Reveal>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {focusAreas.map(({ name, description, href }, i) => (
          <Reveal key={name} delay={i * 70}>
            <Link href={href} className="group grid gap-2 py-5 transition-colors hover:bg-accent/30 sm:grid-cols-[5rem_0.8fr_1.2fr] sm:items-center sm:gap-6 sm:px-4">
              <span className="text-sm tabular-nums text-muted-foreground">0{i + 1}</span>
              <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">{name}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}