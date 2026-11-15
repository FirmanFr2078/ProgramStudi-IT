import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { getKabar } from "@/data/kabar"
import { Reveal } from "@/components/landing/reveal"
import { formatTanggal } from "@/lib/utils"

export async function LatestNews() {
  const kabar = await getKabar(3)
  if (kabar.length === 0) return null

  return (
    <section id="kabar-terkini" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Publikasi dan agenda</p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Kabar terbaru.</h2>
        </div>
        <Link href="/informasi/kabar" className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          Semua kabar
        </Link>
      </Reveal>
      <div className="divide-y divide-border border-b border-border">
        {kabar.map((item, i) => (
          <Reveal key={item.slug} delay={i * 70}>
            <Link href={`/informasi/kabar/${item.slug}`} className="group grid gap-3 py-6 transition-colors hover:bg-accent/30 sm:grid-cols-[8rem_1fr_auto] sm:items-start sm:gap-8 sm:px-4">
              <p className="text-xs text-muted-foreground">{formatTanggal(item.tanggal)}</p>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">{item.kategori}</p>
                <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">{item.judul}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.ringkasan}</p>
              </div>
              <span className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                Buka kabar
                <ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}