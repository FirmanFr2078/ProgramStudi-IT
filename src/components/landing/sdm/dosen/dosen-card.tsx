import Link from "next/link"
import { ArrowUpRightIcon, MailIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/initials"
import type { Dosen } from "@/types"

const actionClass =
  "relative inline-flex h-8 items-center rounded-full border border-black/10 px-3 text-xs text-muted-foreground transition-colors after:absolute after:-inset-1.5 after:content-[''] hover:border-primary/40 hover:text-foreground dark:border-white/12"

export function DosenCard({ dosen }: { dosen: Dosen }) {
  const bidang = dosen.bidangKeahlian.join(" · ")

  return (
    <article className="group relative flex h-full items-start gap-4 rounded-xl border border-black/10 bg-card p-5 transition-colors hover:border-primary/40 dark:border-white/12">
      <Avatar className="size-14">
        {dosen.foto && (
          <AvatarImage
            src={dosen.foto}
            alt={`Foto ${dosen.nama}`}
            className="object-top"
          />
        )}
        <AvatarFallback className="bg-accent font-heading text-sm font-bold text-muted-foreground">
          {getInitials(dosen.nama)}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-heading text-base leading-snug font-bold">
          <Link
            href={`/sdm/dosen/${dosen.slug}`}
            title={dosen.nama}
            className="after:absolute after:inset-0"
          >
            {dosen.nama}
          </Link>
        </h3>

        {dosen.jabatanStruktural && (
          <p className="mt-1 text-xs text-primary">{dosen.jabatanStruktural}</p>
        )}

        <p
          title={bidang}
          className="mt-1 truncate text-xs text-muted-foreground"
        >
          {bidang}
        </p>

        <div className="mt-4 flex h-8 items-center gap-2">
          <div className="relative z-10 flex items-center gap-3">
            <a
              href={`mailto:${dosen.email}`}
              aria-label={`Email ${dosen.nama}`}
              className="relative flex size-8 items-center justify-center rounded-full border border-black/10 text-muted-foreground transition-colors after:absolute after:-inset-1.5 after:content-[''] hover:border-primary/40 hover:text-foreground dark:border-white/12"
            >
              <MailIcon className="size-3.5" aria-hidden="true" />
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

          <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary transition-colors group-hover:text-foreground">
            Detail
            <ArrowUpRightIcon
              className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </article>
  )
}