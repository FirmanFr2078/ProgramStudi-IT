import Link from "next/link"
import { ArrowUpRightIcon, MailIcon } from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/initials"
import type { Dosen } from "@/types"

const actionClass =
  "flex h-8 items-center rounded-full border px-3 text-[11px] text-muted-foreground transition-colors hover:border-lime hover:text-lime"

export function DosenCard({ dosen }: { dosen: Dosen }) {
  const bidang = dosen.bidangKeahlian.join(" · ")

  return (
    <article className="group relative flex h-full items-center gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-lime">
      <Avatar className="size-16">
        {dosen.foto && (
          <AvatarImage
            src={dosen.foto}
            alt={`Foto ${dosen.nama}`}
            className="object-top"
          />
        )}
        <AvatarFallback className="bg-accent font-heading text-lg font-bold text-lavender">
          {getInitials(dosen.nama)}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 1. jabatan struktural (atau "Dosen" bila tidak ada) */}
        <span
          className={cn(
            "mb-2 block h-5 w-fit max-w-full truncate rounded-full px-2 text-[10px] leading-5 font-semibold",
            dosen.jabatanStruktural
              ? "bg-lime text-black"
              : "bg-accent text-muted-foreground"
          )}
        >
          {dosen.jabatanStruktural ?? "Dosen"}
        </span>

        {/* 2. nama (satu baris, dipotong dengan ...) */}
        <h3 className="truncate font-heading text-base font-bold">
          <Link
            href={`/sdm/dosen/${dosen.slug}`}
            title={dosen.nama}
            className="after:absolute after:inset-0"
          >
            {dosen.nama}
          </Link>
        </h3>

        {/* 3. bidang keahlian (satu baris, dipotong dengan ...) */}
        <p
          title={bidang}
          className="mt-1 truncate text-xs text-muted-foreground"
        >
          {bidang}
        </p>

        {/* 4. ikon dan "Detail" */}
        <div className="mt-4 flex h-8 items-center gap-2">
          <div className="relative z-10 flex items-center gap-1.5">
            <a
              href={`mailto:${dosen.email}`}
              aria-label={`Email ${dosen.nama}`}
              className="flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-lime hover:text-lime"
            >
              <MailIcon className="size-3.5" />
            </a>
            {dosen.sinta && (
              <a
                href={dosen.sinta}
                target="_blank"
                rel="noreferrer"
                className={actionClass}
              >
                SINTA
              </a>
            )}
            {dosen.googleScholar && (
              <a
                href={dosen.googleScholar}
                target="_blank"
                rel="noreferrer"
                className={actionClass}
              >
                Scholar
              </a>
            )}
          </div>

          <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-lime">
            Detail
            <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}