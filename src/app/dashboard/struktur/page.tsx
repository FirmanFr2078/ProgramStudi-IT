import type { Metadata } from "next"

import { StrukturBoard } from "@/components/dashboard/struktur/struktur-board"
import { getStrukturTreeAdmin } from "@/database/struktur"
import { requirePermissionPage } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Struktur Organisasi",
}

export default async function StrukturPage() {
  await requirePermissionPage("struktur:manage")
  const initialData = await getStrukturTreeAdmin()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-1">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Struktur Organisasi</h1>
        <p className="text-sm text-muted-foreground">
          Susun bagan struktural dan tupoksi tiap jabatan di Program Studi.
        </p>
      </header>

      <StrukturBoard initialData={initialData} />
    </div>
  )
}