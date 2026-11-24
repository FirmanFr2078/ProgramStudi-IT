import {
  Code2Icon,
  DatabaseIcon,
  ShieldCheckIcon,
  RocketIcon,
  BriefcaseIcon,
} from "lucide-react"

import { Reveal } from "@/components/landing/reveal"
import type { ProfilLulusanItem } from "@/types"

const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Software Developer": Code2Icon,
  "Data Analyst / Data Scientist": DatabaseIcon,
  "Network & Security Engineer": ShieldCheckIcon,
  Technopreneur: RocketIcon,
}

export function ProfilLulusan({ items }: { items: ProfilLulusanItem[] }) {
  return (
    <section id="profil-lulusan" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal>
        <span className="text-sm font-medium text-primary">
          Lulusan
        </span>
        <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
          Jadi apa setelah lulus?
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-x-8 sm:grid-cols-2">
        {items.map(({ judul, deskripsi }, i) => {
          const Icon = roleIcons[judul] ?? BriefcaseIcon

          return (
            <Reveal key={judul} delay={i * 80}>
              <div className="group flex h-full gap-4 border-t border-border py-5 transition-colors hover:border-primary">
                <Icon className="mt-1 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-bold text-foreground">{judul}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{deskripsi}</p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}