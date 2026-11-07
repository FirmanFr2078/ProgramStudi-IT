import {
  ArrowLeftRightIcon,
  BriefcaseIcon,
  FlaskConicalIcon,
  GraduationCapIcon,
  HeartHandshakeIcon,
  HomeIcon,
  LightbulbIcon,
  RocketIcon,
} from "lucide-react"

import type { BentukKegiatan, Dokumen, LangkahMbkm } from "@/types"

const bentukKegiatan: BentukKegiatan[] = [
  { id: "1", nama: "Pertukaran Pelajar", icon: ArrowLeftRightIcon },
  { id: "2", nama: "Magang / Praktik Kerja", icon: BriefcaseIcon },
  { id: "3", nama: "Asistensi Mengajar", icon: GraduationCapIcon },
  { id: "4", nama: "Penelitian / Riset", icon: FlaskConicalIcon },
  { id: "5", nama: "Proyek Kemanusiaan", icon: HeartHandshakeIcon },
  { id: "6", nama: "Kegiatan Wirausaha", icon: RocketIcon },
  { id: "7", nama: "Studi / Proyek Independen", icon: LightbulbIcon },
  { id: "8", nama: "Membangun Desa / KKNT", icon: HomeIcon },
]

const langkah: LangkahMbkm[] = [
  {
    id: "1",
    judul: "Pilih Program",
    deskripsi: "Tentukan bentuk kegiatan MBKM yang sesuai minat dan rencana studimu.",
  },
  {
    id: "2",
    judul: "Konsultasi Dosen PA",
    deskripsi: "Diskusikan rencana kegiatan dan rencana konversi SKS dengan Dosen Pembimbing Akademik.",
  },
  {
    id: "3",
    judul: "Daftar di Platform MBKM",
    deskripsi: "Ajukan pendaftaran melalui platform resmi MBKM Kemendikbud atau mitra terkait.",
  },
  {
    id: "4",
    judul: "Konversi SKS",
    deskripsi: "Setelah kegiatan selesai, ajukan konversi nilai dan SKS ke program studi.",
  },
]

const dokumen: Dokumen[] = [
  { id: "1", label: "Panduan Konversi SKS MBKM", url: "#", aktif: true },
  { id: "2", label: "Pedoman MBKM Program Studi", url: "#" },
]

export async function getBentukKegiatan(): Promise<BentukKegiatan[]> {
  return bentukKegiatan
}

export async function getLangkahMbkm(): Promise<LangkahMbkm[]> {
  return langkah
}

export async function getDokumenMbkm(): Promise<Dokumen[]> {
  return dokumen
}