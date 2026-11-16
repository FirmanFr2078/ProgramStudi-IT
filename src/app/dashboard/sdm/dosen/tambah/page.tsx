import type { Metadata } from "next"

import { DosenForm } from "@/components/dashboard/sdm/dosen-form"
import { requirePermissionPage } from "@/lib/auth"

export const metadata: Metadata = { title: "Tambah Dosen" }

export default async function TambahDosenPage() {
  await requirePermissionPage("sdm:manage")

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-1">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Tambah Dosen</h1>
        <p className="text-sm text-muted-foreground">Isi data dosen baru.</p>
      </header>
      <DosenForm />
    </div>
  )
}