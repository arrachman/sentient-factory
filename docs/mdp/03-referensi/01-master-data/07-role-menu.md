---
slug: /referensi/master-data/role-menu
sidebar_position: 7
title: Akses Menu per Role
---

# Akses Menu per Role

**Rute:** `/app/master/role-menus` · **Domain:** `mdp`

Peta **role → menu** (`canView`/`canEdit`). Role dikelola di ERP; di sini admin
memetakan menu mana yang terlihat untuk tiap role. Sidebar memakai peta ini untuk
**memfilter navigasi per pengguna**.

![Akses Menu per Role](/img/mdp/master-role-menus.png)

## Untuk apa & kapan dipakai

- **Membatasi navigasi per peran:** operator produksi cukup melihat MES/PRTS;
  admin melihat semua. Peta ini yang menentukan.
- **Pemetaan tipis (thin mapping):** `roleId` scalar → `adm_roles` ERP,
  `menuId` → [Menu / Navigasi](/mdp/referensi/master-data/menu). Identity tetap
  di `adm_users` ERP (reuse auth, tanpa tabel user baru).

:::warning Fallback pohon penuh
Bila sebuah role **belum dipetakan**, sistem menampilkan **pohon menu penuh**
sebagai fallback — jadi semua menu terlihat sampai Anda membuat pemetaan. Petakan
role untuk benar-benar membatasi akses.
:::

## Kolom / field utama

| Field | Wajib | Keterangan |
| --- | --- | --- |
| **Role** | ✔ | ID role ERP (`adm_roles`). |
| **Menu** | ✔ | Menu yang dipetakan ([Menu / Navigasi](/mdp/referensi/master-data/menu)). |
| **canView** | — | Boleh melihat menu. |
| **canEdit** | — | Boleh mengubah data di menu. |

## Alur singkat

Tambah pemetaan → pilih **role** + **menu** → set `canView`/`canEdit` →
**Simpan**. Sidebar pengguna dengan role itu langsung terfilter.
