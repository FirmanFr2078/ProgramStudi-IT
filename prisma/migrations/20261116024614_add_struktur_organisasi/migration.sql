/*
  Warnings:

  - You are about to drop the column `struktur_organisasi` on the `tbl_profil_prodi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tbl_profil_prodi" DROP COLUMN "struktur_organisasi";

-- CreateTable
CREATE TABLE "tbl_struktur_posisi" (
    "id_posisi" BIGSERIAL NOT NULL,
    "parent_id" BIGINT,
    "jabatan" VARCHAR(100) NOT NULL,
    "nama" VARCHAR(150),
    "dosen_id" BIGINT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "pos_x" INTEGER NOT NULL DEFAULT 0,
    "pos_y" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tbl_struktur_posisi_pkey" PRIMARY KEY ("id_posisi")
);

-- CreateTable
CREATE TABLE "tbl_struktur_tupoksi" (
    "id_tupoksi" BIGSERIAL NOT NULL,
    "posisi_id" BIGINT NOT NULL,
    "isi" VARCHAR(300) NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tbl_struktur_tupoksi_pkey" PRIMARY KEY ("id_tupoksi")
);

-- CreateIndex
CREATE INDEX "tbl_struktur_posisi_parent_id_idx" ON "tbl_struktur_posisi"("parent_id");

-- CreateIndex
CREATE INDEX "tbl_struktur_posisi_dosen_id_idx" ON "tbl_struktur_posisi"("dosen_id");

-- CreateIndex
CREATE INDEX "tbl_struktur_tupoksi_posisi_id_idx" ON "tbl_struktur_tupoksi"("posisi_id");

-- AddForeignKey
ALTER TABLE "tbl_struktur_posisi" ADD CONSTRAINT "tbl_struktur_posisi_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "tbl_struktur_posisi"("id_posisi") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_struktur_posisi" ADD CONSTRAINT "tbl_struktur_posisi_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "tbl_dosen"("id_dosen") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_struktur_tupoksi" ADD CONSTRAINT "tbl_struktur_tupoksi_posisi_id_fkey" FOREIGN KEY ("posisi_id") REFERENCES "tbl_struktur_posisi"("id_posisi") ON DELETE CASCADE ON UPDATE CASCADE;
