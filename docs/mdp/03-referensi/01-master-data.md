---
slug: /referensi/master-data
sidebar_position: 2
title: Master Data
---

# Master Data

**Master Data** adalah fondasi `mdp`/`eam` yang **harus disiapkan admin sebelum
modul operasional dipakai**. Tanpa work center, shift, dan kalender kerja, MES
tidak bisa dijalankan dan OEE tidak bisa dihitung. Semua halaman master memakai
[model interaksi CRUD standar](/mdp/referensi/arsitektur#3-model-interaksi-crud-penting).

Grup **Master Data** di sidebar berisi tujuh master:

| Master | Domain | Fungsi |
| --- | --- | --- |
| Work Center | `eam` | Resource produksi (line/cell/station) untuk routing MES |
| Aset / Equipment | `eam` | Master equipment yang dirawat |
| Shift | `mdp` | Definisi shift kerja — basis MES & OEE availability |
| Reason Code | `mdp` | Katalog alasan downtime/scrap/delay |
| Work Calendar | `mdp` | *Planned operating time* — basis OEE Availability |
| Menu / Navigasi | `mdp` | SSOT navigasi shell |
| Akses Menu per Role | `mdp` | Peta akses role → menu |

## 1. Work Center

Resource produksi tempat operasi MES dijalankan (line, cell, atau station).
Tiap work center punya **ideal cycle time** opsional yang menjadi basis
perhitungan **Performance** di OEE.

![Daftar Work Center](/img/mdp/master-work-centers.png)

- **Kolom**: Kode, Nama, Ideal Cycle (dtk), Status.
- **Flow**: Tambah work center → isi kode/nama → (opsional) isi ideal cycle time
  → simpan. Work center kemudian dipilih saat membuat Production Order.

## 2. Aset / Equipment

Registry equipment yang dipelihara (backbone EAM). Tiap aset bisa di-*link*
opsional (scalar, tanpa DB-FK) ke ERP `fa_assets`. Dipakai oleh CMMS (work
order pemeliharaan) dan MES (downtime mesin).

![Daftar Aset / Equipment](/img/mdp/master-assets.png)

## 3. Shift

Definisi shift kerja (mis. Pagi/Siang/Malam) dengan jam mulai–selesai. Menjadi
basis pengelompokan data MES dan komponen **Availability** OEE.

![Daftar Shift](/img/mdp/master-shifts.png)

## 4. Reason Code

Katalog **alasan ber-tipe** untuk downtime, scrap, dan delay. Saat operator
mencatat *downtime event* atau *scrap*, ia memilih reason code dari katalog ini
sehingga data dapat dianalisis (mis. Pareto downtime).

![Daftar Reason Code](/img/mdp/master-reason-codes.png)

## 5. Work Calendar

*Planned operating time* — jadwal waktu operasi terencana. Inilah **penyebut
Availability** di OEE: bila kalender kerja kosong, OEE tidak bisa dihitung
(kolom OEE menampilkan `—`).

![Daftar Work Calendar](/img/mdp/master-work-calendars.png)

## 6. Menu / Navigasi

**SSOT navigasi** shell MDP (mirror pola `sys_menus`). Mendefinisikan pohon menu
yang muncul di sidebar — label, ikon, route, dan urutan.

![Daftar Menu / Navigasi](/img/mdp/master-menus.png)

## 7. Akses Menu per Role

Peta **role → menu** (`canView`/`canEdit`). Role dikelola di ERP; di sini admin
memetakan menu mana yang terlihat untuk tiap role. Sidebar memakai peta ini untuk
memfilter navigasi per pengguna. Bila sebuah role belum dipetakan, sistem
menampilkan **pohon menu penuh** sebagai fallback.

![Akses Menu per Role](/img/mdp/master-role-menus.png)

:::tip Urutan setup yang disarankan
1. **Work Center** + **Aset** (resource fisik).
2. **Shift** + **Work Calendar** (waktu kerja → basis OEE).
3. **Reason Code** (katalog alasan).
4. **Menu** + **Akses Menu per Role** (navigasi & hak akses).
:::
