import { notFound } from "next/navigation"
import { cn } from "cn"

import { Reveal } from "@/components/landing/reveal"
import { Skeleton } from "@/components/ui/skeleton"
import { getKabarBySlug } from "@/data/kabar"
import { formatTanggal } from "@/lib/utils"

export async function KabarDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const kabar = await getKabarBySlug(slug)
  if (!kabar) notFound()

  return (
    <section className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
      <Reveal>
        <span
          className={cn(
            "w-fit rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase",
            kabar.kategori === "Pengumuman"
              ? "bg-lime/10 text-lime"
              : "bg-accent text-lavender"
          )}
        >
          {kabar.kategori}
        </span>
        <h1 className="mt-3 font-heading text-2xl font-extrabold sm:text-3xl">
          {kabar.judul}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatTanggal(kabar.tanggal)}
        </p>
      </Reveal>

      {kabar.gambar && (
        <Reveal
          delay={100}
          className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border"
        >
          <img
            src={kabar.gambar}
            alt={kabar.judul}
            className="h-full w-full object-cover"
          />
        </Reveal>
      )}

      <Reveal delay={150} className="mt-6 flex flex-col gap-4">
        {kabar.konten.map((p, i) => (
          <p
            key={i}
            className="text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {p}
          </p>
        ))}
      </Reveal>
    </section>
  )
}

export function KabarDetailSkeleton() {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="mt-3 h-8 w-full max-w-md" />
      <Skeleton className="mt-2 h-4 w-32" />
      <div className="mt-6 flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </section>
  )
}