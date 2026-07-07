---
slug: /referensi/master-data/reason-code
sidebar_position: 4
title: Reason Code
---

# Reason Code

**Rute:** `/app/master/reason-codes` · **Domain:** `mdp`

Katalog **alasan ber-tipe** untuk downtime, scrap, dan delay. Saat operator
mencatat *downtime event* atau *scrap*, ia memilih reason code dari katalog ini
sehingga data dapat dianalisis (mis. **Pareto downtime**).

![Daftar Reason Code](/img/mdp/master-reason-codes.png)

## Untuk apa & kapan dipakai

- **Menstandarkan alasan:** tanpa katalog, operator menulis alasan bebas dan data
  tak bisa diagregasi. Reason code membuat "ganti tooling", "tunggu material",
  "setup" bisa dihitung dan di-Pareto-kan.
- **Dipakai di:** [Downtime Events](/mdp/referensi/mes/downtime-events) dan
  pencatatan scrap MES.

**Contoh skenario:** tim ingin tahu penyebab downtime terbesar → definisikan
reason code (`DT-SETUP`, `DT-MATERIAL`, `DT-BREAKDOWN`) → operator memilih saat
mencatat → laporan Pareto menunjuk penyebab dominan.

## Kolom / field utama

| Field | Wajib | Keterangan |
| --- | --- | --- |
| **Kode** | ✔ | Business key unik (mis. `DT-SETUP`). |
| **Nama** | ✔ | Deskripsi alasan. |
| **Tipe** | — | Kategori: `downtime` / `scrap` / `delay`. |
| **Status** | — | `Aktif`/nonaktif. |

## Alur singkat

Tambah reason code → isi kode/nama → pilih **tipe** → **Simpan**. Kode lalu
muncul sebagai pilihan saat mencatat downtime/scrap.
