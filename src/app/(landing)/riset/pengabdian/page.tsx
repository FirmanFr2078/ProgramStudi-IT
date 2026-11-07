import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { RisetTable } from "@/components/landing/riset/riset-table"
import { getPengabdian } from "@/data/pengabdian"

export const metadata: Metadata = {
  title: "Hasil Pengabdian",
}

export default async function PengabdianPage() {
  const data = await getPengabdian()

  return (
    <>
      <PageHeader
        eyebrow="Riset"
        title="Hasil Pengabdian"
        description="Kegiatan pengabdian kepada masyarakat oleh dosen Program Studi Teknik Informatika, dari pelatihan UMKM hingga pendampingan sekolah."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Riset" },
          { label: "Hasil Pengabdian" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <RisetTable items={data} labelJudul="Judul Pengabdian" />
      </section>
    </>
  )
}