-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin');

-- CreateEnum
CREATE TYPE "KategoriKabar" AS ENUM ('Berita', 'Pengumuman');

-- CreateEnum
CREATE TYPE "KategoriEvent" AS ENUM ('Seminar', 'Workshop', 'Lomba', 'Kuliah Umum', 'Lainnya');

-- CreateEnum
CREATE TYPE "JabatanFungsional" AS ENUM ('Tenaga Pengajar', 'Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar');

-- CreateEnum
CREATE TYPE "UnitKerja" AS ENUM ('Tata Usaha', 'Layanan Akademik', 'Laboratorium', 'Perpustakaan', 'Keuangan & Umum');

-- CreateEnum
CREATE TYPE "StatusKarier" AS ENUM ('Bekerja', 'Wirausaha', 'Melanjutkan Studi', 'Mencari Kerja');

-- CreateEnum
CREATE TYPE "TingkatPrestasi" AS ENUM ('Internasional', 'Nasional', 'Provinsi', 'Kampus');

-- CreateEnum
CREATE TYPE "KategoriMitra" AS ENUM ('Dunia Usaha & Industri', 'Perguruan Tinggi', 'Pemerintah & Instansi', 'Organisasi Profesi', 'Media & Komunitas');

-- CreateEnum
CREATE TYPE "KategoriFasilitas" AS ENUM ('Laboratorium', 'Ruang Kelas', 'Gedung', 'Perpustakaan', 'sarana administrasi');

-- CreateEnum
CREATE TYPE "JenisRiset" AS ENUM ('Penelitian', 'Pengabdian');

-- CreateEnum
CREATE TYPE "JenisHki" AS ENUM ('Hak Cipta', 'Paten', 'Paten Sederhana', 'Desain Industri', 'Merek');

-- CreateEnum
CREATE TYPE "StatusHki" AS ENUM ('Terdaftar', 'Dalam Proses');

-- CreateEnum
CREATE TYPE "Hari" AS ENUM ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat');

-- CreateEnum
CREATE TYPE "JenisMataKuliah" AS ENUM ('Wajib', 'Pilihan');

-- CreateEnum
CREATE TYPE "ModulDokumen" AS ENUM ('Kurikulum', 'Kalender', 'Mbkm');

-- CreateTable
CREATE TABLE "tbl_profiles" (
    "id_profile" UUID NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "foto" VARCHAR(255),
    "role" "Role" NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_profiles_pkey" PRIMARY KEY ("id_profile")
);

-- CreateTable
CREATE TABLE "tbl_kabar" (
    "id_kabar" BIGSERIAL NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "judul" VARCHAR(200) NOT NULL,
    "ringkasan" VARCHAR(300) NOT NULL,
    "konten" TEXT[],
    "kategori" "KategoriKabar" NOT NULL,
    "tanggal" DATE NOT NULL,
    "gambar" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_kabar_pkey" PRIMARY KEY ("id_kabar")
);

-- CreateTable
CREATE TABLE "tbl_event" (
    "id_event" BIGSERIAL NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "judul" VARCHAR(200) NOT NULL,
    "ringkasan" VARCHAR(300) NOT NULL,
    "konten" TEXT[],
    "kategori" "KategoriEvent" NOT NULL,
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE,
    "waktu" VARCHAR(50),
    "lokasi" VARCHAR(200) NOT NULL,
    "tautan_daftar" VARCHAR(255),
    "gambar" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_event_pkey" PRIMARY KEY ("id_event")
);

-- CreateTable
CREATE TABLE "tbl_dosen" (
    "id_dosen" BIGSERIAL NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "nidn" VARCHAR(20) NOT NULL,
    "jabatan_struktural" VARCHAR(100),
    "jabatan_fungsional" "JabatanFungsional" NOT NULL,
    "pendidikan_s1_bidang" VARCHAR(100) NOT NULL,
    "pendidikan_s1_kampus" VARCHAR(150) NOT NULL,
    "pendidikan_s2_bidang" VARCHAR(100),
    "pendidikan_s2_kampus" VARCHAR(150),
    "pendidikan_s3_bidang" VARCHAR(100),
    "pendidikan_s3_kampus" VARCHAR(150),
    "bidang_keahlian" TEXT[],
    "mata_kuliah" TEXT[],
    "email" VARCHAR(150) NOT NULL,
    "foto" VARCHAR(255),
    "sinta" VARCHAR(255),
    "google_scholar" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_dosen_pkey" PRIMARY KEY ("id_dosen")
);

