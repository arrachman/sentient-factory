---
slug: /referensi/mes
sidebar_position: 3
title: MES — Eksekusi Produksi
---

# MES — Eksekusi Produksi

**MES** (*Manufacturing Execution System*, domain `mes`) adalah **modul anchor**
MDP. Ia menjalankan dan mencatat produksi terhadap **work order** yang
diturunkan dari ERP, lalu mengemit hasilnya balik. Semua entri bersifat
**manual-entry-first**.

Sub-navigasi MES (grup *Manufacturing Execution*):

| Sub-halaman | Route | Fungsi |
| --- | --- | --- |
| Production Orders | `/app/mes` | Perintah kerja produksi (induk) |
| Operations | `/app/mes/operations` | Operasi/langkah dalam satu order |
| Production Logs | `/app/mes/logs` | Pelaporan kuantitas hasil produksi |
| Material Consumptions | `/app/mes/consumptions` | Pemakaian material |
| Downtime Events | `/app/mes/downtime` | Catatan berhenti mesin |
| Labor Logs | `/app/mes/labor` | Catatan jam kerja operator |

## Production Orders

Daftar **perintah kerja produksi** (induk eksekusi). Tiap order mereferensikan
`item` ERP dan sebuah **work center**, punya **qty rencana**, akumulasi **qty
good**, dan **status** siklus hidup.

![Daftar Production Orders dengan data](/img/mdp/mes-orders.png)

- **Kolom**: Kode, Item, Work Center, Qty Rencana, Good, Status.
- **Status**: `RELEASED` → `IN_PROGRESS` → `PAUSED`/`COMPLETED` → `CLOSED`.
- **Flow**: ERP menurunkan kebutuhan produksi → admin/operator membuat
  Production Order → order di-*release* → operator menjalankan operasi dan
  melaporkan hasil (Production Logs). Akumulasi **good qty** dihitung ulang
  (*rollup*) otomatis dari log.

## Operations

Operasi/langkah individual dalam sebuah order (routing). Tiap operasi mencatat
**good qty** dan **scrap qty** secara manual.

![Daftar Operations](/img/mdp/mes-operations.png)

## Production Logs

Inti pelaporan operator: mencatat **kuantitas baik** dan **reject** yang
dihasilkan pada periode tertentu. Setiap log memicu **recompute rollup** order
induk di dalam satu transaksi — sehingga qty good pada Production Order selalu
konsisten. Data inilah yang mengisi komponen **Quality** dan **Performance** OEE.

![Daftar Production Logs](/img/mdp/mes-logs.png)

## Material Consumptions

Pemakaian material terhadap order. `itemId` dan `sourceBinId` adalah referensi
silang ke ERP (scalar, tidak di-assert). Field `postingStatus` bernilai
`PENDING` sampai konsumsi diemit ke ERP `inv_` (lihat *outbox*, masih di-stub).

![Daftar Material Consumptions](/img/mdp/mes-consumptions.png)

## Downtime Events

Catatan **berhenti mesin** — kapan mulai, kapan selesai, dan **reason code**-nya.
`durationSeconds` dihitung otomatis saat event ditutup. Downtime adalah masukan
utama komponen **Availability** OEE dan dasar analisis Pareto.

![Daftar Downtime Events](/img/mdp/mes-downtime.png)

## Labor Logs

Catatan **jam kerja operator** terhadap order/operasi. Seperti downtime,
`durationSeconds` diturunkan saat log ditutup.

![Daftar Labor Logs](/img/mdp/mes-labor.png)

## Flow operasional MES (ringkas)

```
ERP (mfg_work_order)
      │  turunkan rencana
      ▼
Production Order  ──release──►  Operations (routing)
      │                              │
      │  operator melapor            │ good / scrap
      ▼                              ▼
Production Logs ──rollup──► Good qty pada Order
Material Consumptions ─(PENDING)─► emit ke ERP inv_  (outbox, stub)
Downtime Events ───────┐
Labor Logs ────────────┴──► masukan OEE (Availability/Performance)
```

## Integrasi ke ERP

- **Sumber**: MES mengeksekusi `mfg_work_orders` milik ERP (referensi scalar
  `erpWorkOrderId`).
- **Emit**: log produksi & konsumsi material dikemit balik ke ERP lewat
  **outbox** (kontrak final masih ditunda — saat ini `postingStatus = PENDING`).
- **Tanpa DB-FK lintas app**: semua referensi ke ERP (item, bin, work order)
  berupa `BigInt` scalar — MDP terdecouple dari skema ERP.
