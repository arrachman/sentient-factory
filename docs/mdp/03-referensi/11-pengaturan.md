---
slug: /referensi/pengaturan
sidebar_position: 12
title: Pengaturan & Tampilan
---

# Pengaturan & Tampilan

Halaman **Appearance** (`/app/settings/appearance`, diakses dari ikon ⚙ di
topbar) mengatur preferensi tampilan shell MDP. Preferensi disimpan per
pengguna.

![Halaman Appearance / Pengaturan tampilan](/img/mdp/settings-appearance.png)

## Bagian-bagian

| Panel | Pengaturan | Pilihan |
| --- | --- | --- |
| **Theme** | Mode tema | Light / Dark |
| | Bahasa antarmuka | Indonesian / English / Japanese |
| **Accent Color** | Color Pack siap pakai | Corporate · Creative · Natural · Warm |
| | Specific Color | palet warna spesifik |
| | Active Accent | warna aksen aktif (mis. Emerald) |
| **Font Size** | Skala teks | Small · Normal · Large · Extra Large |
| **Layout** | Density tabel/list | Compact · Comfortable |
| **Sidebar Menu** | Template | Icon · Icon + Label |
| | Menu Mode | Flyout (submenu muncul saat hover) · Accordion (expand di bawah modul) |
| **URL Routing** | Mode | Internal (URL tetap) · Per-page URL (URL ikut halaman aktif) |

- **Preview** langsung tersedia pada panel Font Size dan Sidebar Menu.
- Tombol **Reset** (kanan atas) mengembalikan ke default.
- **Footer** menampilkan ringkasan setelan aktif (mis. *Theme light · Emerald ·
  Size base · Comfortable · Sidebar Menu Icon + Label · Accordion · URL
  Internal*).

:::note
Pengaturan ini bersifat **tampilan** dan tidak memengaruhi data operasional.
Untuk autentikasi/login lihat
[Arsitektur § Login](/mdp/referensi/arsitektur#5-login).
:::
