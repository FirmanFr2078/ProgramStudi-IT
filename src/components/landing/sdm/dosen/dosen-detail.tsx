import { notFound } from "next/navigation"
import { MailIcon } from "lucide-react"

import { Reveal } from "@/components/landing/reveal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getDosenBySlug } from "@/data/dosen"
import { getInitials } from "@/lib/initials"

const pillLink =
  "rounded-full border px-3 py-1.5 transition-colors hover:border-lime hover:text-lime"

export async function DosenDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dosen = await getDosenBySlug(slug)
  if (!dosen) notFound()

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-6 pb-4 sm:px-6">
        <Reveal className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar className="size-20">
            {dosen.foto && (
              <AvatarImage
                src={dosen.foto}
                alt={`Foto ${dosen.nama}`}
                className="object-top"
              />
            )}
            <AvatarFallback className="bg-accent font-heading text-2xl font-bold text-lavender">
              {getInitials(dosen.nama)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {dosen.jabatanStruktural && (
                <span className="rounded-full bg-lime/10 px-2.5 py-0.5 text-xs font-semibold text-lime">
                  {dosen.jabatanStruktural}
                </span>
              )}
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-lavender">
                {dosen.jabatanFungsional}
              </span>
            </div>
            <h1 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
              {dosen.nama}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              NIDN {dosen.nidn}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-4xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2">
        <Reveal className="rounded-2xl border bg-card p-6">
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Pendidikan
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {dosen.pendidikan.map((p) => (
              <li key={p.jenjang} className="text-sm">
                <span className="font-bold">{p.jenjang}</span> — {p.bidang}
                <br />
                <span className="text-muted-foreground">{p.kampus}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80} className="rounded-2xl border bg-card p-6">
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Bidang Keahlian
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {dosen.bidangKeahlian.map((b) => (
              <span
                key={b}
                className="rounded-full bg-accent px-2.5 py-1 text-xs text-lavender"
              >
                {b}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={160}
          className="rounded-2xl border bg-card p-6 md:col-span-2"
        >
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Mata Kuliah Diampu
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {dosen.mataKuliah.map((m) => (
              <span
                key={m}
                className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground"
              >
                {m}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={240}
          className="rounded-2xl border bg-card p-6 md:col-span-2"
        >
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Kontak & Publikasi
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a
              href={`mailto:${dosen.email}`}
              className={`${pillLink} flex items-center gap-1.5`}
            >
              <MailIcon className="size-3.5" />
              {dosen.email}
            </a>
            {dosen.sinta && (
              <a
                href={dosen.sinta}
                target="_blank"
                rel="noreferrer"
                className={pillLink}
              >
                SINTA
              </a>
            )}
            {dosen.googleScholar && (
              <a
                href={dosen.googleScholar}
                target="_blank"
                rel="noreferrer"
                className={pillLink}
              >
                Google Scholar
              </a>
            )}
          </div>
        </Reveal>
      </section>
    </>
  )
}

export function DosenDetailSkeleton() {
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
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl md:col-span-2" />
        <Skeleton className="h-24 rounded-2xl md:col-span-2" />
      </section>
    </>
  )
}