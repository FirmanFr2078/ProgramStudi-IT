import type { Metadata } from "next"

import { getKerjaSama } from "@/data/kerja-sama"
import { Reveal } from "@/components/landing/reveal"
import { KerjaSamaList } from "@/components/landing/profil/kerja-sama/list"

export const metadata: Metadata = {
  title: "Kerja Sama",
  description:
    "Mitra kerja sama Program Studi Teknik Informatika Universitas Islam Balitar dari dunia usaha, perguruan tinggi, pemerintah, organisasi profesi, dan media.",
}

export default async function KerjaSamaPage() {
  const mitra = await getKerjaSama()

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Profil
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">
            Kerja Sama
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Program studi menjalin kerja sama lintas sektor — dunia usaha,
            perguruan tinggi, pemerintah, organisasi profesi, hingga media —
            untuk memperkaya pengalaman belajar mahasiswa.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <KerjaSamaList data={mitra} />
      </section>
    </>
  )
}