import type { Metadata } from "next"

import { getAlumni } from "@/data/alumni"
import { PageHeader } from "@/components/landing/page-header"
import { AlumniSummary } from "@/components/landing/mahasiswa/alumni/summary"
import { AlumniTable } from "@/components/landing/mahasiswa/alumni/table"

export const metadata: Metadata = {
  title: "Alumni",
  description:
    "Jejak alumni Program Studi Teknik Informatika Universitas Islam Balitar — sebaran karier dan tahun kelulusan.",
}

export default async function AlumniPage() {
  const data = await getAlumni()

  return (
    <>
      <PageHeader
        eyebrow="Mahasiswa"
        title="Alumni"
        description="Jejak karier alumni Program Studi Teknik Informatika dari berbagai angkatan."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Mahasiswa" },
          { label: "Alumni" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 md:pb-14">
        <AlumniSummary data={data} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
        <AlumniTable items={data} />
      </section>
    </>
  )
}