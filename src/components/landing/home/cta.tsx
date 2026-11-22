import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"
import { cn } from "cn"

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <Reveal className="flex flex-col gap-6 border-y border-border py-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:py-10">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Penerimaan mahasiswa baru</p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Mulai dengan informasi yang tepat.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">Lihat jalur pendaftaran atau hubungi layanan akademik untuk pertanyaan yang lebih spesifik.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href="/informasi/pendaftaran" className={cn(buttonVariants({ size: "lg" }), "group h-11 rounded-lg px-6")}>Informasi pendaftaran<ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
                    <Link href="/informasi/kontak" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-lg px-6")}>Hubungi prodi</Link>
        </div>
      </Reveal>
    </section>
  )
}