import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import {
  TendikDetail,
  TendikDetailSkeleton,
} from "@/components/landing/sdm/tendik/tendik-detail"
import { getAllTendik, getTendikBySlug } from "@/data/tendik"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const data = await getAllTendik()
  return data.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tendik = await getTendikBySlug(slug)
  return { title: tendik ? tendik.nama : "Tenaga Kependidikan" }
}

export default function TendikDetailPage({ params }: Props) {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
        <Link
          href="/sdm/tendik"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-lime"
        >
          <ArrowLeftIcon className="size-4" />
          Kembali ke tenaga kependidikan
        </Link>
      </section>

      <Suspense fallback={<TendikDetailSkeleton />}>
        <TendikDetail params={params} />
      </Suspense>
    </>
  )
}