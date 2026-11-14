import Link from "next/link"
import { ArrowDownRightIcon, ArrowUpRightIcon, BookOpenIcon, Code2Icon, UsersIcon } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"
import { siteConfig } from "@/config/site"

const facts = [
  ["Gelar", "Sarjana Komputer"],
  ["Masa studi", "144 SKS"],
  ["Pembelajaran", "MBKM & magang"],
  ["Ruang praktik", "Laboratorium"],
]

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-10 md:pb-20">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal className="relative flex min-h-72 flex-col justify-between overflow-hidden bg-primary p-6 text-primary-foreground sm:p-8 lg:min-h-[31rem] lg:p-10">
            <div className="absolute -right-20 -top-20 size-64 rounded-full border border-primary-foreground/15" aria-hidden="true" />
            <div className="absolute -bottom-28 -left-20 size-72 rounded-full border border-primary-foreground/10" aria-hidden="true" />
            <div className="relative">
              <div className="flex size-12 items-center justify-center rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 font-heading text-lg font-black">TI</div>
              <p className="mt-8 max-w-xs text-sm leading-relaxed text-primary-foreground/75">{siteConfig.faculty}<br />{siteConfig.university}</p>
            </div>
            <div className="relative mt-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">Program sarjana</p>
              <p className="mt-3 max-w-xs font-heading text-2xl font-extrabold leading-tight sm:text-3xl">Teknologi yang dekat dengan kebutuhan manusia.</p>
              <Link href="#prodi-dalam-angka" className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-foreground">Lihat gambaran prodi<ArrowDownRightIcon className="size-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" /></Link>
            </div>
          </Reveal>

          <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14">
            <div>
              <Reveal><p className="text-sm font-semibold text-primary">Teknik Informatika</p></Reveal>
              <Reveal delay={60}><h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl">Belajar membuat teknologi yang bekerja untuk kehidupan nyata.</h1></Reveal>
              <Reveal delay={120}><p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Dari logika komputasi, perangkat lunak, dan data hingga sistem yang digunakan masyarakat dan dunia kerja. Kamu membangun pemahaman lewat teori, praktik, dan proyek yang punya tujuan.</p></Reveal>
            </div>
            <Reveal delay={180} className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <Link href="/informasi/pendaftaran" className={cn(buttonVariants({ size: "lg" }), "group h-11 rounded-lg px-5")}>Informasi pendaftaran<ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
              <Link href="/profil/profil-prodi" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Lihat profil prodi</Link>
            </Reveal>
          </div>
        </div>

        <Reveal delay={120} className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(([label, value], index) => (
            <div key={label} className={cn("flex items-start gap-3 p-5 sm:p-6", index > 0 && "border-t border-border sm:border-l sm:border-t-0")}>
              <div className="mt-0.5 text-primary" aria-hidden="true">{index === 0 ? <BookOpenIcon className="size-4" /> : index === 1 ? <Code2Icon className="size-4" /> : index === 2 ? <UsersIcon className="size-4" /> : <span className="block size-4 rounded-sm border-2 border-current" />}</div>
              <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold text-foreground">{value}</p></div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}