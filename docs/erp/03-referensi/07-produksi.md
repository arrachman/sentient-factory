---
slug: /referensi/produksi
sidebar_position: 8
title: Production
---

# Production

Modul **Production** (`M6`) menangani perencanaan & eksekusi manufaktur dasar:
**Bill of Materials** (resep/struktur produk) dan **Work Order** (perintah
kerja). Modul ini menjadi jembatan ke platform manufaktur Senti MDP untuk
eksekusi lantai produksi yang lebih rinci.

## Bill of Materials (BOM)

**BOM** mendefinisikan **struktur produk**: komponen/material dan kuantitas yang
dibutuhkan untuk membuat satu unit produk jadi. BOM menjadi acuan kebutuhan
material saat Work Order dijalankan.

![Bill of Materials](/img/erp/prd-bom.png)

## Work Order (WO)

**Work Order** adalah **perintah kerja produksi**: memproduksi sejumlah item
mengacu pada BOM-nya. WO mengkonsumsi material (mengurangi stok bahan) dan
menghasilkan output (menambah stok barang jadi) saat dilaporkan.

![Work Order](/img/erp/prd-wo.png)

## Alur ringkas

```
BOM (resep produk)  →  Work Order (perintah produksi)  →  konsumsi material + output barang jadi
```

:::info Integrasi ke Senti MDP
Untuk eksekusi produksi tingkat lantai (MES, operasi, downtime, OEE, kualitas,
pemeliharaan), Senti ERP berpasangan dengan **Senti MDP** (ISA-95 Level 3 / MOM).
ERP menurunkan kebutuhan/Work Order, MDP menjalankan & mencatat hasilnya, lalu
mengemit balik ke ERP. Lihat dokumentasi **Senti MDP**.
:::
