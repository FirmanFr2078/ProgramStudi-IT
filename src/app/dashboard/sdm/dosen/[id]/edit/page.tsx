import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DosenForm } from "@/components/dashboard/sdm/dosen-form"
import { getDosenByIdAdmin } from "@/database/dosen"
import { requirePermissionPage } from "@/lib/auth"
import { InvalidIdError, parseBigIntId } from "@/lib/ids"

export const metadata: Metadata = { title: "Edit Dosen" }

export default async function EditDosenPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requirePermissionPage("sdm:manage")
  const { id } = await params

  let dosen
  try {
    dosen = await getDosenByIdAdmin(parseBigIntId(id))
  } catch (error) {
    if (error instanceof InvalidIdError) notFound()
    throw error
  }
  if (!dosen) notFound()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-1">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Edit Dosen</h1>
        <p className="text-sm text-muted-foreground">Perbarui data {dosen.nama}.</p>
      </header>
      <DosenForm initial={dosen} />
    </div>
  )
}