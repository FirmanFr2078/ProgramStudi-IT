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
  showEyebrow = true,
}: {
  eyebrow: string
  title: string
  description?: string
  breadcrumbs: Crumb[]
  showEyebrow?: boolean
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
        {showEyebrow && (
          <span className="mt-4 inline-block text-xs font-semibold tracking-wider text-primary uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 font-sans text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">
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