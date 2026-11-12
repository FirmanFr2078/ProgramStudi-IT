import Link from "next/link"

import { prodiStats } from "@/config/stats"
import { Reveal } from "@/components/landing/reveal"

export function Stats() {
  return (
    <section
      id="prodi-dalam-angka"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16"
    >
      <div className="rounded-3xl border border-border/80 bg-card/40 p-6 sm:p-10 backdrop-blur-sm">
        <Reveal className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
              Prodi dalam Angka
            </span>
            <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
              Teknik Informatika Hari Ini
            </h2>
          </div>
          <p className="text-xs text-muted-foreground/80">
            *Indikator akademik, alumni, dan jejaring aktif prodi.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border/80 pt-8 sm:grid-cols-4 sm:gap-8">
          {prodiStats.map(({ value, label, href }, i) => (
            <Reveal key={href} delay={i * 80}>
              <Link
                href={href}
                className="group flex flex-col gap-1.5 transition-colors"
              >
                <span className="font-heading text-3xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-lime sm:text-4xl md:text-5xl">
                  {value}
                </span>
                <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground sm:text-sm">
                  {label}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}