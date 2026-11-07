import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { RisetTable } from "@/components/landing/riset/riset-table"
import { getHki } from "@/data/hki"

export const metadata: Metadata = {
  title: "Hak Kekayaan Intelektual",
}

export default async function HkiPage() {
  const data = await getHki()

  return (
    <>
      <PageHeader
        eyebrow="Riset"
        title="Hak Kekayaan Intelektual"
        description="Karya dosen dan mahasiswa yang telah terdaftar sebagai Hak Kekayaan Intelektual (HKI), termasuk hak cipta aplikasi dan modul ajar."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Riset" },
          { label: "HKI" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <RisetTable items={data} labelJudul="Judul Karya" />
      </section>
    </>
  )
}