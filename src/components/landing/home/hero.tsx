import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"
import { siteConfig } from "@/config/site"

const facts = [
  ["Gelar", "S.Kom"],
  ["Beban studi", "144 SKS"],
  ["Model belajar", "MBKM & magang"],
  ["Fasilitas", "Laboratorium"],
]

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl items-center px-4 py-8 sm:px-6 sm:py-10 md:py-12">
          <div className="grid w-full gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-16">
        <div>
          <Reveal><p className="text-sm font-semibold text-primary">{siteConfig.faculty} · {siteConfig.university}</p></Reveal>
          <Reveal delay={60}><h1 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-[1.04] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.5rem]">Teknik Informatika untuk membangun solusi yang berguna.</h1></Reveal>
          <Reveal delay={120}><p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">Pelajari dasar komputasi, perangkat lunak, data, dan sistem dalam program sarjana yang dekat dengan kebutuhan masyarakat dan dunia kerja.</p></Reveal>
          <Reveal delay={180} className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/informasi/pendaftaran" className={cn(buttonVariants({ size: "lg" }), "group h-11 rounded-md px-5")}>Informasi pendaftaran<ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
            <Link href="/profil/profil-prodi" className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Profil prodi</Link>
          </Reveal>
        </div>

        <Reveal delay={120} className="border-l border-border pl-6 md:pl-8">
          <p className="text-sm font-semibold text-foreground">Program sarjana</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">Kurikulum, praktik, dan pengalaman di luar kelas membantu mahasiswa memahami teori dan menerapkannya dalam pekerjaan.</p>
          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6">
            {facts.map(([label, value]) => (
              <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold text-foreground">{value}</p></div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}