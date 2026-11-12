import Link from "next/link"
import { cn } from "cn"

import { getKabar } from "@/data/kabar"
import { Reveal } from "@/components/landing/reveal"
import { formatTanggal } from "@/lib/utils"

export async function LatestNews() {
  const kabar = await getKabar(3)
  const [utama, ...lainnya] = kabar

  if (!utama) return null

  return (
    <section
      id="kabar-terkini"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16"
    >
      <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Publikasi & Agenda
          </span>
          <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl md:text-4xl">
            Warta & Kabar Terbaru
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Informasi kegiatan, pengumuman akademik, dan prestasi civitas akademika Teknik Informatika.
          </p>
        </div>
        <Link
          href="/informasi/kabar"
          className="text-sm font-semibold text-primary transition-colors hover:text-foreground"
        >
          Lihat Semua Kabar →
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-3">
        {/* Kabar utama — besar */}
        <Reveal className="lg:col-span-2">
          <Link
            href={`/informasi/kabar/${utama.slug}`}
            className="group relative flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur-sm transition-all duration-200 hover:border-lime/60 hover:bg-card/70 hover:shadow-lg hover:shadow-lime/5 sm:p-8"
            style={
              utama.gambar
                ? {
                    backgroundImage: `linear-gradient(to top, var(--background) 15%, transparent 70%), url(${utama.gambar})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            {!utama.gambar && (
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-br from-card/80 to-card/30"
              />
            )}
            <div className="relative z-10 flex flex-col gap-2.5">
              <span
                className={cn(
                  "w-fit rounded-md px-2.5 py-1 text-xs font-semibold",
                  utama.kategori === "Pengumuman"
                    ? "bg-lime/15 text-lime"
                    : "bg-primary/15 text-primary"
                )}
              >
                {utama.kategori}
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground transition-colors group-hover:text-lime sm:text-2xl">
                {utama.judul}
              </h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {formatTanggal(utama.tanggal)}
              </p>
            </div>
          </Link>
        </Reveal>

        {/* Kabar kecil — ditumpuk */}
        <div className="flex flex-col gap-5">
          {lainnya.map((b, i) => (
            <Reveal key={b.slug} delay={(i + 1) * 80} className="flex-1">
              <Link
                href={`/informasi/kabar/${b.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur-sm transition-all duration-200 hover:border-lime/60 hover:bg-card/70 hover:shadow-md hover:shadow-lime/5"
              >
                <div className="flex flex-col gap-2.5">
                  <span
                    className={cn(
                      "w-fit rounded-md px-2.5 py-0.5 text-xs font-semibold",
                      b.kategori === "Pengumuman"
                        ? "bg-lime/15 text-lime"
                        : "bg-primary/15 text-primary"
                    )}
                  >
                    {b.kategori}
                  </span>
                  <h3 className="font-heading text-base font-bold text-foreground transition-colors group-hover:text-lime">
                    {b.judul}
                  </h3>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  {formatTanggal(b.tanggal)}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}