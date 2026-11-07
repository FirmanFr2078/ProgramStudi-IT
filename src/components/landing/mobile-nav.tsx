"use client"

import { useState } from "react"
import Link from "next/link"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { mainNav, siteConfig } from "@/config/site"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Buka menu"
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <nav aria-label="Menu seluler" className="flex flex-col gap-5 px-4 pb-6">
          {mainNav.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              {item.children ? (
                <>
                  <p className="mb-1 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={close}
                      className="rounded-lg px-2 py-2 text-sm hover:bg-accent"
                    >
                      {child.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={item.href ?? "#"}
                  onClick={close}
                  className="rounded-lg px-2 py-2 text-sm hover:bg-accent"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}