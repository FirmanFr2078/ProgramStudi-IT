import type { StrukturOrganisasi } from "@/types"

const dummy: StrukturOrganisasi = {
  pimpinanFakultas: {
    jabatan: "Dekan Fakultas Teknik dan Informatika",
    nama: "[Nama Dekan]",
  },
  ketuaProdi: {
    id: "ketua-prodi",
    jabatan: "Ketua Program Studi",
    nama: "[Nama Ketua Prodi]",
    tupoksi: [
      "Memimpin penyelenggaraan pendidikan di program studi.",
      "Menyusun dan mengevaluasi kurikulum bersama tim dosen.",
      "Bertanggung jawab atas mutu akademik dan akreditasi program studi.",
      "Melaporkan kinerja program studi kepada Dekan.",
    ],
  },
  sekretarisProdi: {
    id: "sekretaris-prodi",
    jabatan: "Sekretaris Program Studi",
    nama: "[Nama Sekretaris Prodi]",
    tupoksi: [
      "Membantu Ketua Program Studi dalam administrasi akademik.",
      "Mengelola data dan dokumen program studi.",
      "Mengoordinasikan jadwal perkuliahan dan ujian.",
    ],
  },
  koordinator: [
    {
      id: "koor-akademik",
      jabatan: "Koordinator Akademik & Kurikulum",
      tupoksi: [
        "Mengembangkan dan meninjau kurikulum secara berkala.",
        "Mengoordinasikan proses pembelajaran dan evaluasi mata kuliah.",
      ],
    },
    {
      id: "koor-kemahasiswaan",
      jabatan: "Koordinator Kemahasiswaan & Alumni",
      tupoksi: [
        "Membina kegiatan dan organisasi kemahasiswaan.",
        "Menjaga komunikasi dan penelusuran alumni (tracer study).",
      ],
    },
    {
      id: "koor-penelitian",
      jabatan: "Koordinator Penelitian & Pengabdian",
      tupoksi: [
        "Mendorong dan memfasilitasi penelitian dosen dan mahasiswa.",
        "Mengoordinasikan kegiatan pengabdian kepada masyarakat.",
      ],
    },
    {
      id: "koor-kerjasama",
      jabatan: "Koordinator Kerja Sama & Hubungan Industri",
      tupoksi: [
        "Menjalin dan memelihara kerja sama dengan industri dan institusi lain.",
        "Mengoordinasikan program magang dan penyaluran kerja lulusan.",
      ],
    },
  ],
}

// Nanti isi fungsi ini diganti query database; pemanggilnya tidak berubah.
export async function getStrukturOrganisasi(): Promise<StrukturOrganisasi> {
  return dummy
}