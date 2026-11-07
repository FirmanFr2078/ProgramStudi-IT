export type IdentitasItem = { label: string; value: string }

export type Sambutan = {
  nama: string
  jabatan: string
  isi: string[] // paragraf-paragraf
}

export type VisiMisi = {
  visi: string
  misi: string[]
}

export type ProfilLulusanItem = {
  judul: string
  deskripsi: string
}

export type ProgramProfile = {
  sambutan: Sambutan
  sejarah: string[]
  visiMisi: VisiMisi
  tujuan: string[]
  profilLulusan: ProfilLulusanItem[]
  identitas: IdentitasItem[]
}