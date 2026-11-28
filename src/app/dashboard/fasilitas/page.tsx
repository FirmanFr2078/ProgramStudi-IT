import type { Metadata } from "next"

import { requirePermissionPage } from "@/lib/auth"
import { FasilitasListView } from "@/components/dashboard/fasilitas/fasilitas-list-view"

export const metadata: Metadata = { title: "Fasilitas" }

export default async function FasilitasPage() {
  await requirePermissionPage("fasilitas:manage")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Fasilitas</h1>
        <p className="text-sm text-muted-foreground">
          Kelola fasilitas yang tampil di halaman publik, dikelompokkan lewat kategori.
        </p>
      </div>
      <FasilitasListView />
    </div>
  )
}