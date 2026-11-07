import type { Metadata } from "next";

import { getProgramProfile } from "@/data/profile";

import { PageHeader } from "@/components/landing/page-header";
import { Reveal } from "@/components/landing/reveal";
import { Sambutan } from "@/components/landing/profil/profile-prodi/sambutan";
import { VisiMisi } from "@/components/landing/profil/profile-prodi/visi-misi";
import { Tujuan } from "@/components/landing/profil/profile-prodi/tujuan";
import { ProfilLulusan } from "@/components/landing/profil/profile-prodi/profil-lulusan";
import { Identitas } from "@/components/landing/profil/profile-prodi/identitas";
import { Cta } from "@/components/landing/home/cta";

export const metadata: Metadata = {
  title: "Profil Prodi",
  description:
    "Sejarah, visi misi, profil lulusan, dan identitas Program Studi Teknik Informatika Universitas Islam Balitar.",
};

export default async function ProfilPage() {
  const profile = await getProgramProfile();

  return (
    <>
      <PageHeader
        eyebrow="Profil"
        title="Profil Program Studi"
        description="Mengenal lebih dekat Program Studi Teknik Informatika — sejarah, arah, dan lulusan yang kami siapkan."
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Profil" },
          { label: "Profil Prodi" },
        ]}
      />

      <Sambutan data={profile.sambutan} />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.35em] text-lavender uppercase">
            Sejarah
          </p>
          <h2 className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
            Perjalanan Kami
          </h2>
        </Reveal>
        <Reveal delay={100} className="mt-6 flex flex-col gap-4">
          {profile.sejarah.map((p, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {p}
            </p>
          ))}
        </Reveal>
      </section>

      <VisiMisi data={profile.visiMisi} />
      <Tujuan items={profile.tujuan} />
      <ProfilLulusan items={profile.profilLulusan} />
      <Identitas items={profile.identitas} />

      <Cta />
    </>
  );
}
