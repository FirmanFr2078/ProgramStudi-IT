import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"

export function Cta() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-20 text-center sm:px-6 md:py-28">
      {/* latar — radial glow lilac tipis, beda dari background polos section lain */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-20 -inset-y-10 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 40%, color-mix(in oklab, var(--c-lilac) 11%, transparent) 0%, color-mix(in oklab, var(--c-lilac) 4%, transparent) 55%, transparent 100%)",
          filter: "blur(70px)",
        }}
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
        <Reveal className="flex flex-col items-center gap-5">
          <h2 className="font-heading text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl">
            Siap Jadi Bagian dari{" "}
            <span className="text-lime">Teknik Informatika</span>?
          </h2>
          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            Bangun masa depanmu bersama kami — belajar, meneliti, dan berkarya
            di tengah perkembangan teknologi yang terus bergerak cepat.
          </p>
        </Reveal>

        <Reveal delay={150} className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/informasi/pendaftaran"
            className={cn(
              buttonVariants({ size: "lg" }),
              "glow h-11 rounded-full bg-[#2e1065] px-7 text-sm text-white hover:bg-[#3b0f85]"
            )}
          >
            Daftar Sekarang
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            href="/informasi/kontak"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-full px-7 text-sm"
            )}
          >
            Hubungi Kami
          </Link>
        </Reveal>
      </div>
    </section>
  )
}