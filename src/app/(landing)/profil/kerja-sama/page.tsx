import type { Metadata } from "next";

import { getKerjaSama } from "@/data/kerja-sama";
import { PageHeader } from "@/components/landing/page-header";
import { KerjaSamaList } from "@/components/landing/profil/kerja-sama/list";

export const metadata: Metadata = {
  title: "Kerja Sama",
  description:
    "Mitra kerja sama Program Studi Teknik Informatika Universitas Islam Balitar dari dunia usaha, perguruan tinggi, pemerintah, organisasi profesi, dan media.",
};

export default async function KerjaSamaPage() {
  const mitra = await getKerjaSama();

  return (
    <>
      <PageHeader
        eyebrow="Profil"
        title="Kerja Sama"
        description="Program studi menjalin kerja sama lintas sektor — dunia usaha, perguruan tinggi, pemerintah, organisasi profesi, hingga media — untuk memperkaya pengalaman belajar mahasiswa."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Profil" },
          { label: "Kerja Sama" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <KerjaSamaList data={mitra} />
      </section>
    </>
  );
}
