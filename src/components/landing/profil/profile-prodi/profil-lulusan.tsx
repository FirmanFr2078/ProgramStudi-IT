import { BriefcaseIcon } from "lucide-react"

import { Reveal } from "@/components/landing/reveal"
import type { ProfilLulusanItem } from "@/types"

export function ProfilLulusan({ items }: { items: ProfilLulusanItem[] }) {
  return (
    <section id="profil-lulusan" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
          Lulusan
        </p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
          Jadi Apa Setelah Lulus?
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
        {items.map(({ judul, deskripsi }, i) => (
          <Reveal key={judul} delay={i * 80}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-6 transition-colors hover:border-lime">
              <BriefcaseIcon className="size-7 text-lavender" />
              <h3 className="font-bold">{judul}</h3>
              <p className="text-sm text-muted-foreground">{deskripsi}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}