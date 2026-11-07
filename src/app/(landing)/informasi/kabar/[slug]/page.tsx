import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import {
  KabarDetail,
  KabarDetailSkeleton,
} from "@/components/landing/informasi/kabar/detail"
import { getAllKabar, getKabarBySlug } from "@/data/kabar"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const data = await getAllKabar()
  return data.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const kabar = await getKabarBySlug(slug)
  return { title: kabar ? kabar.judul : "Kabar" }
}

export default function KabarDetailPage({ params }: Props) {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <Link
          href="/informasi/kabar"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-lime"
        >
          <ArrowLeftIcon className="size-4" />
          Kembali ke daftar kabar
        </Link>
      </section>

      <Suspense fallback={<KabarDetailSkeleton />}>
        <KabarDetail params={params} />
      </Suspense>
    </>
  )
}