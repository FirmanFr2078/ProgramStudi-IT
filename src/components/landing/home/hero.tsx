import Link from "next/link";
import {
  BracesIcon,
  CodeXmlIcon,
  CpuIcon,
  DatabaseIcon,
  NetworkIcon,
  ServerIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/landing/reveal";
import { siteConfig } from "@/config/site";

const title = "Teknik Informatika";

// Ikon melayang di sekitar hero (tampil di layar desktop/laptop)
const floaters = [
  { Icon: CpuIcon, pos: "left-[4%] top-[12%]", size: "size-16", tone: "text-lime", rot: "-8deg", dur: "7s", delay: "0s" },
  { Icon: DatabaseIcon, pos: "left-[14%] top-[42%]", size: "size-12", tone: "text-lavender", rot: "6deg", dur: "5.5s", delay: "-1.5s" },
  { Icon: CodeXmlIcon, pos: "left-[5%] top-[70%]", size: "size-14", tone: "text-lavender", rot: "-4deg", dur: "6.5s", delay: "-3s" },
  { Icon: ShieldCheckIcon, pos: "right-[5%] top-[10%]", size: "size-14", tone: "text-lavender", rot: "9deg", dur: "6s", delay: "-2s" },
  { Icon: NetworkIcon, pos: "right-[15%] top-[38%]", size: "size-16", tone: "text-lime", rot: "-6deg", dur: "7.5s", delay: "-4s" },
  { Icon: BracesIcon, pos: "right-[4%] top-[64%]", size: "size-12", tone: "text-lavender", rot: "5deg", dur: "5s", delay: "-0.5s" },
  { Icon: ServerIcon, pos: "right-[16%] top-[84%]", size: "size-14", tone: "text-lavender", rot: "-9deg", dur: "6.8s", delay: "-2.5s" },
];

const TUNNEL = {
  perspective: 1200,
  angle: 45,
  cell: 24,
  line: 0.08,
  panelWidth: 46,
};

const fadeVertical =
  "linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)";
const fadeHorizontal =
  "linear-gradient(to right, transparent 0%, black 14%, black 36%, transparent 47%, transparent 53%, black 64%, black 86%, transparent 100%)";

function TunnelPanel({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute inset-y-0"
      style={{
        width: `${TUNNEL.panelWidth}%`,
        left: isLeft ? 0 : `${100 - TUNNEL.panelWidth}%`,
        transform: `rotateY(${isLeft ? TUNNEL.angle : -TUNNEL.angle}deg)`,
        transformOrigin: isLeft ? "right center" : "left center",
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,${TUNNEL.line}) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,${TUNNEL.line}) 1px, transparent 1px)`,
        backgroundSize: `${TUNNEL.cell}px ${TUNNEL.cell}px`,
      }}
    />
  );
}

function TunnelGrid() {
  return (
    <div
      aria-hidden
      className="absolute inset-4 -z-10 overflow-hidden"
      style={{ maskImage: fadeVertical, WebkitMaskImage: fadeVertical }}
    >
      <div
        className="absolute inset-0"
        style={{
          perspective: `${TUNNEL.perspective}px`,
          maskImage: fadeHorizontal,
          WebkitMaskImage: fadeHorizontal,
        }}
      >
        <TunnelPanel side="left" />
        <TunnelPanel side="right" />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative isolate mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-14 text-center sm:px-6 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24">
      {/* Latar grid lorong 3D perspektif */}
      <TunnelGrid />

      {/* Latar ambient glow halus di tengah */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 -z-10 flex justify-center overflow-hidden"
      >
        <div className="h-[28rem] w-[46rem] max-w-[90vw] rounded-full bg-lime/10 blur-[100px] dark:bg-lime/5" />
      </div>

      {/* Ikon melayang di sekitar judul (muncul di desktop, aman dari mobile overflow) */}
      {floaters.map(({ Icon, pos, size, tone, rot, dur, delay }) => (
        <div
          key={pos}
          aria-hidden
          className={cn(
            "float absolute hidden items-center justify-center rounded-2xl border bg-card/60 shadow-lg backdrop-blur-sm lg:flex",
            size,
            pos,
          )}
          style={
            {
              "--rot": rot,
              "--dur": dur,
              "--delay": delay,
            } as React.CSSProperties
          }
        >
          <Icon className={cn("size-1/2", tone)} />
        </div>
      ))}

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-6">
        <Reveal>
          <Link
            href="/informasi/kabar"
            className="group inline-flex max-w-[92vw] items-center gap-2.5 rounded-full border border-border bg-card/70 py-1.5 pr-4 pl-2 text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:border-lime/40 hover:text-foreground"
          >
            <span className="rounded-full bg-lime/15 px-2.5 py-0.5 text-[11px] font-semibold text-lime">
              Kabar
            </span>
            <span className="truncate">Pengumuman terbaru dari program studi</span>
          </Link>
        </Reveal>

        <Reveal delay={80} className="flex flex-col items-center gap-3">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Program Studi
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base md:text-lg">
            {siteConfig.faculty}
            <span className="mx-2.5 text-lime">|</span>
            {siteConfig.university}
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p className="rounded-full border border-border bg-card/40 px-5 py-2 text-xs font-medium tracking-wide text-foreground/80 sm:text-sm">
            Belajar · Meneliti · <span className="text-lime">Berkarya</span>
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/profil/profil-prodi"
            className={cn(
              buttonVariants({ size: "lg" }),
              "glow h-11 rounded-full px-7 text-sm font-semibold",
            )}
          >
            Kenali Prodi
          </Link>
          <Link
            href="/informasi/pendaftaran"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-full px-7 text-sm font-semibold",
            )}
          >
            Info Pendaftaran
          </Link>
        </Reveal>
      </div>
    </section>
  );
}