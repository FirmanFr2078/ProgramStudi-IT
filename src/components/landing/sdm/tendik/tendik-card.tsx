import Link from "next/link"
import { ArrowUpRightIcon, MailIcon, PhoneIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/initials"
import type { Tendik } from "@/types"

const iconButton =
  "flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-lime hover:text-lime"

export function TendikCard({ tendik }: { tendik: Tendik }) {
  return (
    <article className="group relative flex h-full items-center gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-lime">
      <Avatar className="size-16">
        {tendik.foto && (
          <AvatarImage
            src={tendik.foto}
            alt={`Foto ${tendik.nama}`}
            className="object-top"
          />
        )}
        <AvatarFallback className="bg-accent font-heading text-lg font-bold text-lavender">
          {getInitials(tendik.nama)}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* badge: unit kerja */}
        <span className="mb-2 block h-5 w-fit max-w-full truncate rounded-full bg-accent px-2 text-[10px] leading-5 font-semibold text-lavender">
          {tendik.unitKerja}
        </span>

        <h3 className="truncate font-heading text-base font-bold">
          <Link
            href={`/sdm/tendik/${tendik.slug}`}
            title={tendik.nama}
            className="after:absolute after:inset-0"
          >
            {tendik.nama}
          </Link>
        </h3>

        <p
          title={tendik.jabatan}
          className="mt-1 truncate text-xs text-muted-foreground"
        >
          {tendik.jabatan}
        </p>

        <div className="mt-4 flex h-8 items-center gap-2">
          <div className="relative z-10 flex items-center gap-1.5">
            <a
              href={`mailto:${tendik.email}`}
              aria-label={`Email ${tendik.nama}`}
              className={iconButton}
            >
              <MailIcon className="size-3.5" />
            </a>
            {tendik.telepon && (
              <a
                href={`tel:${tendik.telepon.replace(/[^\d+]/g, "")}`}
                aria-label={`Telepon ${tendik.nama}`}
                className={iconButton}
              >
                <PhoneIcon className="size-3.5" />
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