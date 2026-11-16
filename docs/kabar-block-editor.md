# Kabar Block Editor

## Perubahan

- `tbl_kabar.konten` berubah dari PostgreSQL `text[]` menjadi `jsonb`.
- Setiap paragraf lama dimigrasikan menjadi blok `paragraph`; isi paragraf dan urutannya dipertahankan.
- Create dan edit menggunakan `KabarForm` yang sama.
- Slug mengikuti judul secara otomatis sampai admin mengubah slug secara manual. Tombol **Otomatis** mengembalikan slug ke hasil judul.
- Banner dan gambar inline diunggah melalui endpoint terlindungi `/api/dashboard/kabar/upload` ke bucket `images`, folder `kabar/`.
- Gambar banner menyimpan object path di kolom `gambar`; gambar inline menyimpan public URL pada blok JSON.

## Jenis blok

- `paragraph`
- `heading` (H2/H3)
- `image` (gambar + alt + caption)
- `quote`
- `list` (ordered/unordered)
- `divider`

Urutan blok disimpan sesuai urutan array JSON. Tombol panah atas/bawah mengubah urutan blok.

## Langkah penerapan

1. Backup database terlebih dahulu.
2. Pastikan `.env.local` memiliki `DIRECT_URL` yang mengarah ke database PostgreSQL yang benar.
3. Install dependency sesuai lockfile jika belum tersedia.
4. Generate Prisma Client dan jalankan migrasi:

   ```bash
   pnpm exec prisma generate
   pnpm exec prisma migrate deploy
   pnpm typecheck
   pnpm lint
   ```

   Untuk lingkungan pengembangan yang memakai migration workflow lokal, `pnpm exec prisma migrate dev` juga dapat digunakan setelah memastikan database target benar.

5. Jalankan aplikasi dan uji create, edit, upload banner, upload gambar inline, serta pengurutan blok.

## Catatan kompatibilitas

- Migrasi SQL mengonversi setiap item `text[]` lama menjadi objek blok `paragraph`, sehingga konten lama tidak dibuang.
- `src/data/kabar.ts` dan tipe `Kabar` publik yang masih memakai data dummy `string[]` sengaja tidak diubah. Integrasi renderer halaman detail publik ke `ArticleBlock` merupakan tahap terpisah.
- File gambar yang diunggah tetapi kemudian dihapus dari editor belum dihapus otomatis dari Supabase Storage. Pembersihan orphan files perlu ditambahkan setelah kebijakan retensi gambar disepakati.
- Generated Prisma Client di `prisma/generated` harus diperbarui dengan perintah `prisma generate` setelah schema berubah.
