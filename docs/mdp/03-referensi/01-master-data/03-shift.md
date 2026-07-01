---
slug: /referensi/master-data/shift
sidebar_position: 3
title: Shift
---

# Shift

**Rute:** `/app/master/shifts` · **Domain:** `mdp`

Definisi **shift kerja** (mis. Pagi/Siang/Malam) dengan jam mulai–selesai.
Menjadi basis pengelompokan data MES dan komponen **Availability** OEE.

![Daftar Shift](/img/mdp/master-shifts.png)

## Untuk apa & kapan dipakai

- **Mengelompokkan data operasi per shift:** produksi, downtime, dan labor bisa
  dianalisis per shift (mis. shift malam lebih banyak downtime?).
- **Basis Availability OEE:** jam kerja shift membantu menetapkan *planned time*
  bersama [Work Calendar](/mdp/referensi/master-data/work-calendar).

**Contoh skenario:** pabrik 3 shift → buat `SHIFT-PAGI` (06:00–14:00),
`SHIFT-SIANG` (14:00–22:00), `SHIFT-MALAM` (22:00–06:00) → laporan MES dapat
dipecah per shift.

## Kolom / field utama

| Field | Wajib | Keterangan |
| --- | --- | --- |
| **Kode** | ✔ | Business key unik (mis. `SHIFT-PAGI`). |
| **Nama** | ✔ | Nama shift. |
| **Mulai (HH:mm)** | ✔ | Jam mulai shift. |
| **Selesai (HH:mm)** | ✔ | Jam selesai shift (boleh lewat tengah malam). |
| **Status** | — | `Aktif`/nonaktif. |

## Alur singkat

Tambah shift → isi kode/nama → set jam **Mulai** & **Selesai** → **Simpan**.
