import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import {
  DosenDetail,
  DosenDetailSkeleton,
} from "@/components/landing/sdm/dosen/dosen-detail"
import { getAllDosen, getDosenBySlug } from "@/data/dosen"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const data = await getAllDosen()
  return data.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const dosen = await getDosenBySlug(slug)
  return { title: dosen ? dosen.nama : "Dosen" }
}

export default function DosenDetailPage({ params }: Props) {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
        <Link
          href="/sdm/dosen"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-lime"
        >
          <ArrowLeftIcon className="size-4" />
          Kembali ke daftar dosen
        </Link>
      </section>

      <Suspense fallback={<DosenDetailSkeleton />}>
        <DosenDetail params={params} />
      </Suspense>
    </>
  )
}