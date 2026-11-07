import type { Metadata } from "next"

import { getPrestasi } from "@/data/prestasi"
import { PageHeader } from "@/components/landing/page-header"
import { PrestasiList } from "@/components/landing/mahasiswa/prestasi/list"

export const metadata: Metadata = {
  title: "Prestasi Mahasiswa",
  description:
    "Daftar prestasi mahasiswa Program Studi Teknik Informatika Universitas Islam Balitar di berbagai ajang kompetisi dan hibah.",
}

export default async function PrestasiPage() {
  const data = await getPrestasi()

  return (
    <>
      <PageHeader
        eyebrow="Mahasiswa"
        title="Prestasi"
        description="Capaian mahasiswa Program Studi Teknik Informatika di ajang kompetisi, hibah, dan kegiatan tingkat kampus hingga internasional."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Mahasiswa" },
          { label: "Prestasi" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <PrestasiList data={data} />
      </section>
    </>
  )
}