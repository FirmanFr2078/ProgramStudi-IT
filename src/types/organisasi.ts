export type OrgPosition = {
  id: string
  jabatan: string
  nama?: string // placeholder, isi nanti
  tupoksi: string[]
}

export type StrukturOrganisasi = {
  pimpinanFakultas: { jabatan: string; nama?: string }
  ketuaProdi: OrgPosition
  sekretarisProdi: OrgPosition
  koordinator: OrgPosition[]
}