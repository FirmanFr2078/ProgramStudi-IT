import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { RisetTable } from "@/components/landing/riset/riset-table"
import { getPenelitian } from "@/data/penelitian"

export const metadata: Metadata = {
  title: "Hasil Penelitian",
}

export default async function PenelitianPage() {
  const data = await getPenelitian()

  return (
    <>
      <PageHeader
        eyebrow="Riset"
        title="Hasil Penelitian"
        description="Rekam jejak penelitian dosen dan mahasiswa Program Studi Teknik Informatika, mulai dari riset mandiri hingga yang didanai hibah eksternal."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Riset" },
          { label: "Hasil Penelitian" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <RisetTable items={data} />
      </section>
    </>
  )
}