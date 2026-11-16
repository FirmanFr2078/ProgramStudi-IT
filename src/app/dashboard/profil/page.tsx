import type { Metadata } from "next"

import { ProfilForm } from "@/components/dashboard/profil/profil-form"
import { getProfilProdiFormData } from "@/database/profil"
import { requirePermissionPage } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Profil Program Studi",
}

export default async function ProfilProdiPage() {
  await requirePermissionPage("profil:manage")

  const { profil, ketuaProdi } = await getProfilProdiFormData()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-1">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Profil Program Studi
        </h1>

        <p className="text-sm text-muted-foreground">
          Kelola konten halaman Profil yang nantinya tampil di website publik.
        </p>
      </header>

      <ProfilForm initial={profil} ketuaProdi={ketuaProdi} />
    </div>
  )
}