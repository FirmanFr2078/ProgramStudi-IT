/*
  Warnings:

  - Changed the type of `konten` on the `tbl_kabar` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tbl_kabar" DROP COLUMN "konten",
ADD COLUMN     "konten" JSONB NOT NULL;
