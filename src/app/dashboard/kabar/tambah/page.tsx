import type { Metadata } from "next"

import { requirePermissionPage } from "@/lib/auth"
import { KabarForm } from "@/components/dashboard/kabar/kabar-form"

export const metadata: Metadata = { title: "Tambah Kabar" }

export default async function TambahBeritaPage() {
  await requirePermissionPage("berita:manage")

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-1">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Tambah Kabar</h1>
        <p className="text-sm text-muted-foreground">Buat kabar baru.</p>
      </header>
      <KabarForm />
    </div>
  )
}
