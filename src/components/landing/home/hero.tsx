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
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 md:pb-20">
      <div className="grid overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-2">
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:min-h-[34rem] lg:p-14">
          <div>
            <Reveal><p className="text-sm font-semibold text-primary">{siteConfig.faculty} · {siteConfig.university}</p></Reveal>
            <Reveal delay={60}><h1 className="mt-6 max-w-2xl font-heading text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">Teknik Informatika untuk membangun solusi yang berguna.</h1></Reveal>
            <Reveal delay={120}><p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">Pelajari dasar komputasi, perangkat lunak, data, dan sistem dalam program sarjana yang dekat dengan kebutuhan masyarakat dan dunia kerja.</p></Reveal>
          </div>
          <Reveal delay={180} className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <Link href="/informasi/pendaftaran" className={cn(buttonVariants({ size: "lg" }), "group h-11 rounded-lg px-5")}>Informasi pendaftaran<ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
            <Link href="/profil/profil-prodi" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Profil prodi</Link>
          </Reveal>
        </div>

        <Reveal delay={120} className="flex flex-col justify-between bg-primary p-6 text-primary-foreground sm:p-10 lg:min-h-[34rem] lg:p-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">Program sarjana</p>
            <p className="mt-5 max-w-sm font-heading text-3xl font-extrabold leading-tight sm:text-4xl">Belajar memahami teknologi sebelum menggunakannya.</p>
          </div>
          <div className="mt-12">
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/75">Kurikulum, praktik, dan pengalaman di luar kelas membantu mahasiswa memahami teori dan menerapkannya dalam pekerjaan.</p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-primary-foreground/20 pt-6">
              {facts.map(([label, value]) => (
                <div key={label}><p className="text-xs text-primary-foreground/60">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}