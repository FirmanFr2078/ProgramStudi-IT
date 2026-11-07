import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { DaySchedule } from "@/components/landing/pendidikan/jadwal/day-schedule"
import { getJadwal } from "@/data/jadwal"

export const metadata: Metadata = {
  title: "Jadwal Kuliah",
}

export default async function JadwalPage() {
  const jadwal = await getJadwal()

  return (
    <>
      <PageHeader
        eyebrow="Pendidikan"
        title="Jadwal Kuliah"
        description="Semester Ganjil 2026/2027 · Program Studi Teknik Informatika"
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Pendidikan" },
          { label: "Jadwal Kuliah" },
        ]}
      />

      <section className="mx-auto max-w-5xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <DaySchedule items={jadwal} />
      </section>
    </>
  )
}