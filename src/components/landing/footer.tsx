import Link from "next/link";

import { footerNav, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-lime font-mono text-sm font-bold text-black">
              &lt;/&gt;
            </span>
            <span className="font-heading text-lg font-extrabold">
              {siteConfig.name}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {siteConfig.fullName}
            <br />
            {siteConfig.faculty}
            <br />
            {siteConfig.university}
          </p>
        </div>

        {footerNav.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h2 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              {group.title}
            </h2>
            <ul className="flex flex-col gap-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <h2 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            Kontak
          </h2>
          <address className="flex flex-col gap-2 text-sm text-muted-foreground not-italic">
            <span>{siteConfig.address}</span>
            <span>{siteConfig.email}</span>
            <span>{siteConfig.phone}</span>
          </address>
          <div className="flex gap-4 text-sm">
            {siteConfig.social.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="text-lavender hover:text-foreground"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4 sm:px-6">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.fullName} ·{" "}
            {siteConfig.university}
          </p>
          <Link
            href="/login"
            className="transition-colors hover:text-foreground"
          >
            Masuk
          </Link>
        </div>
      </div>
    </footer>
  );
}
