---
slug: /referensi/master-data/aset
sidebar_position: 2
title: Aset / Equipment
---

# Aset / Equipment

**Rute:** `/app/master/assets` · **Domain:** `eam`

Registry **equipment yang dipelihara** (backbone EAM). Tiap aset bisa di-*link*
opsional (scalar, tanpa DB-FK) ke ERP `fa_assets`. Dipakai oleh CMMS (work order
pemeliharaan) dan MES (downtime mesin).

![Daftar Aset / Equipment](/img/mdp/master-assets.png)

## Untuk apa & kapan dipakai

- **Objek pemeliharaan:** setiap [Work Order CMMS](/mdp/referensi/cmms/work-orders)
  dan [PM Schedule](/mdp/referensi/cmms/pm-schedules) menargetkan sebuah aset.
- **Sumber downtime MES:** [Downtime Events](/mdp/referensi/mes/downtime-events)
  mesin dikaitkan ke aset untuk analisis keandalan (MTBF).
- **Jembatan ke ERP:** aset finansial di ERP (`fa_assets`) di-link opsional agar
  registry teknis (L3) dan aset finansial (L4) tetap sinkron tanpa kopling keras.

**Contoh skenario:** mesin CNC baru datang → daftarkan sebagai `EQ-CNC-07`,
link ke `fa_assets` ERP → mesin siap dijadwalkan PM dan dicatat downtime-nya.

## Kolom / field utama

| Field | Wajib | Keterangan |
| --- | --- | --- |
| **Kode** | ✔ | Business key unik (mis. `EQ-CNC-07`). |
| **Nama** | ✔ | Nama equipment. |
| **Link fa_assets (ERP)** | — | ID scalar ke aset finansial ERP (opsional). |
| **Status** | — | `Aktif`/nonaktif. |

## Alur singkat

Tambah aset → isi kode/nama → (opsional) isi ID `fa_assets` ERP → **Simpan**.
Aset lalu bisa dipilih di Work Order CMMS dan Downtime Events MES.
