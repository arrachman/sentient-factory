---
slug: tutorial-input-myerpplus-finance-inventory-purchasing
title: Tutorial Input MYERPPlus untuk Finance, Inventory, dan Purchasing
description: Ringkasan praktis alur input MYERPPlus untuk finance, inventory, dan purchasing berdasarkan breakdown workflow operasional lintas modul.
authors: [slorber]
tags: [erp, myerpplus, finance, inventory, purchasing]
---

Artikel ini merangkum alur input MYERPPlus untuk tiga modul inti: finance, inventory, dan purchasing.

Fokusnya bukan ke struktur database, tetapi ke urutan kerja user saat membuat dokumen transaksi dari awal sampai dampaknya terlihat di laporan atau stok.

<!-- truncate -->

## Cakupan Modul

- `Finance`: kas, bank, giro, jurnal umum, buku besar, laporan
- `Inventory`: mutasi stok, opname, adjustment, stok minimum
- `Purchasing`: PR, RFQ, PO, GRN, invoice pembelian, pembayaran hutang, retur

## 1. Finance

Menu yang biasanya dipakai:

- Kas Masuk
- Kas Keluar
- Bank Masuk
- Bank Keluar
- Jurnal Umum
- Giro Masuk
- Giro Keluar
- Buku Besar
- Neraca
- Laba Rugi
- Arus Kas

Alur singkat:

1. input transaksi operasional ke kas atau bank
2. lakukan jurnal umum bila perlu adjustment
3. update status giro saat cair atau ditolak
4. validasi hasil di buku besar dan laporan keuangan

Contoh use case:

- pengembalian sisa uang jalan
- biaya listrik, internet, gaji operasional
- pembayaran pajak via bank
- jurnal audit dan pembulatan

## 2. Inventory

Menu yang biasanya dipakai:

- Mutasi Barang / Transfer Stock
- Penerimaan Mutasi In-Transit
- Stock Opname
- Stock Adjustment
- Laporan Stok Minimum
- Kartu Stok

Alur singkat:

1. buat mutasi barang dari gudang asal ke gudang tujuan
2. jika model in-transit dipakai, konfirmasi penerimaan di gudang tujuan
3. lakukan stock opname untuk cocokkan stok fisik vs sistem
4. eksekusi selisih dengan stock adjustment
5. gunakan laporan stok minimum sebagai dasar reorder

Contoh use case:

- transfer stok antar gudang
- koreksi hasil hitung fisik
- adjustment pemakaian barang habis pakai

## 3. Purchasing

Menu yang biasanya dipakai:

- Purchase Request
- RFQ
- Purchase Order
- Uang Muka Pembelian
- Good Receipt Note
- Invoice Pembelian
- Rencana Pembayaran Hutang
- Pembayaran Hutang
- Retur Pembelian

Alur singkat:

1. user internal membuat purchase request
2. purchasing meminta penawaran supplier bila perlu
3. buat purchase order
4. saat barang datang, gudang input GRN
5. saat invoice supplier datang, input invoice pembelian
6. finance menyiapkan dan mengeksekusi pembayaran hutang
7. bila ada barang rusak atau mismatch, proses retur pembelian

## Hubungan Antar Tim

Ringkasnya:

- requester membuat kebutuhan
- purchasing mengelola supplier dan PO
- gudang menerima dan memvalidasi barang
- finance atau AP mencatat hutang dan pembayaran

Itulah kenapa ketiga modul ini harus dibaca sebagai satu rangkaian, bukan modul yang berdiri sendiri.

## Referensi Docs Internal

- [Getting Started MYERPPlus](/docs/tutorial-myerpplus/getting-started)
- [m2-finance overview](/docs/tutorial-myerpplus/m2-finance/overview)
- [m3-inventory overview](/docs/tutorial-myerpplus/m3-inventory/overview)
- [m4-purchase overview](/docs/tutorial-myerpplus/m4-purchase/overview)
