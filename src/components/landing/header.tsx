import Link from "next/link"
import { ChevronDownIcon } from "lucide-react"

import { MobileNav } from "@/components/landing/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { mainNav, siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary font-heading text-sm font-black text-primary-foreground">TI</span>
          <span className="truncate font-heading text-sm font-extrabold tracking-tight text-foreground sm:text-base">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Menu utama" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button type="button" className="flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                  {item.label}
                  <ChevronDownIcon className="size-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
                </button>
                <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="min-w-56 rounded-lg border border-border bg-popover p-1 shadow-md">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block min-h-11 rounded-md px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : item.href ? (
              <Link key={item.label} href={item.href} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">{item.label}</Link>
            ) : null
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link href="/informasi/pendaftaran" className={cn(buttonVariants({ size: "sm" }), "hidden min-h-11 rounded-lg px-4 text-xs font-semibold sm:inline-flex")}>Pendaftaran</Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}