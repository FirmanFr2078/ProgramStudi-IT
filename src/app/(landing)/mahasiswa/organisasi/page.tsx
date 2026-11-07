import type { Metadata } from "next"
import { ArrowUpRightIcon, UsersIcon } from "lucide-react"
import { cn } from "cn"

import { himaprodi } from "@/config/organisasi-mahasiswa"
import { PageHeader } from "@/components/landing/page-header"
import { Reveal } from "@/components/landing/reveal"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Organisasi Mahasiswa",
  description: `${himaprodi.nama} (${himaprodi.singkatan}) — wadah kemahasiswaan Program Studi Teknik Informatika.`,
}

export default function OrganisasiMahasiswaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mahasiswa"
        title="Organisasi Mahasiswa"
        description="Wadah kemahasiswaan tingkat program studi, dikelola langsung oleh mahasiswa Teknik Informatika."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Mahasiswa" },
          { label: "Organisasi Mahasiswa" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 pt-6 pb-16 sm:px-6 md:pb-24">
        <Reveal className="flex flex-col items-center gap-5 rounded-3xl border bg-card p-8 text-center sm:p-10">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-lime/10 text-lime">
            <UsersIcon className="size-8" />
          </div>

          <div>
            <p className="font-mono text-xs tracking-wider text-lavender uppercase">
              {himaprodi.singkatan}
            </p>
            <h2 className="mt-1 font-heading text-xl font-extrabold sm:text-2xl">
              {himaprodi.nama}
            </h2>
          </div>

          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            {himaprodi.deskripsi}
          </p>

          <ul className="flex flex-col gap-2 text-left text-sm text-muted-foreground">
            {himaprodi.kegiatan.map((k) => (
              <li key={k} className="flex gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-lime" />
                <span>{k}</span>
              </li>
            ))}
          </ul>

          <a
            href={himaprodi.website}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "glow mt-2 gap-1.5 rounded-full px-6 text-sm"
            )}
          >
            Kunjungi Website Himaprodi
            <ArrowUpRightIcon className="size-4" />
          </a>
        </Reveal>
      </section>
    </>
  )
}