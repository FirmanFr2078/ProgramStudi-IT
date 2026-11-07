import type { Metadata } from "next"

import { Reveal } from "@/components/landing/reveal"
import { DosenCard } from "@/components/landing/sdm/dosen/dosen-card"
import { getAllDosen } from "@/data/dosen"

export const metadata: Metadata = {
  title: "Dosen",
  description:
    "Profil dosen Program Studi Teknik Informatika Universitas Islam Balitar: jabatan, bidang keahlian, dan mata kuliah yang diampu.",
}

export default async function DosenPage() {
  const data = await getAllDosen()

  // Jabatan struktural tampil lebih dulu; urutan lainnya tetap.
  const sorted = [...data].sort(
    (a, b) =>
      Number(Boolean(b.jabatanStruktural)) -
      Number(Boolean(a.jabatanStruktural))
  )

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            SDM
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">
            Dosen
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Tenaga pendidik Program Studi Teknik Informatika. Pilih salah satu
            kartu untuk melihat profil lengkapnya.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 md:pb-24">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((dosen, i) => (
            <Reveal
              key={dosen.slug}
              delay={Math.min(i, 7) * 60}
              className="h-full"
            >
              <DosenCard dosen={dosen} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}