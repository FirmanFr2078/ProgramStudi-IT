/*
  Warnings:

  - You are about to drop the column `berakhir` on the `tbl_mitra` table. All the data in the column will be lost.
  - You are about to drop the column `kategori` on the `tbl_mitra` table. All the data in the column will be lost.
  - You are about to drop the column `lingkup` on the `tbl_mitra` table. All the data in the column will be lost.
  - You are about to drop the column `mulai` on the `tbl_mitra` table. All the data in the column will be lost.
  - You are about to drop the column `pic` on the `tbl_mitra` table. All the data in the column will be lost.
  - Added the required column `kategori_id` to the `tbl_mitra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tingkat` to the `tbl_mitra` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TingkatKerjaSama" AS ENUM ('Internasional', 'Nasional', 'Lokal/Wilayah');

-- CreateEnum
CREATE TYPE "BidangKerjaSama" AS ENUM ('Pendidikan', 'Penelitian', 'Pengabdian Masyarakat', 'Pengembangan Kelembagaan');

-- CreateEnum
CREATE TYPE "JenisNaskah" AS ENUM ('LoI', 'MoU', 'PKS', 'IA', 'Addendum');

-- CreateEnum
CREATE TYPE "StatusNaskah" AS ENUM ('Draft', 'Berlaku', 'Dibatalkan');

-- CreateEnum
CREATE TYPE "StatusKegiatan" AS ENUM ('Direncanakan', 'Berjalan', 'Selesai', 'Dibatalkan');

-- CreateEnum
CREATE TYPE "JenisBerkas" AS ENUM ('Naskah', 'Addendum', 'Surat Tugas', 'Laporan', 'Dokumentasi', 'Sertifikat', 'Luaran', 'Lainnya');

-- AlterEnum
ALTER TYPE "ModulDokumen" ADD VALUE 'KerjaSama';

-- AlterTable
ALTER TABLE "tbl_mitra" DROP COLUMN "berakhir",
DROP COLUMN "kategori",
DROP COLUMN "lingkup",
DROP COLUMN "mulai",
DROP COLUMN "pic",
ADD COLUMN     "catatan_internal" TEXT,
ADD COLUMN     "created_by_id" UUID,
ADD COLUMN     "kategori_id" BIGINT NOT NULL,
ADD COLUMN     "kontak_email" VARCHAR(150),
ADD COLUMN     "kontak_jabatan" VARCHAR(100),
ADD COLUMN     "kontak_nama" VARCHAR(150),
ADD COLUMN     "kontak_publik" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kontak_telepon" VARCHAR(20),
ADD COLUMN     "kota" VARCHAR(100),
ADD COLUMN     "logo" VARCHAR(255),
ADD COLUMN     "nama_singkat" VARCHAR(30),
ADD COLUMN     "negara" VARCHAR(80) NOT NULL DEFAULT 'Indonesia',
ADD COLUMN     "tampil_di_mbkm" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tampil_publik" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tingkat" "TingkatKerjaSama" NOT NULL,
ADD COLUMN     "unggulan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_by_id" UUID,
ADD COLUMN     "urutan" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "website" VARCHAR(255);

-- DropEnum
DROP TYPE "KategoriMitra";

-- CreateTable
CREATE TABLE "tbl_ref_kategori_mitra" (
    "id_kategori" BIGSERIAL NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tbl_ref_kategori_mitra_pkey" PRIMARY KEY ("id_kategori")
);

-- CreateTable
CREATE TABLE "tbl_ref_bentuk" (
    "id_bentuk" BIGSERIAL NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "bidang" "BidangKerjaSama" NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tbl_ref_bentuk_pkey" PRIMARY KEY ("id_bentuk")
);

-- CreateTable
CREATE TABLE "tbl_kerja_sama" (
    "id_kerja_sama" BIGSERIAL NOT NULL,
    "mitra_id" BIGINT NOT NULL,
    "jenis" "JenisNaskah" NOT NULL,
    "judul" VARCHAR(250) NOT NULL,
    "status" "StatusNaskah" NOT NULL DEFAULT 'Draft',
    "nomor_prodi" VARCHAR(100),
    "nomor_mitra" VARCHAR(100),
    "tempat_ttd" VARCHAR(100),
    "tanggal_ttd" DATE,
    "mulai" DATE NOT NULL,
    "berakhir" DATE,
    "ruang_lingkup" TEXT,
    "pembiayaan" VARCHAR(255),
    "ttd_prodi" VARCHAR(200),
    "ttd_mitra" VARCHAR(200),
    "pj_dosen_id" BIGINT,
    "pj_mitra" VARCHAR(150),
    "induk_id" BIGINT,
    "perpanjangan_dari_id" BIGINT,
    "catatan_internal" TEXT,
    "created_by_id" UUID,
    "updated_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_kerja_sama_pkey" PRIMARY KEY ("id_kerja_sama")
);

-- CreateTable
CREATE TABLE "tbl_kerja_sama_kegiatan" (
    "id_kegiatan" BIGSERIAL NOT NULL,
    "kerja_sama_id" BIGINT NOT NULL,
    "bidang" "BidangKerjaSama" NOT NULL,
    "bentuk_id" BIGINT,
    "judul" VARCHAR(250) NOT NULL,
    "uraian" TEXT,
    "manfaat" TEXT[],
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE,
    "jumlah_peserta" INTEGER,
    "status" "StatusKegiatan" NOT NULL DEFAULT 'Direncanakan',
    "tampil_publik" BOOLEAN NOT NULL DEFAULT false,
    "created_by_id" UUID,
    "updated_by_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_kerja_sama_kegiatan_pkey" PRIMARY KEY ("id_kegiatan")
);

-- CreateTable
CREATE TABLE "tbl_kerja_sama_berkas" (
    "id_berkas" BIGSERIAL NOT NULL,
    "kerja_sama_id" BIGINT,
    "kegiatan_id" BIGINT,
    "jenis" "JenisBerkas" NOT NULL,
    "label" VARCHAR(150) NOT NULL,
    "path" VARCHAR(255),
    "tautan" VARCHAR(255),
    "mime" VARCHAR(100),
    "ukuran" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_kerja_sama_berkas_pkey" PRIMARY KEY ("id_berkas")
);

-- CreateTable
CREATE TABLE "tbl_pengaturan_halaman" (
    "id_pengaturan" SERIAL NOT NULL,
    "kunci" VARCHAR(100) NOT NULL,
    "eyebrow" VARCHAR(50),
    "judul" VARCHAR(150) NOT NULL,
    "deskripsi" VARCHAR(400),
    "pembuka" TEXT[],
    "opsi" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_pengaturan_halaman_pkey" PRIMARY KEY ("id_pengaturan")
);

-- CreateTable
CREATE TABLE "_tbl_kerja_samaTotbl_ref_bentuk" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_tbl_kerja_samaTotbl_ref_bentuk_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_ref_kategori_mitra_nama_key" ON "tbl_ref_kategori_mitra"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_ref_bentuk_nama_key" ON "tbl_ref_bentuk"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_kerja_sama_nomor_prodi_key" ON "tbl_kerja_sama"("nomor_prodi");

-- CreateIndex
CREATE INDEX "tbl_kerja_sama_mitra_id_idx" ON "tbl_kerja_sama"("mitra_id");

-- CreateIndex
CREATE INDEX "tbl_kerja_sama_berakhir_idx" ON "tbl_kerja_sama"("berakhir");

-- CreateIndex
CREATE INDEX "tbl_kerja_sama_induk_id_idx" ON "tbl_kerja_sama"("induk_id");

-- CreateIndex
CREATE INDEX "tbl_kerja_sama_kegiatan_kerja_sama_id_idx" ON "tbl_kerja_sama_kegiatan"("kerja_sama_id");

-- CreateIndex
CREATE INDEX "tbl_kerja_sama_kegiatan_tanggal_mulai_idx" ON "tbl_kerja_sama_kegiatan"("tanggal_mulai");

-- CreateIndex
CREATE INDEX "tbl_kerja_sama_berkas_kerja_sama_id_idx" ON "tbl_kerja_sama_berkas"("kerja_sama_id");

-- CreateIndex
CREATE INDEX "tbl_kerja_sama_berkas_kegiatan_id_idx" ON "tbl_kerja_sama_berkas"("kegiatan_id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_pengaturan_halaman_kunci_key" ON "tbl_pengaturan_halaman"("kunci");

-- CreateIndex
CREATE INDEX "_tbl_kerja_samaTotbl_ref_bentuk_B_index" ON "_tbl_kerja_samaTotbl_ref_bentuk"("B");

-- CreateIndex
CREATE INDEX "tbl_mitra_kategori_id_idx" ON "tbl_mitra"("kategori_id");

-- AddForeignKey
ALTER TABLE "tbl_mitra" ADD CONSTRAINT "tbl_mitra_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "tbl_ref_kategori_mitra"("id_kategori") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_mitra" ADD CONSTRAINT "tbl_mitra_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_mitra" ADD CONSTRAINT "tbl_mitra_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama" ADD CONSTRAINT "tbl_kerja_sama_mitra_id_fkey" FOREIGN KEY ("mitra_id") REFERENCES "tbl_mitra"("id_mitra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama" ADD CONSTRAINT "tbl_kerja_sama_pj_dosen_id_fkey" FOREIGN KEY ("pj_dosen_id") REFERENCES "tbl_dosen"("id_dosen") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama" ADD CONSTRAINT "tbl_kerja_sama_induk_id_fkey" FOREIGN KEY ("induk_id") REFERENCES "tbl_kerja_sama"("id_kerja_sama") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama" ADD CONSTRAINT "tbl_kerja_sama_perpanjangan_dari_id_fkey" FOREIGN KEY ("perpanjangan_dari_id") REFERENCES "tbl_kerja_sama"("id_kerja_sama") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama" ADD CONSTRAINT "tbl_kerja_sama_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama" ADD CONSTRAINT "tbl_kerja_sama_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama_kegiatan" ADD CONSTRAINT "tbl_kerja_sama_kegiatan_kerja_sama_id_fkey" FOREIGN KEY ("kerja_sama_id") REFERENCES "tbl_kerja_sama"("id_kerja_sama") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama_kegiatan" ADD CONSTRAINT "tbl_kerja_sama_kegiatan_bentuk_id_fkey" FOREIGN KEY ("bentuk_id") REFERENCES "tbl_ref_bentuk"("id_bentuk") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama_kegiatan" ADD CONSTRAINT "tbl_kerja_sama_kegiatan_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama_kegiatan" ADD CONSTRAINT "tbl_kerja_sama_kegiatan_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama_berkas" ADD CONSTRAINT "tbl_kerja_sama_berkas_kerja_sama_id_fkey" FOREIGN KEY ("kerja_sama_id") REFERENCES "tbl_kerja_sama"("id_kerja_sama") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama_berkas" ADD CONSTRAINT "tbl_kerja_sama_berkas_kegiatan_id_fkey" FOREIGN KEY ("kegiatan_id") REFERENCES "tbl_kerja_sama_kegiatan"("id_kegiatan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tbl_kerja_samaTotbl_ref_bentuk" ADD CONSTRAINT "_tbl_kerja_samaTotbl_ref_bentuk_A_fkey" FOREIGN KEY ("A") REFERENCES "tbl_kerja_sama"("id_kerja_sama") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tbl_kerja_samaTotbl_ref_bentuk" ADD CONSTRAINT "_tbl_kerja_samaTotbl_ref_bentuk_B_fkey" FOREIGN KEY ("B") REFERENCES "tbl_ref_bentuk"("id_bentuk") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tbl_kerja_sama_berkas"
  ADD CONSTRAINT berkas_satu_induk
  CHECK (("kerja_sama_id" IS NOT NULL) <> ("kegiatan_id" IS NOT NULL));