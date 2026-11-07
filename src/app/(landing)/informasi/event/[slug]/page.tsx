import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import {
  EventDetail,
  EventDetailSkeleton,
} from "@/components/landing/informasi/event/detail"
import { getAllEvent, getEventBySlug } from "@/data/event"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const data = await getAllEvent()
  return data.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  return { title: event ? event.judul : "Event Prodi" }
}

export default function EventDetailPage({ params }: Props) {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <Link
          href="/informasi/event"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-lime"
        >
          <ArrowLeftIcon className="size-4" />
          Kembali ke daftar event
        </Link>
      </section>

      <Suspense fallback={<EventDetailSkeleton />}>
        <EventDetail params={params} />
      </Suspense>
    </>
  )
}