import type { ProgramProfile } from "@/types"

const dummy: ProgramProfile = {
  sambutan: {
    nama: "[Nama Ketua Program Studi]",
    jabatan: "Ketua Program Studi Teknik Informatika",
    isi: [
      "Selamat datang di Program Studi Teknik Informatika, Universitas Islam Balitar. Kami percaya bahwa dunia teknologi informasi bergerak sangat cepat, dan tugas kami adalah menyiapkan mahasiswa tidak hanya menguasai teori, tetapi juga siap menghadapi persoalan nyata di industri.",
      "Melalui kurikulum yang terus diperbarui, dukungan dosen yang kompeten, serta jejaring kerja sama industri, kami berkomitmen mengantarkan setiap mahasiswa menjadi lulusan yang kompeten, adaptif, dan berakhlak mulia.",
    ],
  },
  sejarah: [
    "Program Studi Teknik Informatika Universitas Islam Balitar didirikan sebagai jawaban atas kebutuhan tenaga ahli di bidang teknologi informasi, khususnya di wilayah Blitar dan sekitarnya.",
    "Sejak berdiri, program studi terus mengembangkan kurikulum dan fasilitas agar relevan dengan perkembangan industri, mulai dari rekayasa perangkat lunak, data sains, hingga keamanan siber.",
  ],
  visiMisi: {
    visi:
      "Menjadi program studi Teknik Informatika yang unggul, islami, dan berdaya saing di tingkat nasional pada tahun [target tahun].",
    misi: [
      "Menyelenggarakan pendidikan Teknik Informatika yang berkualitas dan relevan dengan kebutuhan industri.",
      "Melaksanakan penelitian dan publikasi ilmiah di bidang teknologi informasi.",
      "Melaksanakan pengabdian kepada masyarakat berbasis teknologi informasi.",
      "Membangun kerja sama dengan industri dan institusi pendidikan lain.",
    ],
  },
  tujuan: [
    "Menghasilkan lulusan yang kompeten di bidang rekayasa perangkat lunak, data, dan jaringan.",
    "Menghasilkan karya penelitian yang bermanfaat bagi pengembangan ilmu dan masyarakat.",
    "Membekali mahasiswa dengan nilai-nilai keislaman dan etika profesi.",
    "Memperluas jejaring kerja sama dengan mitra industri dan pemerintah.",
  ],
  profilLulusan: [
    {
      judul: "Software Developer",
      deskripsi: "Merancang dan membangun aplikasi web, mobile, maupun desktop.",
    },
    {
      judul: "Data Analyst / Data Scientist",
      deskripsi: "Mengolah data menjadi informasi dan keputusan bisnis.",
    },
    {
      judul: "Network & Security Engineer",
      deskripsi: "Membangun dan mengamankan infrastruktur jaringan.",
    },
    {
      judul: "Technopreneur",
      deskripsi: "Merintis usaha sendiri berbasis produk atau jasa teknologi.",
    },
  ],
  identitas: [
    { label: "Nama Program Studi", value: "Teknik Informatika" },
    { label: "Jenjang", value: "Sarjana (S1)" },
    { label: "Fakultas", value: "Fakultas Teknik dan Informatika" },
    { label: "Perguruan Tinggi", value: "Universitas Islam Balitar" },
    { label: "Gelar Lulusan", value: "S.Kom. (Sarjana Komputer)" },
    { label: "Akreditasi", value: "[Peringkat akreditasi] — BAN-PT/LAM Infokom" },
    { label: "SK Penyelenggaraan", value: "[Nomor SK dan tanggal]" },
    { label: "Lama Studi Normal", value: "4 tahun (8 semester), 144 SKS" },
  ],
}

// Nanti isi fungsi ini diganti query database; pemanggilnya tidak berubah.
export async function getProgramProfile(): Promise<ProgramProfile> {
  return dummy
}