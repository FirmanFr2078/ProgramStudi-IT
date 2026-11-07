import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { DokumenList } from "@/components/landing/dokumen-list"
import { SemesterTable } from "@/components/landing/pendidikan/kurikulum/semester-table"
import { focusAreas } from "@/config/focus-areas"
import { getDokumenKurikulum, getMataKuliah } from "@/data/kurikulum"

export const metadata: Metadata = {
  title: "Kurikulum",
}

export default async function KurikulumPage() {
  const [matkul, dokumen] = await Promise.all([
    getMataKuliah(),
    getDokumenKurikulum(),
  ])

  return (
    <>
      <PageHeader
        eyebrow="Pendidikan"
        title="Kurikulum"
        description="Struktur mata kuliah per semester dan empat bidang minat yang bisa kamu dalami."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Pendidikan" },
          { label: "Kurikulum" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 md:pb-14">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Bidang Minat
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {focusAreas.map(({ name, description, icon: Icon }) => (
            <div
              key={name}
              className="flex items-start gap-4 rounded-xl border bg-card p-5"
            >
              <Icon className="mt-0.5 size-6 shrink-0 text-lavender" />
              <div>
                <h3 className="font-semibold">{name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:px-6 md:pb-14">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Struktur Mata Kuliah
        </h2>
        <div className="mt-5">
          <SemesterTable items={matkul} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 md:pb-24">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Unduh Dokumen Kurikulum
        </h2>
        <div className="mt-5">
          <DokumenList items={dokumen} />
        </div>
      </section>
    </>
  )
}