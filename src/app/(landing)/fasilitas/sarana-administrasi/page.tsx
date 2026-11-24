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
        title="Sarana Administrasi"
        description="Ruang kerja Ketua Program Studi dan ruang Tata Usaha di Gedung A, tempat layanan administrasi akademik dan kemahasiswaan prodi."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Fasilitas" },
          { label: "Sarana Administrasi" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <FasilitasGrid items={data} />
      </section>
    </>
  )
}