import { Fragment } from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Reveal } from "@/components/landing/reveal"

type Crumb = { label: string; href?: string }

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow: string
  title: string
  description?: string
  breadcrumbs: Crumb[]
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-4 sm:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((c, i) => {
            const isLast = i === breadcrumbs.length - 1
            return (
              <Fragment key={c.label}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : c.href ? (
                    <BreadcrumbLink render={<Link href={c.href} />}>
                      {c.label}
                    </BreadcrumbLink>
                  ) : (
                    <span>{c.label}</span>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <Reveal>
        <p className="mt-4 font-mono text-xs tracking-[0.35em] text-lavender uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </Reveal>
    </section>
  )
}