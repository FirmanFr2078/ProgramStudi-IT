BEGIN;

-- Data struktur yang ada masih versi eksperimen (pos_x/pos_y manual, jalur lama).
-- Aman dikosongkan sekarang -- proyek masih tahap development, belum ada data produksi.
TRUNCATE TABLE "tbl_struktur_tupoksi", "tbl_struktur_posisi" RESTART IDENTITY CASCADE;

CREATE TYPE "JalurSambung_new" AS ENUM ('lurus', 'kiri', 'kanan');

ALTER TABLE "tbl_struktur_posisi"
  ALTER COLUMN "jalur_sambung" DROP DEFAULT,
  ALTER COLUMN "jalur_sambung" TYPE "JalurSambung_new" USING ('lurus'::text::"JalurSambung_new"),
  ALTER COLUMN "jalur_sambung" SET DEFAULT 'lurus';

DROP TYPE "JalurSambung";
ALTER TYPE "JalurSambung_new" RENAME TO "JalurSambung";

ALTER TABLE "tbl_struktur_posisi"
  DROP COLUMN "pos_x",
  DROP COLUMN "pos_y";

COMMIT;