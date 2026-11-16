import { z } from "zod"

const requiredText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(max, `${label} maksimal ${max} karakter`)

const textListSchema = (label: string, maxItems: number, maxLength: number) =>
  z
    .array(
      z
        .string()
        .trim()
        .min(1, `${label} tidak boleh kosong`)
        .max(maxLength, `${label} maksimal ${maxLength} karakter`),
    )
    .min(1, `Isi minimal 1 ${label.toLowerCase()}`)
    .max(maxItems, `${label} maksimal ${maxItems} item`)

export const profilLulusanItemSchema = z.object({
  judul: requiredText(150, "Judul profil lulusan"),
  deskripsi: requiredText(500, "Deskripsi profil lulusan"),
})

export type ProfilLulusanItem = z.infer<typeof profilLulusanItemSchema>

export const identitasItemSchema = z.object({
  label: requiredText(100, "Label identitas"),
  value: requiredText(255, "Isi identitas"),
})

export type IdentitasItem = z.infer<typeof identitasItemSchema>

export const profilProdiInputSchema = z.object({
  sambutanIsi: textListSchema("Paragraf sambutan", 10, 2000),
  sejarah: textListSchema("Paragraf sejarah", 15, 2000),
  visi: requiredText(1000, "Visi"),
  misi: textListSchema("Misi", 15, 500),
  tujuan: textListSchema("Tujuan", 15, 500),
  profilLulusan: z
    .array(profilLulusanItemSchema)
    .min(1, "Isi minimal 1 profil lulusan")
    .max(20, "Profil lulusan maksimal 20 item"),
  identitas: z
    .array(identitasItemSchema)
    .min(1, "Isi minimal 1 identitas")
    .max(20, "Identitas maksimal 20 item"),
})

export type ProfilProdiInput = z.infer<typeof profilProdiInputSchema>

export type ProfilProdiSambutanDosen = {
  id: string
  nama: string
  nidn: string
  foto: string | null
  jabatanFungsional: string
  jabatanStruktural: string
}

export type ProfilProdiAdmin = {
  sambutanDosen: ProfilProdiSambutanDosen | null
  sambutanIsi: string[]
  sejarah: string[]
  visi: string
  misi: string[]
  tujuan: string[]
  profilLulusan: ProfilLulusanItem[]
  identitas: IdentitasItem[]
  updatedAt: string
}