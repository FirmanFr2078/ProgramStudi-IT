import { Suspense } from "react"
import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { EventList } from "@/components/landing/informasi/event/list"
import { EventListSkeleton } from "@/components/landing/informasi/event/list-skeleton"
import { getAllEvent } from "@/data/event"

export const metadata: Metadata = {
  title: "Event Prodi",
  description:
    "Seminar, workshop, dan kegiatan Program Studi Teknik Informatika Universitas Islam Balitar.",
}

type Props = { searchParams: Promise<{ kategori?: string }> }

export default function EventPage({ searchParams }: Props) {
  return (
    <>
      <PageHeader
        eyebrow="Informasi"
        title="Event Prodi"
        description="Seminar, workshop, lomba, dan kuliah umum dari Program Studi Teknik Informatika."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Informasi" },
          { label: "Event Prodi" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <Suspense fallback={<EventListSkeleton />}>
          <EventListContainer searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  )
}

async function EventListContainer({
  searchParams,
}: {
  searchParams: Props["searchParams"]
}) {
  const [data, { kategori }] = await Promise.all([getAllEvent(), searchParams])
  const initialKategori =
    kategori && data.some((e) => e.kategori === kategori) ? kategori : "Semua"

  return <EventList data={data} initialKategori={initialKategori} />
}