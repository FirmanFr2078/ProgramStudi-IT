import type { Metadata } from "next"

import { requirePermissionPage } from "@/lib/auth"
import { KabarListView } from "@/components/dashboard/kabar/kabar-list-view"

export const metadata: Metadata = { title: "Kabar" }

export default async function BeritaPage() {
  await requirePermissionPage("berita:manage")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">kabar</h1>
        <p className="text-sm text-muted-foreground">
          Kelola kabar yang tampil di halaman publik.
        </p>
      </div>
      <KabarListView />
    </div>
  )
}