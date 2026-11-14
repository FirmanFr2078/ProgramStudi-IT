import Link from "next/link"

import { prodiStats } from "@/config/stats"
import { Reveal } from "@/components/landing/reveal"
import { CountUp } from "@/components/landing/home/count-up"
import { cn } from "cn"

export function Stats() {
  return (
    <section id="prodi-dalam-angka" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32 md:pb-20 md:pt-36">
      <Reveal className="border-y border-border py-8 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Prodi dalam angka</p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">Komunitas Teknik Informatika.</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">Data ringkas tentang mahasiswa, alumni, dosen, dan mitra prodi.</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4">
          {prodiStats.map(({ value, label, href }, index) => (
            <Link key={href} href={href} className={cn("group min-w-0 py-2 transition-colors hover:text-primary sm:px-5 sm:first:pl-0", index > 0 && "border-l border-border pl-4 sm:pl-5")}>
              <p className="font-heading text-4xl font-extrabold leading-none tracking-[-0.04em] text-foreground transition-colors group-hover:text-primary sm:text-5xl"><CountUp value={value} /></p>
              <p className="mt-3 text-sm text-muted-foreground transition-colors group-hover:text-foreground">{label}</p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  )
}