-- CreateEnum
CREATE TYPE "JalurSambung" AS ENUM ('langsung', 'menyamping');

-- AlterTable
ALTER TABLE "tbl_struktur_posisi" ADD COLUMN     "jalur_sambung" "JalurSambung" NOT NULL DEFAULT 'langsung';
