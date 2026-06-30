---
slug: /referensi/persediaan
sidebar_position: 5
title: Warehouse & Inventory
---

# Warehouse & Inventory

Modul **Warehouse & Inventory** (`M3`) mengelola pergerakan dan nilai stok di
gudang. Tiap dokumen yang diposting memperbarui **kuantitas stok** dan, untuk
transaksi bernilai, **harga pokok (COGS)**. Sub-navigasi terbagi empat grup:
**Transactions**, **Data**, **Reports**, dan **Statistics**.

| Grup | Fungsi |
| --- | --- |
| **Transactions** | Membuat dokumen pergerakan stok (input) |
| **Data** | Registry/daftar dokumen yang sudah dibuat (telusur & kelola) |
| **Reports** | Kartu stok, mutasi, stok minimum, batch/serial, dll |
| **Statistics** | Produk terlaris/ter-profit, stok di bawah minimum, KPI |

## Transactions

### Material Request (MR)

**Permintaan material** dari unit kerja ke gudang — pemicu pemenuhan/transfer
stok.

![Material Request](/img/erp/wh-material-requests.png)

### Stock Transfer (TS)

**Transfer stok** antar gudang. Dokumen ini menurunkan stok gudang asal dan
(setelah Transfer Receipt) menambah stok gudang tujuan.

![Stock Transfer](/img/erp/wh-transfers.png)

### Stock Count (SP) — Opname

**Stok opname**: pencatatan hasil perhitungan fisik untuk dibandingkan dengan
stok sistem; selisihnya menjadi dasar penyesuaian.

![Stock Count](/img/erp/wh-stock-counts.png)

### Stock Adjustment (SA)

**Penyesuaian stok** menaikkan/menurunkan kuantitas (mis. hasil opname,
kerusakan) dengan jurnal selisih persediaan.

![Stock Adjustment](/img/erp/wh-stock-adjustments.png)

### Opening Stock (IB)

**Stok awal** saat implementasi — kuantitas & nilai persediaan mula-mula per
item/gudang.

![Opening Stock](/img/erp/wh-opening-stocks.png)

Transaksi lain: **Price Adjustment (PA)**, **Fuel Refill (RF)**, **Time
Sheet/Daily Check (DC)**, dan **Receipt Weigher (RW)** untuk timbangan.

## Reports

### Stock Card (Kartu Stok)

**Kartu stok** menampilkan riwayat mutasi masuk/keluar per item beserta saldo
berjalan — alat penelusuran utama untuk audit persediaan.

![Stock Card](/img/erp/wh-stock-cards.png)

### Stock (Posisi Stok)

Laporan **posisi stok** saat ini per item/gudang.

![Stock Report](/img/erp/wh-stock.png)

Grup Reports lengkap memuat per-dokumen (MR/TS/RS/SP/SA/PA/IB/RF/DC/RW) plus
**Stock Mutation**, **Below Minimum Stock**, **Batch/Serial Items & Cards**,
**COGS Balance**, **Consignment Summary**, **Daily Available Stock**, dan **Stock
Minus**.

## Statistics

Ringkasan analitis stok: **Top Revenue Products**, **Most Profitable Products**,
**Best Selling Products**, **Below Minimum Stock**, **Need Approval**, dan **KPI
Warehouse**.

![KPI Warehouse](/img/erp/wh-kpi.png)

:::tip Pola Transactions vs Data vs Reports
Pola tiga-grup ini berulang di Warehouse, Purchasing, dan Sales:
**Transactions** = membuat dokumen, **Data** = daftar/registry untuk menelusuri &
mengelola dokumen, **Reports** = analisis/cetak. Mulai dari Transactions untuk
input, gunakan Data untuk mencari, Reports untuk evaluasi.
:::
