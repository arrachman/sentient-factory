---
slug: /referensi/master-data/work-center
sidebar_position: 1
title: Work Center
---

# Work Center

**Rute:** `/app/master/work-centers` · **Domain:** `eam`

Resource produksi tempat operasi MES dijalankan — **line, cell, atau station**.
Tiap work center punya **ideal cycle time** opsional yang menjadi basis
perhitungan **Performance** di OEE.

![Daftar Work Center](/img/mdp/master-work-centers.png)

## Untuk apa & kapan dipakai

- **Menyiapkan resource produksi** sebelum membuat Production Order — setiap
  order MES **wajib memilih** work center tempat ia dikerjakan.
- **Basis Performance OEE:** *ideal cycle time* dipakai membandingkan output
  aktual vs output ideal. Jika kosong, Performance sebuah work center tampil `—`
  di [OEE](/mdp/referensi/oee).
- **Titik downtime & pemeliharaan:** Work Order CMMS dan Downtime Events MES
  merujuk work center ini.

**Contoh skenario:** pabrik punya 3 lini rakit → buat `WC-ASSY-01/02/03`, isi
ideal cycle time tiap lini → OEE per lini langsung bisa dihitung.

## Kolom / field utama

| Field | Wajib | Keterangan |
| --- | --- | --- |
| **Kode** | ✔ | Business key unik (mis. `WC-ASSY-01`). |
| **Nama** | ✔ | Nama tampilan (mis. *Assembly Line 1*). |
| **Ideal Cycle (dtk)** | — | Waktu siklus ideal per unit → basis Performance OEE. |
| **Status** | — | `Aktif`/nonaktif (`isActive`). |

## Alur singkat

Tambah work center → isi kode/nama → (opsional) isi ideal cycle time → **Simpan**.
Work center kemudian dipilih saat membuat [Production Order](/mdp/referensi/mes/production-orders).
