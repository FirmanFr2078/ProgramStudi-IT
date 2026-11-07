import { cn } from "cn"

import { Reveal } from "@/components/landing/reveal"
import type { StrukturOrganisasi } from "@/types"

function NodeBox({
  title,
  subtitle,
  accent = false,
}: {
  title: string
  subtitle?: string
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-56 flex-col items-center gap-0.5 rounded-xl border px-4 py-3 text-center",
        accent ? "border-lime bg-lime/5" : "bg-card"
      )}
    >
      <p className="text-sm font-bold">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export function OrgChart({ data }: { data: StrukturOrganisasi }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
          Struktur
        </p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
          Bagan Organisasi
        </h2>
      </Reveal>

      <Reveal
        delay={100}
        className="mt-10 overflow-x-auto rounded-3xl border bg-card/40 p-6 sm:p-10 md:mt-14"
      >
        <div className="flex min-w-160 flex-col items-center">
          {/* garis koordinatif ke Dekan — putus-putus, bukan bagian struktur internal prodi */}
          <p className="text-xs text-muted-foreground">
            {data.pimpinanFakultas.jabatan}
          </p>
          <div className="my-2 h-5 w-0 border-l-2 border-dashed border-muted-foreground/40" />

          <NodeBox
            title={data.ketuaProdi.jabatan}
            subtitle={data.ketuaProdi.nama}
            accent
          />
          <div className="h-6 w-px bg-border" />

          <NodeBox
            title={data.sekretarisProdi.jabatan}
            subtitle={data.sekretarisProdi.nama}
          />
          <div className="h-6 w-px bg-border" />

          <div className="w-full">
            <div className="h-px w-full bg-border" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 pt-6 sm:grid-cols-4">
              {data.koordinator.map((k) => (
                <div key={k.id} className="relative flex justify-center">
                  <span className="absolute -top-6 left-1/2 h-6 w-px -translate-x-1/2 bg-border" />
                  <NodeBox title={k.jabatan} />
                </div>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-border" />
          <NodeBox title="Dosen & Tenaga Kependidikan" />
        </div>
      </Reveal>
    </section>
  )
}