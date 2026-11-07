import { Suspense } from "react"
import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { KabarList } from "@/components/landing/informasi/kabar/list"
import { KabarListSkeleton } from "@/components/landing/informasi/kabar/list-skeleton"
import { getAllKabar } from "@/data/kabar"

export const metadata: Metadata = {
  title: "Kabar",
  description:
    "Kabar dan pengumuman terbaru dari Program Studi Teknik Informatika Universitas Islam Balitar.",
}

type Props = { searchParams: Promise<{ kategori?: string }> }

export default function kabarPage({ searchParams }: Props) {
  return (
    <>
       <PageHeader
        eyebrow="Informasi"
        title="Kabar"
        description="Kabar terbaru, pengumuman resmi, dan kegiatan Program Studi Teknik Informatika."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Informasi" },
          { label: "Kabar" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <Suspense fallback={<KabarListSkeleton />}>
          <KabarListContainer searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  )
}

async function KabarListContainer({
  searchParams,
}: {
  searchParams: Props["searchParams"]
}) {
  const [data, { kategori }] = await Promise.all([getAllKabar(), searchParams])
  const initialKategori = kategori === "pengumuman" ? "Pengumuman" : "Semua"

  return <KabarList data={data} initialKategori={initialKategori} />
}