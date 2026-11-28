import type { Metadata } from "next"

import { requirePermissionPage } from "@/lib/auth"
import { FasilitasForm } from "@/components/dashboard/fasilitas/fasilitas-form"

export const metadata: Metadata = { title: "Tambah Fasilitas" }

export default async function TambahFasilitasPage() {
  await requirePermissionPage("fasilitas:manage")

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-1">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Tambah Fasilitas</h1>
        <p className="text-sm text-muted-foreground">Catat fasilitas baru.</p>
      </header>
      <FasilitasForm />
    </div>
  )
}