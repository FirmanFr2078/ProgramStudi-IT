import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { prodiStats } from "@/config/stats"

export function Stats() {
  return (
    <section
      id="prodi-dalam-angka"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
    >
      <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
        Prodi dalam Angka
      </p>
      <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
        Teknik Informatika Hari Ini
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-6 border-t sm:grid-cols-4 md:mt-14">
        {prodiStats.map(({ value, label, href }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-1 border-b pt-6 transition-colors hover:border-b-lime sm:border-r sm:border-b-0 sm:pr-4 sm:last:border-r-0"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-4xl font-extrabold sm:text-5xl">
                {value}
              </span>
              <ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime" />
            </div>
            <span className="text-sm text-muted-foreground">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}