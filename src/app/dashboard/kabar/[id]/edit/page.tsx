import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { requirePermissionPage } from "@/lib/auth"
import { getKabarByIdAdmin } from "@/database/kabar"
import { parseBigIntId, InvalidIdError } from "@/lib/ids"
import { KabarForm } from "@/components/dashboard/kabar/kabar-form"

export const metadata: Metadata = { title: "Edit Kabar" }

export default async function EditBeritaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requirePermissionPage("berita:manage")
  const { id } = await params

  let kabar
  try {
    kabar = await getKabarByIdAdmin(parseBigIntId(id))
  } catch (error) {
    if (error instanceof InvalidIdError) notFound()
    throw error
  }
  if (!kabar) notFound()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-1">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Edit Kabar</h1>
        <p className="text-sm text-muted-foreground">Perbarui konten &quot;{kabar.judul}&quot;.</p>
      </header>
      <KabarForm initial={kabar} />
    </div>
  )
}
