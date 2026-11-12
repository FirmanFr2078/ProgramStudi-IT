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
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Bidang Minat
          </span>
          <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
            Pilih Jalur Minatmu
          </h2>
        </div>
        <Link
          href="/pendidikan/kurikulum"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Lihat kurikulum lengkap
        </Link>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-12">
        {focusAreas.map(({ name, description, icon: Icon, href, featured }, i) => (
          <Reveal key={name} delay={i * 60}>
            <Link
              href={href}
              className={cn(
                "group flex h-full flex-col justify-between rounded-2xl border p-6 transition-all duration-200 hover:border-lime/70 hover:shadow-[0_0_20px_-3px_rgba(198,255,51,0.2)]",
                featured ? "bg-card/90 border-lime/30" : "bg-card/50"
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <Icon className="size-8 text-lime transition-transform group-hover:scale-105" />
                  {featured && (
                    <span className="rounded-full bg-lime/10 px-2.5 py-0.5 text-[10px] font-semibold text-lime">
                      Unggulan
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">
                  {name}
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}