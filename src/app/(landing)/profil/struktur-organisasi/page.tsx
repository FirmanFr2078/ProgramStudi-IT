import type { Metadata } from "next";

import { getStrukturOrganisasi } from "@/data/organisasi";
import { PageHeader } from "@/components/landing/page-header";
import { OrgChart } from "@/components/landing/profil/organisasi/org-chart";
import { Tupoksi } from "@/components/landing/profil/organisasi/tupoksi";

export const metadata: Metadata = {
  title: "Struktur Organisasi",
  description:
    "Struktur organisasi dan tugas pokok fungsi pengelola Program Studi Teknik Informatika Universitas Islam Balitar.",
};

export default async function StrukturOrganisasiPage() {
  const data = await getStrukturOrganisasi();
  const posisi = [data.ketuaProdi, data.sekretarisProdi, ...data.koordinator];

  return (
    <>
      <PageHeader
        eyebrow="Profil"
        title="Struktur Organisasi"
        description="Susunan pengelola Program Studi Teknik Informatika beserta tugas pokok dan fungsinya masing-masing."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Profil" },
          { label: "Struktur Organisasi" },
        ]}
      />

      <OrgChart data={data} />
      <Tupoksi items={posisi} />
    </>
  );
}
