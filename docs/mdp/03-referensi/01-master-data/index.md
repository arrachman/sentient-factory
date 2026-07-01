---
slug: /referensi/master-data
sidebar_position: 0
title: Master Data
---

# Master Data

**Master Data** adalah fondasi `mdp`/`eam` yang **harus disiapkan admin sebelum
modul operasional dipakai**. Tanpa work center, shift, dan kalender kerja, MES
tidak bisa dijalankan dan OEE tidak bisa dihitung. Semua halaman master memakai
[model interaksi CRUD standar](/mdp/referensi/arsitektur#3-model-interaksi-crud-penting)
(tambah/edit/hapus seragam).

Grup **Master Data** di sidebar berisi tujuh master — masing-masing kini punya
halaman sendiri dengan use case dan daftar field:

| Master | Domain | Fungsi | Halaman |
| --- | --- | --- | --- |
| Work Center | `eam` | Resource produksi (line/cell/station) untuk routing MES | [Work Center](/mdp/referensi/master-data/work-center) |
| Aset / Equipment | `eam` | Master equipment yang dirawat | [Aset / Equipment](/mdp/referensi/master-data/aset) |
| Shift | `mdp` | Definisi shift kerja — basis MES & OEE availability | [Shift](/mdp/referensi/master-data/shift) |
| Reason Code | `mdp` | Katalog alasan downtime/scrap/delay | [Reason Code](/mdp/referensi/master-data/reason-code) |
| Work Calendar | `mdp` | *Planned operating time* — basis OEE Availability | [Work Calendar](/mdp/referensi/master-data/work-calendar) |
| Menu / Navigasi | `mdp` | SSOT navigasi shell | [Menu / Navigasi](/mdp/referensi/master-data/menu) |
| Akses Menu per Role | `mdp` | Peta akses role → menu | [Akses Menu per Role](/mdp/referensi/master-data/role-menu) |

:::tip Urutan setup yang disarankan
1. **Work Center** + **Aset** (resource fisik).
2. **Shift** + **Work Calendar** (waktu kerja → basis OEE).
3. **Reason Code** (katalog alasan).
4. **Menu** + **Akses Menu per Role** (navigasi & hak akses).
:::
