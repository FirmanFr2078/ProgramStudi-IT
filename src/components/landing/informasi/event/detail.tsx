import { notFound } from "next/navigation"
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"

import { Reveal } from "@/components/landing/reveal"
import { Skeleton } from "@/components/ui/skeleton"
import { buttonVariants } from "@/components/ui/button"
import { getEventBySlug } from "@/data/event"
import { cn, formatTanggal } from "@/lib/utils"

export async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  return (
    <section className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
      <Reveal>
        <span className="w-fit rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-lavender uppercase">
          {event.kategori}
        </span>
        <h1 className="mt-3 font-heading text-2xl font-extrabold sm:text-3xl">
          {event.judul}
        </h1>

        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground sm:text-base">
          <span className="flex items-center gap-2">
            <CalendarIcon className="size-4 shrink-0 text-lavender" />
            {formatTanggal(event.tanggalMulai)}
            {event.tanggalSelesai &&
              ` – ${formatTanggal(event.tanggalSelesai)}`}
          </span>
          {event.waktu && (
            <span className="flex items-center gap-2">
              <ClockIcon className="size-4 shrink-0 text-lavender" />
              {event.waktu}
            </span>
          )}
          <span className="flex items-center gap-2">
            <MapPinIcon className="size-4 shrink-0 text-lavender" />
            {event.lokasi}
          </span>
        </div>

        {event.tautanDaftar && (
          <a
            href={event.tautanDaftar}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "glow mt-6 rounded-full")}
          >
            Daftar Sekarang
          </a>
        )}
      </Reveal>

      {event.gambar && (
        <Reveal
          delay={100}
          className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border"
        >
          <img
            src={event.gambar}
            alt={event.judul}
            className="h-full w-full object-cover"
          />
        </Reveal>
      )}

      <Reveal delay={150} className="mt-8 flex flex-col gap-4">
        {event.konten.map((p, i) => (
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

export function EventDetailSkeleton() {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="mt-3 h-8 w-full max-w-md" />
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </section>
  )
}