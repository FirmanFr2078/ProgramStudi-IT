import type { Metadata } from "next"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DaySchedule } from "@/components/landing/pendidikan/jadwal/day-schedule"
import { getJadwal } from "@/data/jadwal"

export const metadata: Metadata = {
  title: "Jadwal Kuliah",
}

export default async function JadwalPage() {
  const jadwal = await getJadwal()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Jadwal Kuliah</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 font-heading text-3xl font-extrabold sm:text-4xl">
        Jadwal Kuliah
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Semester Ganjil 2026/2027 · Program Studi Teknik Informatika
      </p>

      <div className="mt-10">
        <DaySchedule items={jadwal} />
      </div>
    </div>
  )
}