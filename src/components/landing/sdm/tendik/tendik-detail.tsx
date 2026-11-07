import { notFound } from "next/navigation"
import {
  ClockIcon,
  GraduationCapIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react"

import { Reveal } from "@/components/landing/reveal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getTendikBySlug } from "@/data/tendik"
import { getInitials } from "@/lib/initials"

const pillLink =
  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors hover:border-lime hover:text-lime"

const label =
  "font-mono text-xs tracking-[0.35em] text-lavender uppercase"

export async function TendikDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tendik = await getTendikBySlug(slug)
  if (!tendik) notFound()

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-6 pb-4 sm:px-6">
        <Reveal className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="size-20">
            {tendik.foto && (
              <AvatarImage
                src={tendik.foto}
                alt={`Foto ${tendik.nama}`}
                className="object-top"
              />
            )}
            <AvatarFallback className="bg-accent font-heading text-2xl font-bold text-lavender">
              {getInitials(tendik.nama)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-lavender">
                {tendik.unitKerja}
              </span>
            </div>
            <h1 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
              {tendik.nama}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {tendik.jabatan}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-4xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2">
        <Reveal className="rounded-2xl border bg-card p-6 md:col-span-2">
          <p className={label}>Tugas & Layanan</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {tendik.tugas.map((t) => (
              <li key={t} className="flex gap-3 text-sm">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lime" />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80} className="rounded-2xl border bg-card p-6">
          <p className={label}>Ruang & Jam Layanan</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li className="flex gap-3">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-lavender" />
              {tendik.lokasi}
            </li>
            <li className="flex gap-3">
              <ClockIcon className="mt-0.5 size-4 shrink-0 text-lavender" />
              {tendik.jamLayanan}
            </li>
          </ul>
        </Reveal>

        <Reveal delay={160} className="rounded-2xl border bg-card p-6">
          <p className={label}>Pendidikan Terakhir</p>
          <p className="mt-4 flex gap-3 text-sm">
            <GraduationCapIcon className="mt-0.5 size-4 shrink-0 text-lavender" />
            {tendik.pendidikan}
          </p>
        </Reveal>

        <Reveal delay={240} className="rounded-2xl border bg-card p-6 md:col-span-2">
          <p className={label}>Kontak</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a href={`mailto:${tendik.email}`} className={pillLink}>
              <MailIcon className="size-3.5" />
              {tendik.email}
            </a>
            {tendik.telepon && (
              <a
                href={`tel:${tendik.telepon.replace(/[^\d+]/g, "")}`}
                className={pillLink}
              >
                <PhoneIcon className="size-3.5" />
                {tendik.telepon}
              </a>
            )}
          </div>
        </Reveal>
      </section>
    </>
  )
}

export function TendikDetailSkeleton() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-6 pb-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Skeleton className="size-20 rounded-full" />
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-72 max-w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-4xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2">
        <Skeleton className="h-36 rounded-2xl md:col-span-2" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl md:col-span-2" />
      </section>
    </>
  )
}