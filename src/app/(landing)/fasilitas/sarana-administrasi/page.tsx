import type { Metadata } from "next"

import { getFasilitas } from "@/data/fasilitas"
import { PageHeader } from "@/components/landing/page-header"
import { FasilitasGrid } from "@/components/landing/fasilitas/grid"

export const metadata: Metadata = {
  title: "Ruang sarana administrasi",
  description:
    "sarana administrasi Program Studi Teknik Informatika Universitas Islam Balitar",
}

export default async function SaranaAdministrasiPage() {
  const data = await getFasilitas("sarana administrasi")

  return (
    <>
      <PageHeader
        eyebrow="Fasilitas"
        title="sarana administrasi"
        description="Pusat koordinasi strategis dan pelayanan administratif terpadu yang didedikasikan untuk mendukung tata kelola organisasi yang prima, efisien, dan profesional."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Fasilitas" },
          { label: "sarana administrasi" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <FasilitasGrid items={data} />
      </section>
    </>
  )
}