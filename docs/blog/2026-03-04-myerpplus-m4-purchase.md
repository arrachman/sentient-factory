---
slug: myerpplus-m4-purchase
title: Pemetaan DB myerpplus Prefix m4_ (Purchasing dan Account Payable)
description: Dokumentasi struktur tabel m4_ pada database myerpplus, termasuk domain proses, pola penamaan tabel, dan mapping kode dokumen pembelian.
authors: [slorber]
tags: [database, erp, mysql]
---

Artikel ini merangkum hasil pengecekan langsung schema `myerpplus` untuk semua tabel dengan prefix `m4_`.

<!-- truncate -->

## Ringkasan Cepat

- Total tabel prefix `m4_`: **136 tabel**
- Domain utama: **Pembelian (Purchasing)** + **Hutang Dagang (Account Payable)**
- Pola umum per dokumen:
  - header: `m4_<kode>`
  - detail: `m4_<kode>_detail`
  - histori: `m4_<kode>_history`, `m4_<kode>_detail_history`
  - enriched view/data: `m4_<kode>_v`, `m4_<kode>_getdata`
  - relasi dokumen: `m4_<kode>_terkait`
  - pembayaran: `m4_<kode>_pay`
  - biaya tambahan: `m4_<kode>_cost`

## Mapping Kode Dokumen m4_

Berdasarkan `m0_menu` module pembelian (`mnmoduleid = 4`) dan verifikasi tabel:

- `pr`: Permintaan Pembelian
- `rfq`: Undangan Penawaran
- `rq`: Permintaan Penawaran
- `bs`: Perbandingan Harga
- `po`: Order Pembelian
- `ap`: Uang Muka Pembelian
- `grn`: Penerimaan Barang
- `ri`: Invoice Pembelian
- `pp`: Hutang Ongkos Kirim
- `dnr`: Pengiriman Barang Retur
- `prt`: Retur Pembelian
- `vpp`: Rencana Pembayaran Hutang
- `vp`: Pembayaran Hutang
- `pie`: Tukar Faktur
- `ipc`: Kalkulasi Import
- utilitas: `m4_files`, `m4_notes`

## Jumlah Tabel per Kode

Hasil agregasi `information_schema.tables`:

- `ap`: 7
- `bs`: 7
- `cs`: 2
- `dnr`: 9
- `files`: 1
- `grn`: 12
- `ipc`: 2
- `notes`: 2
- `pie`: 6
- `po`: 15
- `pp`: 3
- `pr`: 11
- `prt`: 7
- `rfq`: 4
- `ri`: 13
- `rq`: 11
- `vp`: 10
- `vpp`: 14

## Ciri Kolom Bisnis Utama

Contoh kolom yang muncul berulang di banyak tabel `m4_`:

- pihak dan proses pembelian:
  - `supplier`, `supplierkontak`, `bagianpembelian`, `carabayar`, `tgljatuhtempo`
- barang dan gudang:
  - `lokasi`, `gudang`, `idbarang`, `namabarang`, `jmlbarang`, `satuanbarang`
- nilai transaksi:
  - `diskon`, `jmldiskon`, `pajak1`, `pajak2`, `jumlah`, `jumlahbayar`, `statusbayar`
- akun/rekening:
  - variasi kolom `rek...` seperti `rekdiskon`, `rekpajak1`, `rekpajak2`, `rekbayar`

Ini menegaskan bahwa `m4_` menangani alur end-to-end dari request pembelian sampai pembayaran hutang.

## Query Bantu Verifikasi

```sql
-- Total tabel m4_
SELECT COUNT(*)
FROM information_schema.tables
WHERE table_schema='myerpplus'
  AND table_name LIKE 'm4\_%';

-- Daftar tabel m4_
SELECT table_name
FROM information_schema.tables
WHERE table_schema='myerpplus'
  AND table_name LIKE 'm4\_%'
ORDER BY table_name;

-- Rekap jumlah tabel per kode dokumen
SELECT SUBSTRING_INDEX(SUBSTRING(table_name,4), '_', 1) AS kode,
       COUNT(*) AS jml_tabel
FROM information_schema.tables
WHERE table_schema='myerpplus'
  AND table_name LIKE 'm4\_%'
GROUP BY kode
ORDER BY kode;
```

## Catatan Implementasi

Untuk integrasi dashboard/BI, pendekatan yang aman:

- jadikan tabel header `m4_<kode>` sebagai sumber status dokumen
- gabungkan dengan `m4_<kode>_detail` untuk item-level quantity dan amount
- pakai `m4_<kode>_history` untuk audit trail perubahan
- gunakan `m4_<kode>_terkait` saat butuh lineage antar dokumen (misalnya PR -> PO -> GRN -> RI -> VP)