-- CreateTable
CREATE TABLE "tbl_tendik" (
    "id_tendik" BIGSERIAL NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "jabatan" VARCHAR(100) NOT NULL,
    "unit_kerja" "UnitKerja" NOT NULL,
    "tugas" TEXT[],
    "lokasi" VARCHAR(150) NOT NULL,
    "jam_layanan" VARCHAR(50) NOT NULL,
    "pendidikan" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "telepon" VARCHAR(20),
    "foto" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_tendik_pkey" PRIMARY KEY ("id_tendik")
);

-- CreateTable
CREATE TABLE "tbl_alumni" (
    "id_alumni" BIGSERIAL NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "nim" VARCHAR(30) NOT NULL,
    "tahun_lulus" INTEGER NOT NULL,
    "status_karier" "StatusKarier" NOT NULL,
    "pekerjaan" VARCHAR(200),

    CONSTRAINT "tbl_alumni_pkey" PRIMARY KEY ("id_alumni")
);

-- CreateTable
CREATE TABLE "tbl_prestasi" (
    "id_prestasi" BIGSERIAL NOT NULL,
    "judul" VARCHAR(200) NOT NULL,
    "penyelenggara" VARCHAR(200) NOT NULL,
    "tingkat" "TingkatPrestasi" NOT NULL,
    "mahasiswa" TEXT[],
    "peringkat" VARCHAR(50) NOT NULL,
    "tahun" INTEGER NOT NULL,
    "pembimbing" VARCHAR(150),

    CONSTRAINT "tbl_prestasi_pkey" PRIMARY KEY ("id_prestasi")
);

-- CreateTable
CREATE TABLE "tbl_mitra" (
    "id_mitra" BIGSERIAL NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "nama" VARCHAR(200) NOT NULL,
    "kategori" "KategoriMitra" NOT NULL,
    "ringkasan" VARCHAR(300) NOT NULL,
    "lingkup" TEXT[],
    "deskripsi" TEXT[],
    "mulai" DATE NOT NULL,
    "berakhir" DATE,
    "pic" VARCHAR(150),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_mitra_pkey" PRIMARY KEY ("id_mitra")
);

-- CreateTable
CREATE TABLE "tbl_fasilitas" (
    "id_fasilitas" BIGSERIAL NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "nama" VARCHAR(200) NOT NULL,
    "kategori" "KategoriFasilitas" NOT NULL,
    "foto" VARCHAR(255),
    "lokasi" VARCHAR(150) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "kapasitas" INTEGER,
    "fitur" TEXT[],

    CONSTRAINT "tbl_fasilitas_pkey" PRIMARY KEY ("id_fasilitas")
);

-- CreateTable
CREATE TABLE "tbl_riset" (
    "id_riset" BIGSERIAL NOT NULL,
    "jenis" "JenisRiset" NOT NULL,
    "judul" VARCHAR(250) NOT NULL,
    "ketua" VARCHAR(150) NOT NULL,
    "anggota" TEXT[],
    "tahun" INTEGER NOT NULL,
    "sumber_dana" VARCHAR(150) NOT NULL,

    CONSTRAINT "tbl_riset_pkey" PRIMARY KEY ("id_riset")
);

-- CreateTable
CREATE TABLE "tbl_hki" (
    "id_hki" BIGSERIAL NOT NULL,
    "judul" VARCHAR(250) NOT NULL,
    "jenis" "JenisHki" NOT NULL,
    "pencipta" TEXT[],
    "nomor" VARCHAR(100) NOT NULL,
    "tahun" INTEGER NOT NULL,
    "status" "StatusHki" NOT NULL,

    CONSTRAINT "tbl_hki_pkey" PRIMARY KEY ("id_hki")
);

