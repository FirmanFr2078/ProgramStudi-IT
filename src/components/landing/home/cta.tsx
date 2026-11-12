import Link from "next/link"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-8 text-center sm:p-14 backdrop-blur-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent"
        />

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <Reveal className="flex flex-col items-center gap-4">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
              Penerimaan Mahasiswa Baru
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Siap Menjadi Bagian dari{" "}
              <span className="text-lime">Teknik Informatika</span>?
            </h2>
            <p className="max-w-md text-sm text-muted-foreground sm:text-base">
              Kembangkan potensi komputasi dan rekayasa perangkat lunakmu bersama kami di Universitas Islam Balitar.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-3 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/informasi/pendaftaran"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-xl px-8 text-sm font-semibold transition-all duration-200"
              )}
            >
              Daftar Sekarang
            </Link>
            <Link
              href="/informasi/kontak"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-xl border-border/80 bg-card/40 px-8 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-card/80"
              )}
            >
              Hubungi Layanan Akademik
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}