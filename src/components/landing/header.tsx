import Link from "next/link"
import { ChevronDownIcon } from "lucide-react"

import { MobileNav } from "@/components/landing/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { mainNav, siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export async function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary font-heading text-sm font-black text-primary-foreground shadow-sm">
            TI
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-extrabold leading-tight tracking-tight text-foreground">
              {siteConfig.name}
            </span>
            <span className="text-[10px] font-medium leading-tight text-muted-foreground">
              {siteConfig.university}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Menu utama" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group-focus-within:text-foreground"
                >
                  {item.label}
                  <ChevronDownIcon className="size-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute top-full left-0 min-w-56 pt-2 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="rounded-xl border border-border/80 bg-popover p-1.5 shadow-lg">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/informasi/pendaftaran"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden h-9 rounded-xl px-4 text-xs font-semibold sm:inline-flex"
            )}
          >
            Pendaftaran
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}