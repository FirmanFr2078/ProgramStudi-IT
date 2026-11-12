import Link from "next/link";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/landing/reveal";
import { siteConfig } from "@/config/site";

const title = "Teknik Informatika";

export function Hero() {
  return (
    <section className="relative isolate mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pt-24 pb-14 text-center sm:px-6 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24">
      {/* Latar focal point halus: pencahayaan lembut di belakang judul */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center overflow-hidden"
      >
        <div className="h-[28rem] w-[46rem] max-w-[90vw] rounded-full bg-lime/10 blur-[100px] dark:bg-lime/5" />
      </div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-6">
        <Reveal>
          <Link
            href="/informasi/kabar"
            className="group inline-flex max-w-[92vw] items-center gap-2.5 rounded-full border border-border bg-card/70 py-1.5 pr-4 pl-2 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:border-lime/40 hover:text-foreground"
          >
            <span className="rounded-full bg-lime/15 px-2.5 py-0.5 text-[11px] font-semibold text-lime">
              Kabar
            </span>
            <span className="truncate">Pengumuman terbaru dari program studi</span>
          </Link>
        </Reveal>

        <Reveal delay={80} className="flex flex-col items-center gap-3">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Program Studi
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base md:text-lg">
            {siteConfig.faculty}
            <span className="mx-2.5 text-lime">|</span>
            {siteConfig.university}
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p className="rounded-full border border-border bg-card/40 px-5 py-2 text-xs font-medium tracking-wide text-foreground/80 sm:text-sm">
            Belajar · Meneliti · <span className="text-lime">Berkarya</span>
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/profil/profil-prodi"
            className={cn(
              buttonVariants({ size: "lg" }),
              "glow h-11 rounded-full px-7 text-sm font-semibold",
            )}
          >
            Kenali Prodi
          </Link>
          <Link
            href="/informasi/pendaftaran"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-full px-7 text-sm font-semibold",
            )}
          >
            Info Pendaftaran
          </Link>
        </Reveal>
      </div>
    </section>
  );
}