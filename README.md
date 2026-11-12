
```
web-prodi
├─ AGENTS.md
├─ components.json
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ prisma
│  ├─ generated
│  │  ├─ browser.ts
│  │  ├─ client.ts
│  │  ├─ commonInputTypes.ts
│  │  ├─ enums.ts
│  │  ├─ internal
│  │  │  ├─ class.ts
│  │  │  ├─ prismaNamespace.ts
│  │  │  └─ prismaNamespaceBrowser.ts
│  │  ├─ models
│  │  │  ├─ tbl_activity_log.ts
│  │  │  ├─ tbl_alumni.ts
│  │  │  ├─ tbl_bentuk_kegiatan.ts
│  │  │  ├─ tbl_dokumen.ts
│  │  │  ├─ tbl_dosen.ts
│  │  │  ├─ tbl_event.ts
│  │  │  ├─ tbl_fasilitas.ts
│  │  │  ├─ tbl_hki.ts
│  │  │  ├─ tbl_jadwal.ts
│  │  │  ├─ tbl_jalur_pendaftaran.ts
│  │  │  ├─ tbl_kabar.ts
│  │  │  ├─ tbl_langkah_mbkm.ts
│  │  │  ├─ tbl_mata_kuliah.ts
│  │  │  ├─ tbl_mitra.ts
│  │  │  ├─ tbl_prestasi.ts
│  │  │  ├─ tbl_profiles.ts
│  │  │  ├─ tbl_profil_prodi.ts
│  │  │  ├─ tbl_riset.ts
│  │  │  ├─ tbl_tanggal_penting.ts
│  │  │  └─ tbl_tendik.ts
│  │  └─ models.ts
│  ├─ migrations
│  │  ├─ 20261108090640_init
│  │  │  └─ migration.sql
│  │  ├─ 20261108112355_add_tbl_profiles
│  │  │  └─ migration.sql
│  │  ├─ 20261108142246_rename_email_to_username
│  │  │  └─ migration.sql
│  │  ├─ 20261112045720_add_activity_log_and_kabar_authorship
│  │  │  └─ migration.sql
│  │  ├─ 20261112054837_add_activity_log
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  ├─ schema.prisma
│  └─ seed.ts
├─ prisma.config.ts
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ scripts
│  ├─ debug-login.ts
│  └─ delete-user.ts
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  └─ login
│  │  │     └─ page.tsx
│  │  ├─ (landing)
│  │  │  ├─ fasilitas
│  │  │  │  ├─ gedung
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ laboratorium
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ perpustakaan
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ ruang-kelas
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ sarana-administrasi
│  │  │  │     └─ page.tsx
│  │  │  ├─ informasi
│  │  │  │  ├─ event
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [slug]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ kabar
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [slug]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ kontak
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ pendaftaran
│  │  │  │     └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ mahasiswa
│  │  │  │  ├─ alumni
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ organisasi
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ prestasi
│  │  │  │     └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ pendidikan
│  │  │  │  ├─ jadwal
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ kalender
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ kurikulum
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ mbkm
│  │  │  │     └─ page.tsx
│  │  │  ├─ profil
│  │  │  │  ├─ kerja-sama
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ profil-prodi
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ struktur-organisasi
│  │  │  │     └─ page.tsx
│  │  │  ├─ riset
│  │  │  │  ├─ hki
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ penelitian
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ pengabdian
│  │  │  │     └─ page.tsx
│  │  │  └─ sdm
│  │  │     ├─ dosen
│  │  │     │  ├─ page.tsx
│  │  │     │  └─ [slug]
│  │  │     │     └─ page.tsx
│  │  │     └─ tendik
│  │  │        ├─ page.tsx
│  │  │        └─ [slug]
│  │  │           └─ page.tsx
│  │  ├─ api
│  │  │  └─ auth
│  │  │     ├─ login
│  │  │     │  └─ route.ts
│  │  │     └─ logout
│  │  │        └─ route.ts
│  │  ├─ dashboard
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  └─ layout.tsx
│  ├─ components
│  │  ├─ app-sidebar.tsx
│  │  ├─ auth
│  │  │  └─ login-form.tsx
│  │  ├─ dashboard
│  │  │  ├─ confirm-dialog.tsx
│  │  │  ├─ data-table.tsx
│  │  │  ├─ page-toolbar.tsx
│  │  │  └─ stat-card.tsx
│  │  ├─ landing
│  │  │  ├─ dokumen-list.tsx
│  │  │  ├─ fasilitas
│  │  │  │  ├─ card.tsx
│  │  │  │  └─ grid.tsx
│  │  │  ├─ footer.tsx
│  │  │  ├─ header.tsx
│  │  │  ├─ home
│  │  │  │  ├─ cta.tsx
│  │  │  │  ├─ faq.tsx
│  │  │  │  ├─ focus-areas.tsx
│  │  │  │  ├─ hero.tsx
│  │  │  │  ├─ latest-news.tsx
│  │  │  │  └─ stats.tsx
│  │  │  ├─ informasi
│  │  │  │  ├─ contact-form.tsx
│  │  │  │  ├─ event
│  │  │  │  │  ├─ card.tsx
│  │  │  │  │  ├─ detail.tsx
│  │  │  │  │  ├─ list-skeleton.tsx
│  │  │  │  │  └─ list.tsx
│  │  │  │  ├─ filter.tsx
│  │  │  │  └─ kabar
│  │  │  │     ├─ card.tsx
│  │  │  │     ├─ detail.tsx
│  │  │  │     ├─ list-skeleton.tsx
│  │  │  │     └─ list.tsx
│  │  │  ├─ mahasiswa
│  │  │  │  ├─ alumni
│  │  │  │  │  ├─ summary.tsx
│  │  │  │  │  └─ table.tsx
│  │  │  │  └─ prestasi
│  │  │  │     ├─ card.tsx
│  │  │  │     ├─ filter.tsx
│  │  │  │     └─ list.tsx
│  │  │  ├─ mobile-nav.tsx
│  │  │  ├─ page-header.tsx
│  │  │  ├─ pendidikan
│  │  │  │  ├─ jadwal
│  │  │  │  │  └─ day-schedule.tsx
│  │  │  │  ├─ kalender
│  │  │  │  │  └─ tanggal-penting.tsx
│  │  │  │  ├─ kurikulum
│  │  │  │  │  └─ semester-table.tsx
│  │  │  │  └─ mbkm
│  │  │  │     ├─ bentuk-kegiatan.tsx
│  │  │  │     ├─ langkah-list.tsx
│  │  │  │     └─ mitra-preview.tsx
│  │  │  ├─ profil
│  │  │  │  ├─ kerja-sama
│  │  │  │  │  ├─ card.tsx
│  │  │  │  │  ├─ detail-sheet.tsx
│  │  │  │  │  ├─ filter.tsx
│  │  │  │  │  └─ list.tsx
│  │  │  │  ├─ organisasi
│  │  │  │  │  ├─ org-chart.tsx
│  │  │  │  │  └─ tupoksi.tsx
│  │  │  │  └─ profile-prodi
│  │  │  │     ├─ identitas.tsx
│  │  │  │     ├─ profil-lulusan.tsx
│  │  │  │     ├─ sambutan.tsx
│  │  │  │     ├─ tujuan.tsx
│  │  │  │     └─ visi-misi.tsx
│  │  │  ├─ reveal.tsx
│  │  │  ├─ riset
│  │  │  │  ├─ hki-table.tsx
│  │  │  │  └─ riset-table.tsx
│  │  │  └─ sdm
│  │  │     ├─ dosen
│  │  │     │  ├─ dosen-card.tsx
│  │  │     │  └─ dosen-detail.tsx
│  │  │     └─ tendik
│  │  │        ├─ tendik-card.tsx
│  │  │        └─ tendik-detail.tsx
│  │  ├─ nav-main.tsx
│  │  ├─ nav-projects.tsx
│  │  ├─ nav-user.tsx
│  │  ├─ team-switcher.tsx
│  │  └─ ui
│  │     ├─ alert-dialog.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ table.tsx
│  │     ├─ textarea.tsx
│  │     └─ tooltip.tsx
│  ├─ config
│  │  ├─ auth.ts
│  │  ├─ dashboard-nav.ts
│  │  ├─ faq.ts
│  │  ├─ focus-areas.ts
│  │  ├─ organisasi-mahasiswa.ts
│  │  ├─ site.ts
│  │  └─ stats.ts
│  ├─ data
│  │  ├─ alumni.ts
│  │  ├─ dosen.ts
│  │  ├─ event.ts
│  │  ├─ fasilitas.ts
│  │  ├─ hki.ts
│  │  ├─ jadwal.ts
│  │  ├─ kabar.ts
│  │  ├─ kalender.ts
│  │  ├─ kerja-sama.ts
│  │  ├─ kurikulum.ts
│  │  ├─ mbkm.ts
│  │  ├─ organisasi.ts
│  │  ├─ pendaftaran.ts
│  │  ├─ penelitian.ts
│  │  ├─ pengabdian.ts
│  │  ├─ prestasi.ts
│  │  ├─ profile.ts
│  │  ├─ stats.ts
│  │  └─ tendik.ts
│  ├─ hooks
│  │  ├─ auth
│  │  │  ├─ use-login.ts
│  │  │  └─ use-logout.ts
│  │  ├─ use-mobile.ts
│  │  ├─ use-pagination.ts
│  │  └─ use-table-filter.ts
│  ├─ lib
│  │  ├─ activity-log.ts
│  │  ├─ auth.ts
│  │  ├─ initials.ts
│  │  ├─ permissions.ts
│  │  ├─ prisma.ts
│  │  ├─ session.ts
│  │  ├─ storage.ts
│  │  └─ utils.ts
│  ├─ proxy.ts
│  └─ types
│     ├─ alumni.ts
│     ├─ auth.ts
│     ├─ dokumen.ts
│     ├─ dosen.ts
│     ├─ event.ts
│     ├─ fasilitas.ts
│     ├─ hki.ts
│     ├─ index.ts
│     ├─ jadwal.ts
│     ├─ kabar.ts
│     ├─ kalender.ts
│     ├─ kerja-sama.ts
│     ├─ kurikulum.ts
│     ├─ mbkm.ts
│     ├─ navigation.ts
│     ├─ organisasi.ts
│     ├─ pendaftaran.ts
│     ├─ prestasi.ts
│     ├─ profile.ts
│     ├─ riset.ts
│     ├─ site.ts
│     ├─ stats.ts
│     └─ tendik.ts
└─ tsconfig.json

```