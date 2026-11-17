"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDownIcon, SearchIcon } from "lucide-react"

import { MobileNav } from "@/components/landing/mobile-nav"

import { mainNav, siteConfig } from "@/config/site"
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
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 rounded-full border border-black/8 bg-background px-3 sm:px-4 dark:border-white/12">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">&lt;/&gt;</span>
          <span className="truncate font-heading text-sm font-extrabold leading-tight tracking-tight text-foreground sm:text-base">{siteConfig.name}</span>
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
                  className="flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {item.label}
                  <ChevronDownIcon className={cn("size-3.5 transition-transform", openMenu === item.label && "rotate-180")} aria-hidden="true" />
                </button>
                {openMenu === item.label && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                    <ul className="min-w-56 rounded-md border border-border bg-popover p-1 shadow-md">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} onClick={() => setOpenMenu(null)} className="block min-h-11 rounded-md px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : item.href ? (
              <Link key={item.label} href={item.href} className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">{item.label}</Link>
            ) : null
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* TODO: ganti angka statis ini dengan prop dari server component setelah penghitung kunjungan nyata tersedia. */}
          <p className="hidden text-xs text-muted-foreground lg:block">12.480 pengunjung</p>
          <span className="hidden h-4 w-px bg-black/8 lg:block dark:bg-white/12" aria-hidden="true" />

          <Link href="/cari" aria-label="Cari" className="flex size-11 items-center justify-center rounded-full border border-black/8 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 xl:w-auto xl:justify-start xl:gap-2 xl:px-4 dark:border-white/12">
            <SearchIcon className="size-4" aria-hidden="true" />
            <span className="hidden xl:inline">Cari</span>
          </Link>

          <MobileNav />
        </div>
      </div>
    </header>
  )
}