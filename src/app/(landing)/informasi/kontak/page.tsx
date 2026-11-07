import type { Metadata } from "next"
import type { LucideIcon } from "lucide-react"
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Reveal } from "@/components/landing/reveal"
import { ContactForm } from "@/components/landing/informasi/contact-form"

export const metadata: Metadata = {
  title: "Kontak",
  description: `Hubungi ${siteConfig.fullName}, ${siteConfig.university}, untuk pertanyaan seputar akademik dan pendaftaran.`,
}

type ContactItem = {
  icon: LucideIcon
  label: string
  value: string
  href?: string
}

const contactItems: ContactItem[] = [
  { icon: MapPinIcon, label: "Alamat", value: siteConfig.address },
  {
    icon: MailIcon,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: PhoneIcon,
    label: "Telepon",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone}`,
  },
]

function ContactCard({ icon: Icon, label, value, href }: ContactItem) {
  const className =
    "group flex items-start gap-3 rounded-2xl border bg-card p-5 transition-colors hover:border-lime"
  const content = (
    <>
      <Icon className="mt-0.5 size-5 shrink-0 text-lime" />
      <div>
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1 text-sm">{value}</p>
      </div>
    </>
  )

  return href ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  )
}

export default function KontakPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Kontak
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">
            Hubungi Kami
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Ada pertanyaan seputar perkuliahan, pendaftaran, atau kerja sama?
            Tim kami siap membantu.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-5">
        <Reveal delay={100} className="flex flex-col gap-4 lg:col-span-2">
          {contactItems.map((item) => (
            <ContactCard key={item.label} {...item} />
          ))}

          {siteConfig.social.length > 0 && (
            <div className="flex gap-3 rounded-2xl border bg-card p-5">
              {siteConfig.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-lime hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={200} className="lg:col-span-3">
          <ContactForm />
        </Reveal>
      </section>
    </>
  )
}