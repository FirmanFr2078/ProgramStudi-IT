import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { footerNav, siteConfig } from "@/config/site"

export function Footer() {
  const primaryLinks = footerNav.flatMap((group) => group.links).slice(0, 8)

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_0.8fr] md:gap-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary font-mono text-xs font-bold text-primary-foreground">&lt;/&gt;</span>
              <span className="font-heading text-base font-extrabold tracking-tight text-foreground">{siteConfig.name}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">{siteConfig.faculty}<br />{siteConfig.university}</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">Informasi akademik, kegiatan, dan layanan Program Studi Teknik Informatika.</p>
          </div>

          <nav aria-label="Tautan penting">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Tautan penting</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
              {primaryLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Hubungi kami</h2>
            <address className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground not-italic"><span>{siteConfig.address}</span><span>{siteConfig.email}</span><span>{siteConfig.phone}</span></address>
            <Link href="/informasi/kontak" className="group mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">Halaman kontak<ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6"><p>© {siteConfig.copyrightYear} {siteConfig.fullName} · {siteConfig.university}</p><Link href="/login" className="transition-colors hover:text-foreground">Masuk</Link></div>
      </div>
    </footer>
  )
}