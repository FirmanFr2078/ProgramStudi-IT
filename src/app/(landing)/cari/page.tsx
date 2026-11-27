import type { Metadata } from "next"

import { SearchPage } from "@/components/landing/search-page"
import { getAllKabar } from "@/data/kabar"

export const metadata: Metadata = {
  title: "Pencarian",
  description: "Cari informasi pada situs Program Studi Teknik Informatika.",
}

export default async function SearchRoute() {
  const kabar = await getAllKabar()
  return <SearchPage kabar={kabar} />
}