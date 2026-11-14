"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDownIcon, SearchIcon } from "lucide-react"

import { MobileNav } from "@/components/landing/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { mainNav, siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary font-heading text-sm font-black text-primary-foreground">TI</span>
          <span className="truncate font-heading text-sm font-extrabold tracking-tight text-foreground sm:text-base">{siteConfig.name}</span>
        </Link>

        <nav ref={navRef} aria-label="Menu utama" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="group relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === item.label}
                  onClick={() => setOpenMenu((current) => current === item.label ? null : item.label)}
                  onFocus={() => setOpenMenu(item.label)}
                  className="flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {item.label}
                  <ChevronDownIcon className={cn("size-3.5 transition-transform", openMenu === item.label && "rotate-180")} aria-hidden="true" />
                </button>
                {openMenu === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 before:absolute before:-top-2 before:left-0 before:h-2 before:w-full">
                    <ul className="min-w-56 rounded-lg border border-border bg-popover p-1 shadow-md">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} onClick={() => setOpenMenu(null)} className="block min-h-11 rounded-md px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : item.href ? (
              <Link key={item.label} href={item.href} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">{item.label}</Link>
            ) : null
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link href="/cari" aria-label="Cari" className="flex size-11 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
            <SearchIcon className="size-4" aria-hidden="true" />
          </Link>
          <ThemeToggle />
          <Link href="/informasi/pendaftaran" className={cn(buttonVariants({ size: "sm" }), "hidden min-h-11 rounded-lg px-4 text-xs font-semibold sm:inline-flex")}>Pendaftaran</Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}