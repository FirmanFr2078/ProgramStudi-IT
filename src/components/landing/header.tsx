import Link from "next/link"
import { ChevronDownIcon, SearchIcon } from "lucide-react"

import { MobileNav } from "@/components/landing/mobile-nav"
import { mainNav, siteConfig } from "@/config/site"
import { getSiteStats } from "@/data/stats"

export async function Header() {
  const stats = await getSiteStats()

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-4">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full border bg-background/60 pr-2 pl-4 shadow-lg shadow-black/30 backdrop-blur-xl">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-lime font-mono text-sm font-bold text-black">
            &lt;/&gt;
          </span>
          <span className="font-heading text-lg font-extrabold">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Menu utama" className="hidden items-center gap-0.5 lg:flex">
          {mainNav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground group-focus-within:text-foreground"
                >
                  {item.label}
                  <ChevronDownIcon className="size-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute top-full left-0 min-w-56 pt-3 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="rounded-2xl border bg-popover p-1.5 shadow-lg">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div
            className="hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs text-muted-foreground xl:flex"
            title="Total pengunjung"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-lime" />
            </span>
            <span className="font-mono text-foreground">
              {stats.visitorsTotal.toLocaleString("id-ID")}
            </span>
            pengunjung
          </div>
          <Link
            href="/cari"
            aria-label="Cari"
            className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
          >
            <SearchIcon className="size-4" />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}