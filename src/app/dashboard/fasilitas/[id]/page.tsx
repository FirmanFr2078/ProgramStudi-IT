import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { requirePermissionPage } from "@/lib/auth"
import { getFasilitasByIdAdmin } from "@/database/fasilitas/fasilitas"
import { parseBigIntId, InvalidIdError } from "@/lib/ids"
import { FasilitasDetailView } from "@/components/dashboard/fasilitas/fasilitas-detail-view"

export const metadata: Metadata = { title: "Detail Fasilitas" }

export default async function DetailFasilitasPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requirePermissionPage("fasilitas:manage")
  const { id } = await params

  let fasilitas
  try {
    fasilitas = await getFasilitasByIdAdmin(parseBigIntId(id))
  } catch (error) {
    if (error instanceof InvalidIdError) notFound()
    throw error
  }
  if (!fasilitas) notFound()

  return <FasilitasDetailView fasilitas={fasilitas} />
}