-- CreateTable
CREATE TABLE "tbl_jadwal" (
    "id_jadwal" BIGSERIAL NOT NULL,
    "hari" "Hari" NOT NULL,
    "jam_mulai" VARCHAR(5) NOT NULL,
    "jam_selesai" VARCHAR(5) NOT NULL,
    "mata_kuliah" VARCHAR(150) NOT NULL,
    "sks" INTEGER NOT NULL,
    "kelas" VARCHAR(20) NOT NULL,
    "dosen" VARCHAR(150) NOT NULL,
    "ruang" VARCHAR(50) NOT NULL,

    CONSTRAINT "tbl_jadwal_pkey" PRIMARY KEY ("id_jadwal")
);

-- CreateTable
CREATE TABLE "tbl_tanggal_penting" (
    "id_tanggal" BIGSERIAL NOT NULL,
    "mulai" DATE NOT NULL,
    "selesai" DATE,
    "keterangan" VARCHAR(255) NOT NULL,

    CONSTRAINT "tbl_tanggal_penting_pkey" PRIMARY KEY ("id_tanggal")
);

-- CreateTable
CREATE TABLE "tbl_mata_kuliah" (
    "id_mata_kuliah" BIGSERIAL NOT NULL,
    "kode" VARCHAR(20) NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "sks" INTEGER NOT NULL,
    "jenis" "JenisMataKuliah" NOT NULL,
    "semester" INTEGER NOT NULL,

    CONSTRAINT "tbl_mata_kuliah_pkey" PRIMARY KEY ("id_mata_kuliah")
);

-- CreateTable
CREATE TABLE "tbl_bentuk_kegiatan" (
    "id_kegiatan" BIGSERIAL NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "icon" VARCHAR(50) NOT NULL,

    CONSTRAINT "tbl_bentuk_kegiatan_pkey" PRIMARY KEY ("id_kegiatan")
);

-- CreateTable
CREATE TABLE "tbl_langkah_mbkm" (
    "id_langkah" BIGSERIAL NOT NULL,
    "judul" VARCHAR(150) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tbl_langkah_mbkm_pkey" PRIMARY KEY ("id_langkah")
);

-- CreateTable
CREATE TABLE "tbl_dokumen" (
    "id_dokumen" BIGSERIAL NOT NULL,
    "modul" "ModulDokumen" NOT NULL,
    "label" VARCHAR(150) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tbl_dokumen_pkey" PRIMARY KEY ("id_dokumen")
);

-- CreateTable
CREATE TABLE "tbl_profil_prodi" (
    "id_profil" INTEGER NOT NULL DEFAULT 1,
    "sambutan_nama" VARCHAR(150) NOT NULL,
    "sambutan_jabatan" VARCHAR(100) NOT NULL,
    "sambutan_isi" TEXT[],
    "sejarah" TEXT[],
    "visi" TEXT NOT NULL,
    "misi" TEXT[],
    "tujuan" TEXT[],
    "profil_lulusan" JSONB NOT NULL,
    "identitas" JSONB NOT NULL,
    "struktur_organisasi" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_profil_prodi_pkey" PRIMARY KEY ("id_profil")
);

-- CreateTable
CREATE TABLE "tbl_jalur_pendaftaran" (
    "id_jalur" BIGSERIAL NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "syarat" TEXT[],

    CONSTRAINT "tbl_jalur_pendaftaran_pkey" PRIMARY KEY ("id_jalur")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_profiles_email_key" ON "tbl_profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_kabar_slug_key" ON "tbl_kabar"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_event_slug_key" ON "tbl_event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_dosen_slug_key" ON "tbl_dosen"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_dosen_nidn_key" ON "tbl_dosen"("nidn");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_dosen_email_key" ON "tbl_dosen"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_tendik_slug_key" ON "tbl_tendik"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_tendik_email_key" ON "tbl_tendik"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_alumni_nim_key" ON "tbl_alumni"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_mitra_slug_key" ON "tbl_mitra"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_fasilitas_slug_key" ON "tbl_fasilitas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_hki_nomor_key" ON "tbl_hki"("nomor");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_mata_kuliah_kode_key" ON "tbl_mata_kuliah"("kode");
