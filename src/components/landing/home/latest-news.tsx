import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "cn"

import { getBerita } from "@/data/berita"
import { Reveal } from "@/components/landing/reveal"

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export async function LatestNews() {
  const berita = await getBerita(3)
  const [utama, ...lainnya] = berita

  if (!utama) return null

  return (
    <section
      id="berita-terkini"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"
    >
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Terkini
          </p>
          <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
            Kabar Terbaru
          </h2>
        </div>
        <Link
          href="/berita"
          className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Lihat semua
          <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-3">
        {/* Berita utama — besar */}
        <Reveal className="lg:col-span-2">
          <Link
            href={`/berita/${utama.slug}`}
            className="group relative flex h-full min-h-72 flex-col justify-end overflow-hidden rounded-2xl border p-6 transition-colors hover:border-lime"
            style={
              utama.gambar
                ? {
                    backgroundImage: `linear-gradient(to top, var(--background) 10%, transparent 60%), url(${utama.gambar})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            {!utama.gambar && (
              <div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                  backgroundImage:
                    "radial-gradient(60% 50% at 30% 20%, color-mix(in oklab, var(--c-lilac) 16%, transparent), transparent)",
                  backgroundColor: "var(--card)",
                }}
              />
            )}
            <span
              className={cn(
                "mb-3 w-fit rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase",
                utama.kategori === "Pengumuman"
                  ? "bg-lime/10 text-lime"
                  : "bg-accent text-lavender"
              )}
            >
              {utama.kategori}
            </span>
            <h3 className="text-xl font-bold sm:text-2xl">{utama.judul}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatTanggal(utama.tanggal)}
            </p>
          </Link>
        </Reveal>

        {/* Berita kecil — ditumpuk */}
        <div className="flex flex-col gap-6">
          {lainnya.map((b, i) => (
            <Reveal key={b.slug} delay={(i + 1) * 100} className="flex-1">
              <Link
                href={`/berita/${b.slug}`}
                className="group flex h-full flex-col justify-center rounded-2xl border bg-card p-5 transition-colors hover:border-lime"
              >
                <span
                  className={cn(
                    "mb-2 w-fit rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase",
                    b.kategori === "Pengumuman"
                      ? "bg-lime/10 text-lime"
                      : "bg-accent text-lavender"
                  )}
                >
                  {b.kategori}
                </span>
                <h3 className="text-sm font-bold">{b.judul}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
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