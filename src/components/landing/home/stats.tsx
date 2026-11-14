import Link from "next/link"

import { prodiStats } from "@/config/stats"
import { Reveal } from "@/components/landing/reveal"

export function Stats() {
  return (
    <section id="prodi-dalam-angka" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal className="grid gap-8 border-y border-border py-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Prodi dalam angka</p>
          <h2 className="mt-2 max-w-sm font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
            Gambaran singkat komunitas kami.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Angka berikut adalah indikator yang tersedia dari data prodi dan dapat berkembang seiring pembaruan akademik.
          </p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y divide-border border-l border-t border-border sm:grid-cols-4 sm:divide-y-0">
          {prodiStats.map(({ value, label, href }) => (
            <Link key={href} href={href} className="group flex min-h-28 min-w-0 flex-col justify-between p-4 transition-colors hover:bg-accent/40 sm:min-h-32 sm:p-5">
              <p className="font-heading text-3xl font-extrabold leading-none tracking-tight text-foreground sm:text-4xl">{value}</p>
              <p className="mt-5 text-xs leading-snug text-muted-foreground transition-colors group-hover:text-foreground sm:text-sm">{label}</p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  )
}