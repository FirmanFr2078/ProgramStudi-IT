
```
web-prodi
├─ AGENTS.md
├─ components.json
├─ docs
│  └─ kabar-block-editor.md
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
│  │  │  ├─ tbl_struktur_posisi.ts
│  │  │  ├─ tbl_struktur_tupoksi.ts
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
│  │  ├─ 20261114064409_kabar_content_editor
│  │  │  └─ migration.sql
│  │  ├─ 20261114140425_add_dosen_attribution
│  │  │  └─ migration.sql
│  │  ├─ 20261115045345_link_sambutan_ke_dosen
│  │  │  └─ migration.sql
│  │  ├─ 20261116000000_derive_sambutan_from_kaprodi
│  │  │  └─ migration.sql
│  │  ├─ 20261116024614_add_struktur_organisasi
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
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ layout.tsx
│  │  │  └─ login
│  │  │     └─ page.tsx
│  │  ├─ (landing)
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ login
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ logout
│  │  │  │     └─ route.ts
│  │  │  └─ dashboard
│  │  │     ├─ kabar
│  │  │     │  ├─ route.ts
│  │  │     │  ├─ upload
│  │  │     │  │  └─ route.ts
│  │  │     │  └─ [id]
│  │  │     │     └─ route.ts
│  │  │     ├─ profil
│  │  │     │  └─ route.ts
│  │  │     ├─ sdm
│  │  │     │  └─ dosen
│  │  │     │     ├─ route.ts
│  │  │     │     ├─ upload
│  │  │     │     │  └─ route.ts
│  │  │     │     └─ [id]
│  │  │     │        └─ route.ts
│  │  │     └─ struktur
│  │  │        ├─ posisi
│  │  │        │  ├─ route.ts
│  │  │        │  └─ [id]
│  │  │        │     ├─ posisi
│  │  │        │     │  └─ route.ts
│  │  │        │     └─ route.ts
│  │  │        └─ tupoksi
│  │  │           ├─ route.ts
│  │  │           └─ [id]
│  │  │              └─ route.ts
│  │  ├─ dashboard
│  │  │  ├─ kabar
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ tambah
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ [id]
│  │  │  │     └─ edit
│  │  │  │        └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ profil
│  │  │  │  └─ page.tsx
│  │  │  ├─ sdm
│  │  │  │  └─ dosen
│  │  │  │     ├─ page.tsx
│  │  │  │     ├─ tambah
│  │  │  │     │  └─ page.tsx
│  │  │  │     └─ [id]
│  │  │  │        └─ edit
│  │  │  │           └─ page.tsx
│  │  │  └─ struktur
│  │  │     └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  └─ layout.tsx
│  ├─ components
│  │  ├─ auth
│  │  │  └─ login-form.tsx
│  │  ├─ dashboard
│  │  │  ├─ app-sidebar.tsx
│  │  │  ├─ kabar
│  │  │  │  ├─ kabar-form.tsx
│  │  │  │  └─ kabar-list-view.tsx
│  │  │  ├─ nav-main.tsx
│  │  │  ├─ nav-user.tsx
│  │  │  ├─ profil
│  │  │  │  ├─ ketua-prodi-preview.tsx
│  │  │  │  └─ profil-form.tsx
│  │  │  ├─ sdm
│  │  │  │  ├─ dosen-form.tsx
│  │  │  │  └─ dosen-list-view.tsx
│  │  │  ├─ shared
│  │  │  │  ├─ confirm-dialog.tsx
│  │  │  │  ├─ form-field.tsx
│  │  │  │  ├─ resource-card
│  │  │  │  │  ├─ card-footer-row.tsx
│  │  │  │  │  ├─ resource-card-media.tsx
│  │  │  │  │  └─ resource-card.tsx
│  │  │  │  ├─ resource-list.tsx
│  │  │  │  ├─ stat-card.tsx
│  │  │  │  └─ tag-input.tsx
│  │  │  └─ struktur
│  │  │     ├─ posisi-dialog.tsx
│  │  │     ├─ posisi-node.tsx
│  │  │     ├─ struktur-board.tsx
│  │  │     ├─ tupoksi-card.tsx
│  │  │     └─ tupoksi-section.tsx
│  │  ├─ landing
│  │  │  ├─ dokumen-list.tsx
│  │  │  ├─ footer.tsx
│  │  │  ├─ header.tsx
│  │  │  ├─ home
│  │  │  │  ├─ cta.tsx
│  │  │  │  ├─ faq.tsx
│  │  │  │  ├─ focus-areas.tsx
│  │  │  │  ├─ hero.tsx
│  │  │  │  ├─ latest-news.tsx
│  │  │  │  └─ stats.tsx
│  │  │  ├─ mobile-nav.tsx
│  │  │  ├─ page-header.tsx
│  │  │  └─ reveal.tsx
│  │  ├─ nav-projects.tsx
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
│  │     ├─ dialog.tsx
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
│  │  ├─ stats.ts
│  │  └─ structural-roles.ts
│  ├─ data
│  │  ├─ kabar.ts
│  │  └─ stats.ts
│  ├─ database
│  │  ├─ dosen.ts
│  │  ├─ kabar.ts
│  │  ├─ profil.ts
│  │  └─ struktur.ts
│  ├─ hooks
│  │  ├─ auth
│  │  │  ├─ use-login.ts
│  │  │  └─ use-logout.ts
│  │  ├─ dashboard
│  │  │  ├─ kabar
│  │  │  │  ├─ use-kabar-form.ts
│  │  │  │  └─ use-kabar-list.ts
│  │  │  ├─ profil
│  │  │  │  └─ use-profil-form.ts
│  │  │  ├─ sdm
│  │  │  │  ├─ use-dosen-form.ts
│  │  │  │  └─ use-dosen-list.ts
│  │  │  └─ struktur
│  │  │     └─ use-struktur-board.ts
│  │  ├─ use-mobile.ts
│  │  ├─ use-pagination.ts
│  │  └─ use-table-filter.ts
│  ├─ lib
│  │  ├─ activity-log.ts
│  │  ├─ api-response.ts
│  │  ├─ auth.ts
│  │  ├─ authorship.ts
│  │  ├─ ids.ts
│  │  ├─ image-upload-handlers.ts
│  │  ├─ initials.ts
│  │  ├─ permissions.ts
│  │  ├─ prisma.ts
│  │  ├─ session.ts
│  │  ├─ slug.ts
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
│     ├─ pendaftaran.ts
│     ├─ prestasi.ts
│     ├─ profil.ts
│     ├─ riset.ts
│     ├─ site.ts
│     ├─ stats.ts
│     ├─ struktur.ts
│     └─ tendik.ts
└─ tsconfig.json

```