import Link from "next/link";
import {
  ArrowRightIcon,
  BracesIcon,
  CodeXmlIcon,
  CpuIcon,
  DatabaseIcon,
  NetworkIcon,
  ServerIcon,
  ShieldCheckIcon,
  SparkleIcon,
} from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/landing/reveal";
import { siteConfig } from "@/config/site";

const title = "Teknik Informatika";

// Posisi sengaja ditulis tetap (bukan Math.random) supaya hasil render stabil.
const floaters = [
  { Icon: CpuIcon, pos: "left-[4%] top-[12%]", size: "size-16", tone: "text-lime", rot: "-8deg", dur: "7s", delay: "0s" },
  { Icon: DatabaseIcon, pos: "left-[14%] top-[42%]", size: "size-12", tone: "text-lavender", rot: "6deg", dur: "5.5s", delay: "-1.5s" },
  { Icon: CodeXmlIcon, pos: "left-[5%] top-[70%]", size: "size-14", tone: "text-lavender", rot: "-4deg", dur: "6.5s", delay: "-3s" },
  { Icon: ShieldCheckIcon, pos: "right-[5%] top-[10%]", size: "size-14", tone: "text-lavender", rot: "9deg", dur: "6s", delay: "-2s" },
  { Icon: NetworkIcon, pos: "right-[15%] top-[38%]", size: "size-16", tone: "text-lime", rot: "-6deg", dur: "7.5s", delay: "-4s" },
  { Icon: BracesIcon, pos: "right-[4%] top-[64%]", size: "size-12", tone: "text-lavender", rot: "5deg", dur: "5s", delay: "-0.5s" },
  { Icon: ServerIcon, pos: "right-[16%] top-[84%]", size: "size-14", tone: "text-lavender", rot: "-9deg", dur: "6.8s", delay: "-2.5s" },
];

// Kotak-kotak kecil seperti serpihan piksel di sekitar judul.
const debris = [
  { color: "bg-lime", pos: "left-[24%] top-[30%] h-1.5 w-8" },
  { color: "bg-lime/60", pos: "left-[30%] top-[64%] h-1 w-5" },
  { color: "bg-primary", pos: "left-[20%] top-[52%] h-2 w-3" },
  { color: "bg-lavender", pos: "left-[36%] top-[20%] h-1 w-10" },
  { color: "bg-lime", pos: "right-[22%] top-[34%] h-1 w-6" },
  { color: "bg-lime/60", pos: "right-[28%] top-[60%] h-2 w-2" },
  { color: "bg-primary", pos: "right-[18%] top-[48%] h-1.5 w-9" },
  { color: "bg-lavender", pos: "right-[34%] top-[74%] h-1 w-4" },
];

// ---------------------------------------------------------------------------
// Pengaturan grid lorong — ubah di sini saja, tidak perlu menyentuh komponen.
// ---------------------------------------------------------------------------
const TUNNEL = {
  perspective: 1200, // px. Makin besar = pembesaran di sisi luar makin kecil
  angle: 45, // derajat. Makin besar = dinding makin "masuk" ke dalam
  cell: 24, // px. Ukuran kotak grid di ruang lokal panel
  line: 0.1, // opacity garis (0 - 1)
  panelWidth: 46, // % lebar tiap panel. Sisanya (100 - 2x) jadi celah tengah
};

// Fade vertikal & horizontal dipasang di ruang LAYAR (bukan di panel yang diputar),
// jadi zona fade-nya tidak ikut membesar oleh perspektif.
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

// inset-4 = posisi yang sama dengan siku sudut (top-4 left-4 dst.), jadi garis
// berhenti dan memudar tepat di bingkai siku, tidak menembus keluar.
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
    <section className="scanlines relative isolate mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-32 md:pb-20">
      {/* latar grid lorong */}
      <TunnelGrid />

      {/* siku sudut, tanda ×, bilah loading */}
      <span aria-hidden className="absolute top-4 left-4 size-5 border-t-2 border-l-2 border-muted-foreground/50" />
      <span aria-hidden className="absolute top-4 right-4 size-5 border-t-2 border-r-2 border-muted-foreground/50" />
      <span aria-hidden className="absolute bottom-4 left-4 size-5 border-b-2 border-l-2 border-muted-foreground/50" />
      <span aria-hidden className="absolute right-4 bottom-4 size-5 border-r-2 border-b-2 border-muted-foreground/50" />
      <div
        aria-hidden
        className="absolute top-5 right-14 hidden flex-col font-mono text-[10px] leading-4 text-muted-foreground sm:flex"
      >
        <span>×</span>
        <span>×</span>
        <span>×</span>
      </div>
      <div
        aria-hidden
        className="absolute bottom-6 left-12 hidden flex-col gap-1.5 font-mono text-[10px] tracking-widest text-muted-foreground sm:flex"
      >
        <span>LOADING...</span>
        <span className="block h-2.5 w-28 border p-px">
          <span className="loadbar block h-full bg-foreground/80" />
        </span>
      </div>

      {/* ikon melayang */}
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

      {/* serpihan piksel */}
      {debris.map(({ color, pos }, i) => (
        <span
          key={pos}
          aria-hidden
          className={cn("blink absolute hidden md:block", color, pos)}
          style={
            {
              "--dur": `${2 + (i % 3)}s`,
              "--delay": `${i * 0.4}s`,
            } as React.CSSProperties
          }
        />
      ))}


      {/* isi */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-[2.6vh] text-center">
        <Reveal>
          <Link
            href="/informasi/kabar"
            className="group inline-flex max-w-[90vw] items-center gap-2 rounded-full border border-input bg-card/60 py-1 pr-3 pl-1 text-[13px] text-muted-foreground backdrop-blur-sm transition-colors hover:border-lime/40 hover:text-foreground"
          >
            <span className="flex items-center gap-1 rounded-full bg-lime/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-lime uppercase">
              <SparkleIcon className="size-3" />
              Baru
            </span>
            <span className="truncate">Pengumuman terbaru dari program studi</span>
            <ArrowRightIcon className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <Reveal delay={100} className="flex flex-col items-center gap-[1.4vh]">
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Program Studi
          </p>
          <h1
            data-text={title}
            className="glitch text-2xl leading-[0.95] font-extrabold tracking-tight whitespace-nowrap uppercase sm:text-4xl lg:text-5xl xl:text-6xl"
          >
            {title}
          </h1>
          <p className="mt-[1vh] text-sm text-muted-foreground sm:text-base">
            {siteConfig.faculty}
            <span className="mx-2.5 text-lime">|</span>
            {siteConfig.university}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p className="border border-input px-4 py-2 font-mono text-[11px] tracking-[0.25em] uppercase sm:text-xs">
            Belajar · Meneliti · <span className="text-lime">Berkarya</span>
          </p>
        </Reveal>

        <Reveal delay={300} className="mt-[0.8vh] flex flex-wrap justify-center gap-3">
          <Link
            href="/profil/profil-prodi"
            className={cn(
              buttonVariants({ size: "lg" }),
              "glow h-11 rounded-full px-6 text-sm",
            )}
          >
            Kenali Prodi
          </Link>
          <Link
            href="/informasi/pendaftaran"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-full px-6 text-sm",
            )}
          >
            Info Pendaftaran
          </Link>
        </Reveal>
      </div>
    </section>
  );
}