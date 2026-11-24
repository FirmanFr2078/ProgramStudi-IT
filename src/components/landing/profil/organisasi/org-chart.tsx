import { Reveal } from "@/components/landing/reveal"
import { OrgChartCanvas } from "@/components/landing/profil/organisasi/org-chart-canvas"
import type { StrukturOrganisasi } from "@/types"

export function OrgChart({ data }: { data: StrukturOrganisasi }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal>
        <p className="text-sm font-medium text-primary">Struktur</p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">Pengelola program studi</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Hubungan kerja dimulai dari pimpinan fakultas, diteruskan kepada pengelola program studi, lalu dibagi ke bidang koordinasi dan tenaga pelaksana.</p>
      </Reveal>

      <Reveal delay={100}>
        <OrgChartCanvas data={data} />
      </Reveal>
    </section>
  )
}