import type { Metadata } from "next"

import { DosenListView } from "@/components/dashboard/sdm/dosen-list-view"
import { requirePermissionPage } from "@/lib/auth"

export const metadata: Metadata = { title: "Dosen" }

export default async function DosenPage() {
  await requirePermissionPage("sdm:manage")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Dosen</h1>
        <p className="text-sm text-muted-foreground">
          Kelola data dosen yang tampil di halaman publik.
        </p>
      </div>
      <DosenListView />
    </div>
  )
}