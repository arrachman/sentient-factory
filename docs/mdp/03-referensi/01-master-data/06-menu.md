---
slug: /referensi/master-data/menu
sidebar_position: 6
title: Menu / Navigasi
---

# Menu / Navigasi

**Rute:** `/app/master/menus` · **Domain:** `mdp`

**SSOT navigasi** shell MDP (mirror pola `sys_menus`). Mendefinisikan **pohon
menu** yang muncul di sidebar — label, ikon, route, dan urutan.

![Daftar Menu / Navigasi](/img/mdp/master-menus.png)

## Untuk apa & kapan dipakai

- **Mengatur isi & urutan sidebar** tanpa mengubah kode. Menambah modul/halaman
  baru = menambah baris menu, bukan deploy ulang.
- **Sumber pohon** yang difilter per role di
  [Akses Menu per Role](/mdp/referensi/master-data/role-menu) dan diserve oleh
  endpoint `GET /api/mdp/menus/nav`.

**Contoh skenario:** ada halaman baru "Andon Board" → tambahkan menu (label,
ikon, route `/app/problems/board`, parent PRTS, urutan) → item langsung muncul di
sidebar bagi role yang berhak.

## Kolom / field utama

| Field | Wajib | Keterangan |
| --- | --- | --- |
| **Label** | ✔ | Teks yang tampil di sidebar. |
| **Route** | ✔ | Path halaman (mis. `/app/mes/logs`). |
| **Ikon** | — | Nama ikon. |
| **Parent** | — | Menu induk (untuk submenu) — membentuk pohon. |
| **Urutan** | — | Posisi relatif di antara saudara. |

## Alur singkat

Tambah menu → isi label/route → (opsional) ikon, parent, urutan → **Simpan**.
Perubahan tercermin di sidebar (via `/api/mdp/menus/nav`).
