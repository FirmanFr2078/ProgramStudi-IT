import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"
import { siteConfig } from "@/config/site"

const facts = [
  ["Kualifikasi", "Sarjana Komputer"],
  ["Struktur studi", "144 SKS"],
  ["Pengalaman", "MBKM dan magang"],
  ["Fasilitas", "Laboratorium pembelajaran"],
]

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20 md:pt-24 md:pb-16">
      <div className="grid gap-12 border-b border-border pb-12 md:grid-cols-[1.2fr_0.8fr] md:gap-16 md:pb-16">
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="mb-5 text-sm font-medium text-muted-foreground">
              {siteConfig.faculty} · {siteConfig.university}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="max-w-3xl font-heading text-4xl leading-[1.02] font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Tempat mahasiswa belajar merancang teknologi yang bermanfaat.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Belajar dari dasar komputasi sampai pengembangan perangkat lunak, data, dan sistem yang dekat dengan kebutuhan masyarakat serta dunia kerja.
            </p>
          </Reveal>
          <Reveal delay={180} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/informasi/pendaftaran"
              className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-lg px-6")}
            >
              Lihat informasi pendaftaran
              <ArrowUpRightIcon className="size-4" />
            </Link>
            <Link
              href="/profil/profil-prodi"
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Lihat profil prodi
            </Link>
          </Reveal>
        </div>

        <Reveal delay={120} className="flex items-end">
          <div className="w-full border-l-2 border-primary pl-6 md:pl-8">
            <p className="text-sm font-semibold text-foreground">Yang akan kamu temui di sini</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Perkuliahan yang menghubungkan teori, latihan, proyek, dan pengalaman kerja agar setiap tahap belajar punya arah yang jelas.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}