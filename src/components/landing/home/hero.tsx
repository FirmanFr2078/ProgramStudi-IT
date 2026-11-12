import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Laptop, Users } from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/landing/reveal";
import { siteConfig } from "@/config/site";

const highlights = [
  { icon: GraduationCap, label: "Gelar Lulusan", value: "S.Kom (Sarjana Komputer)" },
  { icon: BookOpen, label: "Beban Studi", value: "144 SKS · 8 Semester" },
  { icon: Users, label: "Program Unggulan", value: "MBKM & Magang Industri" },
  { icon: Laptop, label: "Fasilitas", value: "Laboratorium Riset Terpadu" },
];

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20">
      {/* Subtle ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 flex justify-center overflow-hidden"
      >
        <div className="h-[24rem] w-[50rem] max-w-[90vw] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
      </div>

      <div className="flex flex-col items-start gap-8 md:gap-10">
        {/* Eyebrow tag */}
        <Reveal>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
            <span className="size-2 rounded-full bg-lime" />
            <span className="font-medium text-foreground">
              {siteConfig.faculty}
            </span>
            <span className="text-border">/</span>
            <span>{siteConfig.university}</span>
          </div>
        </Reveal>

        {/* Headline & Description */}
        <div className="flex max-w-4xl flex-col gap-5">
          <Reveal delay={60}>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Teknik Informatika
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Pendidikan sarjana komputasi yang memadukan fondasi rekayasa perangkat lunak, sains data, dan kecerdasan buatan dengan kesiapan karir industri serta integritas profesional.
            </p>
          </Reveal>
        </div>

        {/* CTA Actions */}
        <Reveal delay={180} className="flex flex-wrap items-center gap-3.5">
          <Link
            href="/informasi/pendaftaran"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 rounded-xl px-7 text-sm font-semibold transition-all duration-200"
            )}
          >
            Info Pendaftaran Mahasiswa
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/pendidikan/kurikulum"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 rounded-xl border-border/80 bg-card/40 px-7 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-card/80"
            )}
          >
            Struktur Kurikulum
          </Link>
          <Link
            href="/profil/profil-prodi"
            className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Profil Program Studi →
          </Link>
        </Reveal>

        {/* Minimalist Academic Highlights Strip */}
        <Reveal delay={240} className="w-full pt-4">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/70 bg-card/30 p-5 backdrop-blur-sm sm:grid-cols-4 sm:gap-6 sm:p-6">
            {highlights.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary">
                  <Icon className="size-4 text-lime" />
                  <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    {label}
                  </span>
                </div>
                <p className="text-xs font-semibold text-foreground sm:text-sm">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}