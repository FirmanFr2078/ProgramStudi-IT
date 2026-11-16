import "server-only"

import type { Prisma } from "@generated/client"

import { KETUA_PROGRAM_STUDI } from "@/config/structural-roles"
import { JABATAN_TO_LABEL } from "@/database/dosen"
import { logEntityMutation, type Actor } from "@/lib/authorship"
import { prisma } from "@/lib/prisma"
import { getPublicUrl } from "@/lib/storage"
import type {
  IdentitasItem,
  ProfilLulusanItem,
  ProfilProdiAdmin,
  ProfilProdiInput,
  ProfilProdiSambutanDosen,
} from "@/types"

const ENTITY = "tbl_profil_prodi"
const SINGLETON_ID = 1

const DEFAULT_STRUKTUR_ORGANISASI = {
  pimpinanFakultas: null,
  ketuaProdi: null,
  sekretarisProdi: null,
  koordinator: [],
} satisfies Prisma.InputJsonValue

export class ProfilProdiValidationError extends Error {
  constructor(
    public readonly errors: Record<string, string[]>,
    message = "Data Profil Program Studi tidak valid.",
  ) {
    super(message)
    this.name = "ProfilProdiValidationError"
  }
}

function resolveFoto(value: string | null): string | null {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value

  return getPublicUrl("images", value) ?? value
}

/*
  Satu-satunya sumber identitas sambutan.
  Tidak menerima ID dari browser dan tidak membaca FK dari tabel profil.
*/
export async function getKetuaProgramStudi(): Promise<ProfilProdiSambutanDosen | null> {
  const dosen = await prisma.tbl_dosen.findFirst({
    where: {
      jabatan_struktural: KETUA_PROGRAM_STUDI,
    },
    select: {
      id_dosen: true,
      nama: true,
      nidn: true,
      foto: true,
      jabatan_fungsional: true,
      jabatan_struktural: true,
    },
  })

  if (!dosen || !dosen.jabatan_struktural) {
    return null
  }

  return {
    id: String(dosen.id_dosen),
    nama: dosen.nama,
    nidn: dosen.nidn,
    foto: resolveFoto(dosen.foto),
    jabatanFungsional: JABATAN_TO_LABEL[dosen.jabatan_fungsional],
    jabatanStruktural: dosen.jabatan_struktural,
  }
}

function toProfilProdiAdmin(
  row: {
    sambutan_isi: string[]
    sejarah: string[]
    visi: string
    misi: string[]
    tujuan: string[]
    profil_lulusan: Prisma.JsonValue
    identitas: Prisma.JsonValue
    updated_at: Date
  },
  sambutanDosen: ProfilProdiSambutanDosen | null,
): ProfilProdiAdmin {
  return {
    sambutanDosen,
    sambutanIsi: row.sambutan_isi,
    sejarah: row.sejarah,
    visi: row.visi,
    misi: row.misi,
    tujuan: row.tujuan,
    profilLulusan: (row.profil_lulusan as ProfilLulusanItem[] | null) ?? [],
    identitas: (row.identitas as IdentitasItem[] | null) ?? [],
    updatedAt: row.updated_at.toISOString(),
  }
}

function toRowData(input: ProfilProdiInput) {
  return {
    sambutan_isi: input.sambutanIsi,
    sejarah: input.sejarah,
    visi: input.visi,
    misi: input.misi,
    tujuan: input.tujuan,
    profil_lulusan: input.profilLulusan as Prisma.InputJsonValue,
    identitas: input.identitas as Prisma.InputJsonValue,
  }
}

/*
  Dipakai halaman dashboard.
  Walaupun baris tbl_profil_prodi belum ada, ketuaProdi tetap dicari,
  sehingga preview Kaprodi dapat tampil sebelum simpan pertama.
*/
export async function getProfilProdiFormData(): Promise<{
  profil: ProfilProdiAdmin | null
  ketuaProdi: ProfilProdiSambutanDosen | null
}> {
  const [row, ketuaProdi] = await Promise.all([
    prisma.tbl_profil_prodi.findUnique({
      where: { id_profil: SINGLETON_ID },
    }),
    getKetuaProgramStudi(),
  ])

  return {
    profil: row ? toProfilProdiAdmin(row, ketuaProdi) : null,
    ketuaProdi,
  }
}

export async function getProfilProdiAdmin(): Promise<ProfilProdiAdmin | null> {
  const { profil } = await getProfilProdiFormData()
  return profil
}

export async function saveProfilProdi(
  input: ProfilProdiInput,
  actor: Actor,
): Promise<ProfilProdiAdmin> {
  const ketuaProdi = await getKetuaProgramStudi()

  if (!ketuaProdi) {
    throw new ProfilProdiValidationError(
      {
        sambutan: [
          "Belum ada dosen dengan jabatan Ketua Program Studi. Atur jabatan struktural Kaprodi pada menu Dosen terlebih dahulu.",
        ],
      },
      "Sambutan belum dapat disimpan karena Ketua Program Studi belum ditetapkan.",
    )
  }

  const before = await prisma.tbl_profil_prodi.findUnique({
    where: { id_profil: SINGLETON_ID },
  })

  const row = await prisma.tbl_profil_prodi.upsert({
    where: { id_profil: SINGLETON_ID },
    create: {
      id_profil: SINGLETON_ID,
      ...toRowData(input),
      struktur_organisasi: DEFAULT_STRUKTUR_ORGANISASI,
    },
    update: toRowData(input),
  })

  await logEntityMutation({
    actor,
    action: before ? "update" : "create",
    entity: ENTITY,
    entityId: SINGLETON_ID,
    deskripsi: `${actor.nama} ${before ? "memperbarui" : "membuat"} konten Profil Program Studi.`,
    dataLama: before,
    dataBaru: input,
  })

  return toProfilProdiAdmin(row, ketuaProdi)
}