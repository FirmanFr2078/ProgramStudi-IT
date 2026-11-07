import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { quickLinks } from "@/config/site"

export function QuickLinks() {
  return (
    <section
      id="akses-cepat"
      className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-24"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ title, description, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-3 rounded-2xl border bg-card p-6 transition-colors hover:border-lime"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-lavender">
                <Icon className="size-5" />
              </span>
              <ArrowUpRightIcon className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}