import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"

export function Cta() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-20 text-center sm:px-6 md:py-28">
      {/* latar — radial glow lilac tipis, beda dari background polos section lain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 40%, color-mix(in oklab, var(--c-lilac) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
        <h2 className="font-heading text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl">
          Siap Jadi Bagian dari{" "}
          <span className="text-lime">Teknik Informatika</span>?
        </h2>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          Bangun masa depanmu bersama kami — belajar, meneliti, dan berkarya
          di tengah perkembangan teknologi yang terus bergerak cepat.
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/pendaftaran"
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
        </div>
      </div>
    </section>
  )
}