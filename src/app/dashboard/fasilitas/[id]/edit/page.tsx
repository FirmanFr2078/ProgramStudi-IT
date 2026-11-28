import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { requirePermissionPage } from "@/lib/auth"
import { getFasilitasByIdAdmin } from "@/database/fasilitas/fasilitas"
import { parseBigIntId, InvalidIdError } from "@/lib/ids"
import { FasilitasForm } from "@/components/dashboard/fasilitas/fasilitas-form"

export const metadata: Metadata = { title: "Edit Fasilitas" }

export default async function EditFasilitasPage({
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

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-1">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Edit Fasilitas</h1>
        <p className="text-sm text-muted-foreground">
          Perbarui data &quot;{fasilitas.nama}&quot;.
        </p>
      </header>
      <FasilitasForm initial={fasilitas} />
    </div>
  )
}