import Link from "next/link"
import { cn } from "cn"

import { focusAreas } from "@/config/focus-areas"
import { Reveal } from "@/components/landing/reveal"

export function FocusAreas() {
  return (
    <section
      id="bidang-minat"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16"
    >
      <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Peminatan Akademik
          </span>
          <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl md:text-4xl">
            Bidang Minat & Keahlian
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Mulai semester 4–5, mahasiswa dapat memilih fokus peminatan sesuai minat karir dan arah riset teknologi.
          </p>
        </div>
        <Link
          href="/pendidikan/kurikulum"
          className="text-sm font-semibold text-primary transition-colors hover:text-foreground"
        >
          Lihat Struktur Kurikulum →
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {focusAreas.map(({ name, description, icon: Icon, href, featured }, i) => (
          <Reveal key={name} delay={i * 70}>
            <Link
              href={href}
              className={cn(
                "group relative flex h-full flex-col justify-between rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur-sm transition-all duration-200 hover:border-lime/60 hover:bg-card/80 hover:shadow-lg hover:shadow-lime/5",
                featured && "border-lime/30 bg-card/70"
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    0{i + 1}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-lime/10 text-lime transition-transform duration-200 group-hover:scale-110">
                    <Icon className="size-5" />
                  </div>
                </div>
                <h3 className="mt-6 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-lime">
                  {name}
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {description}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}