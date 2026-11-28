/*
  Warnings:

  - The values [Inventaris] on the enum `JenisBerkasFasilitas` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JenisBerkasFasilitas_new" AS ENUM ('Foto', 'Sertifikat Kalibrasi', 'Dokumen Inventaris', 'Lainnya');
ALTER TABLE "tbl_fasilitas_berkas" ALTER COLUMN "jenis" TYPE "JenisBerkasFasilitas_new" USING ("jenis"::text::"JenisBerkasFasilitas_new");
ALTER TYPE "JenisBerkasFasilitas" RENAME TO "JenisBerkasFasilitas_old";
ALTER TYPE "JenisBerkasFasilitas_new" RENAME TO "JenisBerkasFasilitas";
DROP TYPE "public"."JenisBerkasFasilitas_old";
COMMIT;

-- AlterTable
ALTER TABLE "tbl_fasilitas_berkas" ADD COLUMN     "mime" VARCHAR(100),
ADD COLUMN     "ukuran" INTEGER;
