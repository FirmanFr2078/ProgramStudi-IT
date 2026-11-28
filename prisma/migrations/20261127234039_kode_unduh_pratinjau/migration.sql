/*
  Warnings:

  - You are about to drop the column `fitur` on the `tbl_fasilitas` table. All the data in the column will be lost.
  - You are about to drop the column `kategori` on the `tbl_fasilitas` table. All the data in the column will be lost.
  - You are about to drop the column `lokasi` on the `tbl_fasilitas` table. All the data in the column will be lost.
  - The `deskripsi` column on the `tbl_fasilitas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `kategori_id` to the `tbl_fasilitas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `tbl_fasilitas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KondisiAset" AS ENUM ('Baik', 'Rusak Ringan', 'Rusak Berat');

-- CreateEnum
CREATE TYPE "KepemilikanAset" AS ENUM ('Milik Sendiri', 'Sewa', 'Pinjam');

-- CreateEnum
CREATE TYPE "StatusFasilitas" AS ENUM ('Aktif', 'Renovasi', 'Tidak Digunakan');

-- CreateEnum
CREATE TYPE "JenisBerkasFasilitas" AS ENUM ('Foto', 'Sertifikat Kalibrasi', 'Inventaris', 'Lainnya');

-- AlterTable
ALTER TABLE "tbl_fasilitas" DROP COLUMN "fitur",
DROP COLUMN "kategori",
DROP COLUMN "lokasi",
ADD COLUMN     "aksesibel_difabel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" UUID,
ADD COLUMN     "gedung_id" BIGINT,
ADD COLUMN     "kategori_id" BIGINT NOT NULL,
ADD COLUMN     "kepemilikan" "KepemilikanAset" NOT NULL DEFAULT 'Milik Sendiri',
ADD COLUMN     "kondisi" "KondisiAset" NOT NULL DEFAULT 'Baik',
ADD COLUMN     "lantai" VARCHAR(20),
ADD COLUMN     "luas_m2" DECIMAL(8,2),
ADD COLUMN     "penggunaan_jam_per_minggu" INTEGER,
ADD COLUMN     "status" "StatusFasilitas" NOT NULL DEFAULT 'Aktif',
ADD COLUMN     "tampil_publik" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unggulan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "updated_by_id" UUID,
ADD COLUMN     "urutan" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "deskripsi",
ADD COLUMN     "deskripsi" TEXT[];

-- AlterTable
ALTER TABLE "tbl_kerja_sama" ADD COLUMN     "preview" VARCHAR(255);

-- AlterTable
ALTER TABLE "tbl_kerja_sama_berkas" ADD COLUMN     "utama" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "KategoriFasilitas";

-- CreateTable
CREATE TABLE "tbl_kerja_sama_kode_unduh" (
    "id_kode" BIGSERIAL NOT NULL,
    "kerja_sama_id" BIGINT NOT NULL,
    "kode_hash" VARCHAR(64) NOT NULL,
    "petunjuk" VARCHAR(4) NOT NULL,
    "peminta" VARCHAR(150) NOT NULL,
    "catatan" VARCHAR(300),
    "dibuat_oleh_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dipakai_pertama_pada" TIMESTAMPTZ(6),
    "terakhir_diunduh_pada" TIMESTAMPTZ(6),
    "jumlah_unduhan" INTEGER NOT NULL DEFAULT 0,
    "dicabut_pada" TIMESTAMPTZ(6),
    "dicabut_oleh_id" UUID,

    CONSTRAINT "tbl_kerja_sama_kode_unduh_pkey" PRIMARY KEY ("id_kode")
);

-- CreateTable
CREATE TABLE "tbl_kerja_sama_kode_gagal" (
    "id_gagal" BIGSERIAL NOT NULL,
    "ip_hash" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_kerja_sama_kode_gagal_pkey" PRIMARY KEY ("id_gagal")
);

-- CreateTable
CREATE TABLE "tbl_ref_kategori_fasilitas" (
    "id_kategori" BIGSERIAL NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tbl_ref_kategori_fasilitas_pkey" PRIMARY KEY ("id_kategori")
);

-- CreateTable
CREATE TABLE "tbl_fasilitas_alat" (
    "id_alat" BIGSERIAL NOT NULL,
    "fasilitas_id" BIGINT NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "jumlah_unit" INTEGER NOT NULL DEFAULT 1,
    "tahun_perolehan" INTEGER,
    "kepemilikan" "KepemilikanAset" NOT NULL DEFAULT 'Milik Sendiri',
    "kondisi" "KondisiAset" NOT NULL DEFAULT 'Baik',
    "spesifikasi" TEXT,
    "tampil_publik" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_fasilitas_alat_pkey" PRIMARY KEY ("id_alat")
);

-- CreateTable
CREATE TABLE "tbl_fasilitas_berkas" (
    "id_berkas" BIGSERIAL NOT NULL,
    "fasilitas_id" BIGINT NOT NULL,
    "jenis" "JenisBerkasFasilitas" NOT NULL,
    "label" VARCHAR(150) NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_fasilitas_berkas_pkey" PRIMARY KEY ("id_berkas")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_kerja_sama_kode_unduh_kode_hash_key" ON "tbl_kerja_sama_kode_unduh"("kode_hash");

-- CreateIndex
CREATE INDEX "tbl_kerja_sama_kode_unduh_kerja_sama_id_idx" ON "tbl_kerja_sama_kode_unduh"("kerja_sama_id");

-- CreateIndex
CREATE INDEX "tbl_kerja_sama_kode_gagal_ip_hash_created_at_idx" ON "tbl_kerja_sama_kode_gagal"("ip_hash", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_ref_kategori_fasilitas_slug_key" ON "tbl_ref_kategori_fasilitas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_ref_kategori_fasilitas_nama_key" ON "tbl_ref_kategori_fasilitas"("nama");

-- CreateIndex
CREATE INDEX "tbl_fasilitas_alat_fasilitas_id_idx" ON "tbl_fasilitas_alat"("fasilitas_id");

-- CreateIndex
CREATE INDEX "tbl_fasilitas_berkas_fasilitas_id_idx" ON "tbl_fasilitas_berkas"("fasilitas_id");

-- CreateIndex
CREATE INDEX "tbl_fasilitas_kategori_id_idx" ON "tbl_fasilitas"("kategori_id");

-- CreateIndex
CREATE INDEX "tbl_fasilitas_gedung_id_idx" ON "tbl_fasilitas"("gedung_id");

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama_kode_unduh" ADD CONSTRAINT "tbl_kerja_sama_kode_unduh_kerja_sama_id_fkey" FOREIGN KEY ("kerja_sama_id") REFERENCES "tbl_kerja_sama"("id_kerja_sama") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama_kode_unduh" ADD CONSTRAINT "tbl_kerja_sama_kode_unduh_dibuat_oleh_id_fkey" FOREIGN KEY ("dibuat_oleh_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kerja_sama_kode_unduh" ADD CONSTRAINT "tbl_kerja_sama_kode_unduh_dicabut_oleh_id_fkey" FOREIGN KEY ("dicabut_oleh_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fasilitas" ADD CONSTRAINT "tbl_fasilitas_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "tbl_ref_kategori_fasilitas"("id_kategori") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fasilitas" ADD CONSTRAINT "tbl_fasilitas_gedung_id_fkey" FOREIGN KEY ("gedung_id") REFERENCES "tbl_fasilitas"("id_fasilitas") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fasilitas" ADD CONSTRAINT "tbl_fasilitas_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fasilitas" ADD CONSTRAINT "tbl_fasilitas_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "tbl_profiles"("id_profile") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fasilitas_alat" ADD CONSTRAINT "tbl_fasilitas_alat_fasilitas_id_fkey" FOREIGN KEY ("fasilitas_id") REFERENCES "tbl_fasilitas"("id_fasilitas") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_fasilitas_berkas" ADD CONSTRAINT "tbl_fasilitas_berkas_fasilitas_id_fkey" FOREIGN KEY ("fasilitas_id") REFERENCES "tbl_fasilitas"("id_fasilitas") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tbl_kerja_sama_berkas"
  ADD CONSTRAINT berkas_utama_hanya_naskah
  CHECK ("utama" = false OR "kerja_sama_id" IS NOT NULL);