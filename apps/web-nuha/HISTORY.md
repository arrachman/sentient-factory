# Riwayat Perubahan — web-nuha

Catatan perubahan yang di-commit, terbaru di atas. Setiap entri: tanggal,
hash commit, ringkasan, dan dampak operasional bila ada. Diperbarui setiap
kali ada perubahan yang di-commit (lihat CLAUDE.md §Dokumentasi & riwayat).

## 2026-08-23 — `72dec77c` — Smooth scroll + fix scroll-spy /docs

- Lompatan dari sidebar kini meluncur halus (`scroll-behavior: smooth`,
  dimatikan bila pengguna menyetel prefers-reduced-motion).
- Bug "klik item, yang menyala malah di atasnya" diperbaiki. Akar masalahnya
  `loading="lazy"` pada screenshot: gambar termuat di tengah luncuran
  menggeser tata letak sehingga anchor mendarat di bagian sebelumnya. Lazy
  dilepas, scroll-spy dihitung dari posisi scroll (bagian terakhir yang
  melewati garis baca), dan klik mengoreksi posisi hingga tepat sasaran.
- Diverifikasi Chromium: 14/14 klik menandai item yang benar; scroll manual
  bergerak maju berurutan.

## 2026-08-23 — `4c569a35` — Sidebar navigasi di /docs

- Daftar isi berpindah dari kartu di atas konten menjadi sidebar kiri yang
  sticky, dengan scroll-spy (item bagian yang sedang dibaca ditandai) dan
  tombol kembali ke aplikasi. Layar ≤860px: berubah jadi pill daftar isi di
  atas konten; saat print disembunyikan.
- Komponen baru `app/docs/NavSamping.tsx` (client, IntersectionObserver);
  lebar halaman docs 880 → 1180px dua kolom.

## 2026-08-23 — `bda183df` — Manajemen ujian + kartu guru lintas unit

- Model baru `Ujian`, `JadwalUjian`, `NilaiUjian`; kolom `unit_id` pada
  `jadwal_pelajaran` (backfill dari nama kelas). Migrasi
  `20260823190000_ujian_dan_unit_jadwal`.
- Modul `/ujian` (menu `ujian`, peran: ketua, kepsmp, kepma, guru): tab
  Gelombang (status Draf→Berjalan→Selesai oleh kepala unit; gelombang Selesai
  mengunci nilai), Kartu Ujian, dan Input Nilai per sesi oleh guru pengampu.
  Santri absen disimpan barisnya dengan nilai 0. Semua aksi diaudit.
- Kartu "Kelas Saya" ditulis ulang: dikelompokkan per unit (SMP + MA + pondok),
  badge Wali Kelas / Ustadz Diniyah, KKM, kelengkapan nilai + rerata, rincian
  presensi hari ini, sesi ujian terdekat.
- Seed: jadwal lintas unit per guru + kelas Diniyah Wustha; ujian hanya untuk
  mapel yang benar-benar diajarkan (sesi basi dari mapel data-uji dibersihkan).
- Dampak: jumlah menu berubah (superadmin 18, ketua 16, kepala unit 11,
  guru 10); `nuha-migrate` perlu build ulang sebelum run.

## 2026-08-23 — `54dccc56` — Peran guru, pairing WhatsApp QR, halaman /docs

- Tab Perangkat di /notifikasi: daftarkan nomor, tampilkan QR (scan dari WA
  mobile), status terhubung/putus; kredensial Baileys di volume
  `nuha_simterpadu_wa_data`.
- Compose mewajibkan `WA_GATEWAY_ACCOUNT_TOKEN` (sandi buatan sendiri untuk
  endpoint kelola perangkat gateway) — tanpa itu compose menolak start.
- Halaman `/docs` bergerbang sesi: alur per modul + screenshot dari
  `docs-assets/` lewat route ber-auth (bukan `public/`).
- Peran ketua yang salah dicabut dari akun musyrif.b@ dan tu.smp@.

## 2026-08-22 — `2c7de099` — Super admin + pemilih peran

- Akun `superadmin` dengan seluruh menu; dropdown "Lihat sebagai" untuk
  menyamar sebagai peran lain (server menolak bila peran asli bukan super
  admin; tercatat sebagai GANTI_PERAN).

## 2026-08-22 — `95afd81a` — Port seluruh modul, portal, dan halaman publik

- 14 modul staf bertab, portal santri & wali (baca-saja ditegakkan server),
  halaman publik + wizard PPDB 5 langkah + cek status.

## 2026-08-21 — `f693d3f6` — Design system, shell, dashboard

- Token warna, primitif UI, Shell (sidebar gradient + ticker agenda), dan
  dashboard diport dari prototype `apps/marketing/sub/nuha`.

## Sebelumnya

- `8daa40b1` prototype → aplikasi nyata (Next.js + Prisma + MySQL, Docker).
- `07a208ac`, `e07367ee`, `34507351` modul akademik–laporan, portal, WA,
  payroll, audit, CRUD generik.
- `8fb6f31c` fix kuki login di atas http (kenapa verifikasi wajib lewat IP
  publik, bukan localhost).
