
```
web-prodi
├─ AGENTS.md
├─ components.json
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
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
│  │  │  │  └─ kontak
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
│  │  ├─ dashboard
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  └─ layout.tsx
│  ├─ components
│  │  ├─ app-sidebar.tsx
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
│  │  │  │  └─ contact-form.tsx
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
│  │     ├─ avatar.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ input.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
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
│  │  ├─ berita.ts
│  │  ├─ dosen.ts
│  │  ├─ fasilitas.ts
│  │  ├─ hki.ts
│  │  ├─ jadwal.ts
│  │  ├─ kalender.ts
│  │  ├─ kerja-sama.ts
│  │  ├─ kurikulum.ts
│  │  ├─ mbkm.ts
│  │  ├─ organisasi.ts
│  │  ├─ penelitian.ts
│  │  ├─ pengabdian.ts
│  │  ├─ prestasi.ts
│  │  ├─ profile.ts
│  │  ├─ stats.ts
│  │  └─ tendik.ts
│  ├─ hooks
│  │  └─ use-mobile.ts
│  ├─ lib
│  │  ├─ initials.ts
│  │  ├─ permissions.ts
│  │  ├─ session.ts
│  │  └─ utils.ts
│  └─ types
│     ├─ alumni.ts
│     ├─ auth.ts
│     ├─ berita.ts
│     ├─ dokumen.ts
│     ├─ dosen.ts
│     ├─ fasilitas.ts
│     ├─ hki.ts
│     ├─ index.ts
│     ├─ jadwal.ts
│     ├─ kalender.ts
│     ├─ kerja-sama.ts
│     ├─ kurikulum.ts
│     ├─ mbkm.ts
│     ├─ navigation.ts
│     ├─ organisasi.ts
│     ├─ prestasi.ts
│     ├─ profile.ts
│     ├─ riset.ts
│     ├─ site.ts
│     ├─ stats.ts
│     └─ tendik.ts
└─ tsconfig.json

```