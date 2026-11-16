/*
  Sambutan selalu berasal dari dosen yang jabatan_struktural-nya
  "Ketua Program Studi".

  Sebelum migration ini dijalankan, database akan menolak bila
  ditemukan lebih dari satu Ketua Program Studi.
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "tbl_dosen"
    WHERE TRIM("jabatan_struktural") = 'Ketua Program Studi'
    GROUP BY "jabatan_struktural"
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Data tidak valid: ditemukan lebih dari satu dosen dengan jabatan Ketua Program Studi. Rapikan data dosen terlebih dahulu.';
  END IF;
END $$;

/*
  Bersihkan spasi yang mungkin dibuat dari form lama.
  Tidak mengubah jabatan selain Ketua Program Studi.
*/
UPDATE "tbl_dosen"
SET "jabatan_struktural" = 'Ketua Program Studi'
WHERE TRIM("jabatan_struktural") = 'Ketua Program Studi';

/*
  PostgreSQL menjamin hanya boleh ada satu Kaprodi aktif.
  Jabatan struktural lain tetap boleh dipakai lebih dari satu dosen
  bila suatu saat memang diperlukan.
*/
CREATE UNIQUE INDEX "tbl_dosen_single_ketua_program_studi_key"
ON "tbl_dosen" ("jabatan_struktural")
WHERE "jabatan_struktural" = 'Ketua Program Studi';

/*
  Profil tidak memilih dosen lagi. Sambutan selalu dicari langsung
  dari tbl_dosen berdasarkan jabatan struktural.
*/
ALTER TABLE "tbl_profil_prodi"
DROP CONSTRAINT IF EXISTS "tbl_profil_prodi_sambutan_dosen_id_fkey";

ALTER TABLE "tbl_profil_prodi"
DROP COLUMN IF EXISTS "sambutan_dosen_id";