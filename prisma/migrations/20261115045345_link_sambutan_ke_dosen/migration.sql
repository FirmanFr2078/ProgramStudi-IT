/*
  Warnings:

  - You are about to drop the column `sambutan_jabatan` on the `tbl_profil_prodi` table. All the data in the column will be lost.
  - You are about to drop the column `sambutan_nama` on the `tbl_profil_prodi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tbl_profil_prodi" DROP COLUMN "sambutan_jabatan",
DROP COLUMN "sambutan_nama",
ADD COLUMN     "sambutan_dosen_id" BIGINT;

-- AddForeignKey
ALTER TABLE "tbl_profil_prodi" ADD CONSTRAINT "tbl_profil_prodi_sambutan_dosen_id_fkey" FOREIGN KEY ("sambutan_dosen_id") REFERENCES "tbl_dosen"("id_dosen") ON DELETE SET NULL ON UPDATE CASCADE;
