import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { DokumenList } from "@/components/landing/dokumen-list"
import { TanggalPentingList } from "@/components/landing/pendidikan/kalender/tanggal-penting"
import { getDokumenKalender, getTanggalPenting } from "@/data/kalender"

export const metadata: Metadata = {
  title: "Kalender Akademik",
}

export default async function KalenderPage() {
  const [tanggal, dokumen] = await Promise.all([
    getTanggalPenting(),
    getDokumenKalender(),
  ])

  return (
    <>
      <PageHeader
        eyebrow="Pendidikan"
        title="Kalender Akademik"
        description="Tanggal penting semester berjalan, dan unduhan SK resmi untuk tahun-tahun akademik sebelumnya."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Pendidikan" },
          { label: "Kalender Akademik" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 md:pb-14">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Tanggal Penting
        </h2>
        <div className="mt-5">
          <TanggalPentingList items={tanggal} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 md:pb-24">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Unduh SK Kalender Akademik
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Dokumen resmi per tahun akademik, format PDF.
        </p>
        <div className="mt-5">
          <DokumenList items={dokumen} />
        </div>
      </section>
    </>
  )
}