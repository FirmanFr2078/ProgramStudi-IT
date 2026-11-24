-- Baris (level) bawahan di bawah atasannya. Data lama otomatis jadi baris 1,
-- lalu dirapikan oleh normalizeStruktur() saat halaman dibuka.
ALTER TABLE "tbl_struktur_posisi" ADD COLUMN "level" INTEGER NOT NULL DEFAULT 1;