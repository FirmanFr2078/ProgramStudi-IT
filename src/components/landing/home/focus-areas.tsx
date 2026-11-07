import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import { focusAreas } from "@/config/focus-areas"

export function FocusAreas() {
  return (
    <section
      id="bidang-minat"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
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
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 lg:grid-cols-4 lg:grid-rows-2">
        {focusAreas.map(({ name, description, icon: Icon, href, featured }) => (
          <Link
            key={name}
            href={href}
            className={cn(
              "group relative flex flex-col justify-end overflow-hidden rounded-2xl border bg-card p-6 transition-colors hover:border-lime",
              featured
                ? "col-span-2 row-span-2 min-h-56 lg:col-span-2 lg:row-span-2"
                : "min-h-40 lg:col-span-1 lg:row-span-1"
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
        ))}
      </div>
    </section>
  )
}