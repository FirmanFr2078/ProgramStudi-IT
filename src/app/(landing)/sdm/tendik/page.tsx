import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { Reveal } from "@/components/landing/reveal"
import { TendikCard } from "@/components/landing/sdm/tendik/tendik-card"
import { getAllTendik } from "@/data/tendik"

export const metadata: Metadata = {
  title: "Tenaga Kependidikan",
  description:
    "Tenaga kependidikan Program Studi Teknik Informatika Universitas Islam Balitar: layanan administrasi, laboratorium, dan perpustakaan.",
}

export default async function TendikPage() {
  const data = await getAllTendik()

  return (
    <>
      <PageHeader
        eyebrow="SDM"
        title="Tenaga Kependidikan"
        description="Tim yang melayani kebutuhan administrasi, laboratorium, dan perpustakaan program studi. Pilih salah satu kartu untuk melihat layanan dan lokasi ruangnya."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "SDM" },
          { label: "Tenaga Kependidikan" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 md:pb-24">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((tendik, i) => (
            <Reveal
              key={tendik.slug}
              delay={Math.min(i, 7) * 60}
              className="h-full"
            >
              <TendikCard tendik={tendik} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}