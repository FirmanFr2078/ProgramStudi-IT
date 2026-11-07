import type { Metadata } from "next"

import { getStrukturOrganisasi } from "@/data/organisasi"
import { Reveal } from "@/components/landing/reveal"
import { OrgChart } from "@/components/landing/profil/organisasi/org-chart"
import { Tupoksi } from "@/components/landing/profil/organisasi/tupoksi"

export const metadata: Metadata = {
  title: "Struktur Organisasi",
  description:
    "Struktur organisasi dan tugas pokok fungsi pengelola Program Studi Teknik Informatika Universitas Islam Balitar.",
}

export default async function StrukturOrganisasiPage() {
  const data = await getStrukturOrganisasi()
  const posisi = [data.ketuaProdi, data.sekretarisProdi, ...data.koordinator]

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Profil
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">
            Struktur Organisasi
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Susunan pengelola Program Studi Teknik Informatika beserta tugas
            pokok dan fungsinya masing-masing.
          </p>
        </Reveal>
      </section>

      <OrgChart data={data} />
      <Tupoksi items={posisi} />
    </>
  )
}