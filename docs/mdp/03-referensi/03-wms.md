---
slug: /referensi/wms
sidebar_position: 4
title: WMS — Eksekusi Gudang
---

# WMS — Eksekusi Gudang

**WMS** (*Warehouse Management System*, domain `wms`) menangani **eksekusi fisik
gudang lantai produksi**: putaway, picking, dan perpindahan stok. Prinsip
penting: **WMS tidak memiliki saldo stok**. Ia hanya mengemit *pergerakan*;
yang **memposting stok adalah ERP `inv_`**.

Sub-navigasi WMS (grup *Eksekusi Gudang*):

| Sub-halaman | Route | Fungsi |
| --- | --- | --- |
| Tasks | `/app/wms` | Tugas gudang (putaway/pick/move) |
| Picks | `/app/wms/picks` | Baris pengambilan barang |
| Movements | `/app/wms/movements` | Perpindahan stok fisik |
| Handling Units | `/app/wms/handling-units` | Unit penanganan (pallet/box) |

## Tasks

Daftar **tugas gudang** yang harus dikerjakan operator (putaway, picking, atau
perpindahan). Tiap task punya status pengerjaan.

![Daftar WMS Tasks](/img/mdp/wms-tasks.png)

## Picks

Baris **pengambilan barang** (pick) — biasanya turunan dari kebutuhan material
MES atau permintaan ERP. Operator mengonfirmasi qty yang diambil.

![Daftar Picks](/img/mdp/wms-picks.png)

## Movements

**Perpindahan stok fisik** antar lokasi/bin. Inilah objek yang **diemit ke ERP
`inv_`** untuk diposting menjadi mutasi stok. Sampai diemit, `postingStatus`
bernilai `PENDING`.

![Daftar Movements](/img/mdp/wms-movements.png)

## Handling Units

**Unit penanganan** (pallet, box, container) yang mengelompokkan barang untuk
dipindahkan/disimpan sebagai satu kesatuan.

![Daftar Handling Units](/img/mdp/wms-handling-units.png)

## Flow operasional WMS

```
Kebutuhan (MES / ERP)
      ▼
Task (putaway / pick / move) ──► Picks (konfirmasi qty)
      ▼
Movement (perpindahan fisik) ──(PENDING)──► emit ke ERP inv_  → posting stok
      ▲
Handling Unit (pengelompokan barang)
```

## Integrasi ke ERP

- **WMS mengeluarkan pergerakan; ERP `inv_` yang memposting stok.** WMS tidak
  pernah menyimpan saldo.
- Movement menunggu **outbox** (decision masih di-stub) — bertanda
  `postingStatus = PENDING` sampai kontrak emit final.
