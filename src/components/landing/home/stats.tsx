import Link from "next/link"
import { cn } from "cn"

import { prodiStats } from "@/config/stats"
import { Reveal } from "@/components/landing/reveal"

export function Stats() {
  return (
    <section
      id="prodi-dalam-angka"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16"
    >
      <Reveal>
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          Prodi dalam Angka
        </span>
        <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
          Teknik Informatika Hari Ini
        </h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4 sm:gap-6 md:mt-12">
        {prodiStats.map(({ value, label, href }, i) => (
          <Reveal key={href} delay={i * 80}>
            <Link
              href={href}
              className={cn(
                "group flex h-full flex-col justify-between rounded-xl p-3 transition-colors hover:bg-card/50 sm:p-4",
                i !== prodiStats.length - 1 && "sm:border-r sm:border-border"
              )}
            >
              <span className="font-heading text-3xl font-extrabold text-foreground transition-colors group-hover:text-lime sm:text-4xl md:text-5xl">
                {value}
              </span>
              <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {label}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}