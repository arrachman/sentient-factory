---
sidebar_position: 1
title: Parameter OEE
---

# Parameter OEE

OEE (*Overall Equipment Effectiveness*) adalah overlay turunan — tidak punya
tabel sendiri, dihitung dari data MES. Admin menyiapkan parameter dasarnya.

## Komponen OEE

`OEE = Availability × Performance × Quality`

| Komponen | Sumber data |
| --- | --- |
| Availability | Waktu jalan vs waktu rencana (downtime CMMS) |
| Performance | Output aktual vs kecepatan ideal mesin |
| Quality | Kuantitas baik vs total produksi (MES) |

## Langkah konfigurasi

1. Buka **Pengaturan → Aset/Mesin**, isi **kecepatan ideal** per mesin.
2. Tentukan **kalender kerja** (waktu rencana produksi).
3. Pastikan operator mencatat downtime via CMMS agar Availability akurat.
4. Buka **OEE** untuk melihat overlay terhitung (`GET /api/mdp/oee`).

<!-- TODO: tambahkan screenshot dashboard OEE -->
