import type { Metadata } from "next"

import { getFasilitas } from "@/data/fasilitas"
import { PageHeader } from "@/components/landing/page-header"
import { FasilitasGrid } from "@/components/landing/fasilitas/grid"

export const metadata: Metadata = {
  title: "Ruang Kelas",
  description:
    "Ruang Kelas Program Studi Teknik Informatika Universitas Islam Balitar — jaringan, pemrograman, dan multimedia.",
}

export default async function RuangKelasPage() {
  const data = await getFasilitas("Ruang Kelas")

  return (
    <>
      <PageHeader
        eyebrow="Fasilitas"
        title="Ruang Kelas"
        description="Ruang praktikum yang menunjang pembelajaran berbasis proyek dan riset mahasiswa."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Fasilitas" },
          { label: "Ruang Kelas" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <FasilitasGrid items={data} />
      </section>
    </>
  )
}