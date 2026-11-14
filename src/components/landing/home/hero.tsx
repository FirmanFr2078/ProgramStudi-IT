import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"
import { siteConfig } from "@/config/site"

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 md:pb-20">
      <div className="border-b border-border pb-10 sm:pb-14">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-16">
          <div>
            <Reveal><p className="text-sm font-semibold text-primary">Program Studi Teknik Informatika</p></Reveal>
            <Reveal delay={60}><h1 className="mt-5 max-w-4xl font-heading text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">Mulai dari rasa ingin tahu. Bangun sesuatu yang berguna.</h1></Reveal>
          </div>
          <Reveal delay={120}><p className="max-w-sm text-base leading-relaxed text-muted-foreground">{siteConfig.faculty} · {siteConfig.university}<br /><br />Program sarjana yang menghubungkan teori, praktik, dan kebutuhan masyarakat.</p></Reveal>
        </div>

        <Reveal delay={180} className="mt-10 grid overflow-hidden rounded-xl bg-primary text-primary-foreground sm:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">Ruang belajar</p>
            <h2 className="mt-3 max-w-xl font-heading text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">Teknologi tidak berhenti di layar. Ia harus bekerja di kehidupan nyata.</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-primary-foreground/75">Pelajari komputasi, perangkat lunak, data, dan sistem melalui perkuliahan, proyek, serta pengalaman yang punya arah.</p>
            <Link href="/informasi/pendaftaran" className={cn(buttonVariants({ size: "lg" }), "group mt-8 h-11 rounded-lg bg-primary-foreground px-5 text-primary hover:bg-primary-foreground/90")}>Kenali programnya<ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
          </div>
          <div className="grid content-center gap-5 border-t border-primary-foreground/20 p-6 sm:border-l sm:border-t-0 sm:p-8 lg:p-10">
            <div className="border-b border-primary-foreground/20 pb-4"><p className="text-xs text-primary-foreground/60">Kualifikasi</p><p className="mt-1 font-semibold">Sarjana Komputer</p></div>
            <div className="border-b border-primary-foreground/20 pb-4"><p className="text-xs text-primary-foreground/60">Beban studi</p><p className="mt-1 font-semibold">144 SKS</p></div>
            <div className="border-b border-primary-foreground/20 pb-4"><p className="text-xs text-primary-foreground/60">Pengalaman</p><p className="mt-1 font-semibold">MBKM & magang</p></div>
            <div><p className="text-xs text-primary-foreground/60">Fasilitas</p><p className="mt-1 font-semibold">Laboratorium pembelajaran</p></div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}