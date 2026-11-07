import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { DokumenList } from "@/components/landing/dokumen-list"
import { BentukKegiatanGrid } from "@/components/landing/pendidikan/mbkm/bentuk-kegiatan"
import { LangkahList } from "@/components/landing/pendidikan/mbkm/langkah-list"
import { MitraPreview } from "@/components/landing/pendidikan/mbkm/mitra-preview"
import {
  getBentukKegiatan,
  getDokumenMbkm,
  getLangkahMbkm,
} from "@/data/mbkm"
import { getKerjaSama } from "@/data/kerja-sama"

export const metadata: Metadata = {
  title: "MBKM",
}

export default async function MbkmPage() {
  const [bentuk, langkah, dokumen, mitra] = await Promise.all([
    getBentukKegiatan(),
    getLangkahMbkm(),
    getDokumenMbkm(),
    getKerjaSama(),
  ])

  const mitraMbkm = mitra
    .filter(
      (m) =>
        m.kategori === "Dunia Usaha & Industri" ||
        m.kategori === "Perguruan Tinggi"
    )
    .slice(0, 6)

  return (
    <>
      <PageHeader
        eyebrow="Pendidikan"
        title="MBKM"
        description="Merdeka Belajar Kampus Merdeka — kesempatan belajar di luar kampus yang bisa dikonversi menjadi SKS."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Pendidikan" },
          { label: "MBKM" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 md:pb-14">
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          MBKM memberi mahasiswa hak belajar maksimal tiga semester di luar
          program studi — baik di kampus lain, dunia industri, maupun
          masyarakat — dengan capaian belajarnya dikonversi menjadi SKS yang
          diakui.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:px-6 md:pb-14">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Bentuk Kegiatan
        </h2>
        <div className="mt-5">
          <BentukKegiatanGrid items={bentuk} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:px-6 md:pb-14">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Mitra MBKM
        </h2>
        <div className="mt-5">
          <MitraPreview items={mitraMbkm} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:px-6 md:pb-14">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Alur Pendaftaran
        </h2>
        <div className="mt-5">
          <LangkahList items={langkah} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-16 sm:px-6 md:pb-24">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Unduh Dokumen
        </h2>
        <div className="mt-5">
          <DokumenList items={dokumen} />
        </div>
      </section>
    </>
  )
}