import Link from "next/link"
import { ArrowUpRightIcon, MailIcon, PhoneIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/initials"
import type { Tendik } from "@/types"

const iconButton =
  "relative flex size-8 items-center justify-center rounded-full border border-black/10 text-muted-foreground transition-colors after:absolute after:-inset-1.5 after:content-[''] hover:border-primary/40 hover:text-foreground dark:border-white/12"

export function TendikCard({ tendik }: { tendik: Tendik }) {
  return (
    <article className="group relative flex h-full items-start gap-4 rounded-xl border border-black/10 bg-card p-5 transition-colors hover:border-primary/40 dark:border-white/12">
      <Avatar className="size-14">
        {tendik.foto && (
          <AvatarImage
            src={tendik.foto}
            alt={`Foto ${tendik.nama}`}
            className="object-top"
          />
        )}
        <AvatarFallback className="bg-accent font-heading text-sm font-bold text-muted-foreground">
          {getInitials(tendik.nama)}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-heading text-base leading-snug font-bold">
          <Link
            href={`/sdm/tendik/${tendik.slug}`}
            title={tendik.nama}
            className="after:absolute after:inset-0"
          >
            {tendik.nama}
          </Link>
        </h3>

        <p className="mt-1 text-xs text-primary">{tendik.unitKerja}</p>

        <p
          title={tendik.jabatan}
          className="mt-1 truncate text-xs text-muted-foreground"
        >
          {tendik.jabatan}
        </p>

        <div className="mt-4 flex h-8 items-center gap-2">
          <div className="relative z-10 flex items-center gap-3">
            <a
              href={`mailto:${tendik.email}`}
              aria-label={`Email ${tendik.nama}`}
              className={iconButton}
            >
              <MailIcon className="size-3.5" aria-hidden="true" />
            </a>
            {tendik.telepon && (
              <a
                href={`tel:${tendik.telepon.replace(/[^\d+]/g, "")}`}
                aria-label={`Telepon ${tendik.nama}`}
                className={iconButton}
              >
                <PhoneIcon className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </div>

          <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary transition-colors group-hover:text-foreground">
            Detail
            <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  )
}