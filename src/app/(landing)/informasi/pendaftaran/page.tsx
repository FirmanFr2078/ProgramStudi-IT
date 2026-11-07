import type { Metadata } from "next"
import Link from "next/link"
import { CheckIcon } from "lucide-react"
import { cn } from "cn"

import { PageHeader } from "@/components/landing/page-header"
import { Reveal } from "@/components/landing/reveal"
import { LangkahList } from "@/components/landing/pendidikan/mbkm/langkah-list"
import { buttonVariants } from "@/components/ui/button"
import { getJalurPendaftaran, getTahapPendaftaran } from "@/data/pendaftaran"

export const metadata: Metadata = {
  title: "Info Pendaftaran",
  description:
    "Jalur pendaftaran, syarat, dan tahapan seleksi mahasiswa baru Program Studi Teknik Informatika Universitas Islam Balitar.",
}

export default async function PendaftaranPage() {
  const [jalur, tahapan] = await Promise.all([
    getJalurPendaftaran(),
    getTahapPendaftaran(),
  ])

  return (
    <>
      <PageHeader
        eyebrow="Informasi"
        title="Info Pendaftaran"
        description="Tiga jalur masuk, satu tujuan: bergabung dengan Program Studi Teknik Informatika."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Informasi" },
          { label: "Info Pendaftaran" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 md:pb-14">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Jalur Pendaftaran
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {jalur.map((j, i) => (
            <Reveal key={j.nama} delay={i * 80} className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-6 transition-colors hover:border-lime">
                <h3 className="font-heading text-lg font-bold">{j.nama}</h3>
                <p className="text-sm text-muted-foreground">{j.deskripsi}</p>
                <ul className="mt-auto flex flex-col gap-1.5 pt-2">
                  {j.syarat.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-lime" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-10 sm:px-6 md:pb-14">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          Tahapan Seleksi
        </h2>
        <div className="mt-5">
          <LangkahList items={tahapan} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-16 text-center sm:px-6 md:pb-24">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border bg-card p-8">
          <h2 className="font-heading text-xl font-bold sm:text-2xl">
            Butuh Bantuan?
          </h2>
          <p className="text-sm text-muted-foreground">
            Tim admisi kami siap membantu jika ada pertanyaan seputar
            pendaftaran.
          </p>
          <Link
            href="/informasi/kontak"
            className={cn(
              buttonVariants({ size: "lg" }),
              "glow h-11 rounded-full bg-[#2e1065] px-7 text-sm text-white hover:bg-[#3b0f85]"
            )}
          >
            Hubungi Kami
          </Link>
        </div>
      </section>
    </>
  )
}