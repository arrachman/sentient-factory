---
slug: /referensi/cmms
sidebar_position: 6
title: CMMS — Pemeliharaan
---

# CMMS — Pemeliharaan

**CMMS** (*Computerized Maintenance Management System*, domain `mnt`) mengelola
**pemeliharaan aset/mesin**: work order pemeliharaan, jadwal *preventive
maintenance* (PM), spare parts, dan katalog kode kegagalan. CMMS bertumpu pada
[Aset / Equipment](/mdp/referensi/master-data#2-aset--equipment) dari EAM.

Sub-navigasi CMMS (grup *Pemeliharaan*):

| Sub-halaman | Route | Fungsi |
| --- | --- | --- |
| Work Orders | `/app/maintenance` | Perintah kerja pemeliharaan |
| PM Schedules | `/app/maintenance/pm-schedules` | Jadwal pemeliharaan preventif |
| Spare Parts | `/app/maintenance/spare-parts` | Suku cadang |
| Failure Codes | `/app/maintenance/failure-codes` | Katalog kode kegagalan |

## Work Orders

**Perintah kerja pemeliharaan** terhadap sebuah aset/work center — korektif
(setelah kerusakan) maupun preventif (dari jadwal PM). Referensi `assetId` dan
`workCenterId` adalah scalar lintas-domain ke EAM.

![Daftar Maintenance Work Orders](/img/mdp/maintenance-work-orders.png)

## PM Schedules

**Jadwal pemeliharaan preventif** — mendefinisikan interval (waktu/usage) yang
memunculkan work order PM secara berkala untuk mencegah kerusakan.

![Daftar PM Schedules](/img/mdp/maintenance-pm-schedules.png)

## Spare Parts

Katalog **suku cadang** yang dipakai dalam pemeliharaan. `itemId` dan qty wajib;
pemakaian spare (issue) menunggu emit ke ERP `inv_` (`postingStatus = PENDING`).

![Daftar Spare Parts](/img/mdp/maintenance-spare-parts.png)

## Failure Codes

**Katalog kode kegagalan** ber-tipe untuk mengklasifikasi penyebab kerusakan —
dasar analisis keandalan (mis. MTBF, Pareto failure).

![Daftar Failure Codes](/img/mdp/maintenance-failure-codes.png)

## Flow operasional CMMS

```
PM Schedule (interval) ──┐
                         ├──► Work Order (preventif / korektif)
Kerusakan + Failure Code ┘        │
                                  ├──► Spare Parts (issue → emit ERP inv_, PENDING)
                                  ▼
                         Downtime (MES) ──► masukan Availability OEE
```

## Integrasi

- **Aset**: bertumpu pada `eam_assets`; link opsional ke ERP `fa_assets`.
- **OEE**: durasi pemeliharaan/downtime berkontribusi ke komponen
  **Availability** pada [OEE](/mdp/referensi/oee).
- **Spare issue**: diemit ke ERP `inv_` lewat outbox (stub).
