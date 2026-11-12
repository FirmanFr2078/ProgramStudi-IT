import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import { focusAreas } from "@/config/focus-areas"
import { Reveal } from "@/components/landing/reveal"

export function FocusAreas() {
  return (
    <section
      id="bidang-minat"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
    >
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Bidang Minat
          </p>
          <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
            Pilih Jalurmu
          </h2>
        </div>
        <Link
          href="/pendidikan/kurikulum"
          className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Lihat kurikulum
          <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:grid-rows-2">
        {focusAreas.map(({ name, description, icon: Icon, href, featured }, i) => (
          <Reveal
            key={name}
            delay={i * 80}
            className={cn(
              featured
                ? "sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2"
                : "lg:col-span-1 lg:row-span-1"
            )}
          >
            <Link
              href={href}
              className={cn(
                "group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border bg-card p-6 transition-colors hover:border-lime",
                featured ? "min-h-56" : "min-h-40"
              )}
            >
              <Icon
                className={cn(
                  "mb-4 text-lavender transition-colors group-hover:text-lime",
                  featured ? "size-10" : "size-7"
                )}
              />
              <h3
                className={cn(
                  "font-bold",
                  featured ? "text-2xl" : "text-base"
                )}
              >
                {name}
              </h3>
              {featured && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}