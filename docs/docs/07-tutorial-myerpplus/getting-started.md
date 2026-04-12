---
title: Getting Started
description: Panduan mulai cepat untuk alur input MYERPPlus pada modul finance, inventory, purchasing, production, dan fixed.
---

# Getting Started

Halaman ini adalah titik mulai cepat untuk memahami alur input transaksi di MYERPPlus pada lima area operasional yang paling sering dipakai:

- finance
- inventory
- purchasing
- production
- fixed

Panduan ini disusun dari ringkasan materi video `MYERP System Breakdown | Financial, Inventory, Purchasing` dan `MYERP System Breakdown | Production, Fix Asset`, lalu ditujukan sebagai peta alur kerja praktis, bukan pengganti SOP perusahaan per role.

## Scope

- menu utama yang dipakai user
- urutan input dokumen per modul
- relasi antar tim: requester, gudang, purchasing, finance
- referensi dokumen lanjutan per prefix modul

## Modul yang Dicakup

| Modul | Prefix | Fokus |
|---|---|---|
| Finance | `m2_*` | Dokumen kas, bank, giro, jurnal, dan monitoring laporan |
| Inventory | `m3_*` | Mutasi barang, terima mutasi, opname, transaksi barang, kontrol stok |
| Purchasing | `m4_*` | PR, RQ, RFQ, PO, GRN, RI, pembayaran hutang, retur |
| Production | `m6_*` | BOM, permintaan produksi, WO, release bahan, return bahan, transaksi produksi |
| Fixed | `m7_*` | Kategori aktiva, master aset, depresiasi, dan lifecycle aset tetap |

Dokumen modul:

- [m2-finance overview](./m2-finance/overview.md)
- [m3-inventory overview](./m3-inventory/overview.md)
- [m4-purchase overview](./m4-purchase/overview.md)
- [production overview](./m6-manufacturing/overview.md)
- [fixed overview](./m7-procurement-advanced/overview.md)

## Cara Membaca Alur

Gunakan urutan berikut saat onboarding user baru:

1. pahami dokumen sumber transaksi
2. tentukan user atau departemen yang membuat input
3. cek menu awal dan menu lanjutan yang terhubung
4. pastikan dampak ke stok, hutang, piutang, atau saldo kas/bank
5. validasi hasil lewat laporan atau history dokumen

## Panduan Per Modul

### Finance

Gunakan modul ini untuk:

- kas masuk dan keluar operasional
- bank masuk dan keluar
- jurnal umum
- giro masuk dan keluar
- validasi ke buku besar dan laporan keuangan

Dokumen:

- [Panduan Input Finance](./m2-finance/input-flow.md)

### Inventory

Gunakan modul ini untuk:

- mutasi stok antar gudang
- penerimaan barang in-transit
- stock opname
- stock adjustment
- monitoring stok minimum dan maksimum

Dokumen:

- [Panduan Input Inventory](./m3-inventory/input-flow.md)

### Purchasing

Gunakan modul ini untuk:

- purchase request
- request quotation
- RFQ
- purchase order
- good receipt note
- invoice pembelian dan uang muka
- pembayaran hutang
- retur pembelian

Dokumen:

- [Panduan Input Purchasing](./m4-purchase/input-flow.md)

### Production

Gunakan modul ini untuk:

- mendefinisikan formula produksi atau BOM
- menerima permintaan produksi dari stok minimum atau kebutuhan sales
- menerbitkan work order
- mengeluarkan bahan baku ke area produksi
- mengembalikan sisa bahan atau bahan reject ke gudang asal
- mengakui hasil barang jadi dan nilai produksi

Dokumen:

- [Panduan Input Production](./m6-manufacturing/input-flow.md)

### Fixed

Gunakan modul ini untuk:

- mengelompokkan kategori aset dan default akun
- mendaftarkan aset tetap yang dimiliki perusahaan
- menghitung dasar penyusutan per bulan
- mengeksekusi depresiasi bulanan sampai nilai buku habis

Dokumen:

- [Panduan Input Fixed](./m7-procurement-advanced/input-flow.md)

## Hubungan Antar Modul

Urutan lintas modul yang paling sering terjadi:

1. user internal membuat `Purchase Request`
2. purchasing membuat `PO`
3. gudang membuat `GRN`
4. finance atau AP membuat `Invoice Pembelian`
5. finance membuat `Pembayaran Hutang`

Untuk inventory:

1. gudang membuat mutasi
2. gudang tujuan menerima mutasi
3. jika ada selisih fisik, lakukan opname
4. hasil opname diselesaikan dengan adjustment

Untuk production:

1. planner atau gudang membuat permintaan produksi
2. produksi membuat `WO`
3. bahan dilepas ke gudang produksi
4. jika ada sisa bahan, buat return
5. hasil barang jadi diakui lewat transaksi produksi

Untuk fixed:

1. tetapkan kategori aset dan akun-akun default
2. daftarkan master aset tetap saat aset siap diakui
3. lakukan proses penyusutan pada akhir bulan
4. review nilai buku sampai umur ekonomis selesai

## Checklist Input Harian

Sebelum closing harian, cek:

- semua kas dan bank sudah masuk
- giro outstanding sudah diperbarui statusnya
- mutasi barang in-transit sudah diterima jika barang fisik sudah sampai
- stock opname yang sudah final sudah dibuat adjustment
- PO yang sudah diterima fisiknya sudah dibuat GRN
- invoice supplier yang sudah diterima sudah diinput
- pembayaran hutang sudah match ke invoice yang benar
- work order yang sudah selesai sudah dibuat transaksi produksi
- aset baru yang sudah aktif sudah masuk master aktiva tetap
- depresiasi bulan berjalan sudah diposting untuk aset aktif

## Next Step

Lanjutkan ke dokumen per modul:

- [m2-finance overview](./m2-finance/overview.md)
- [Panduan Input Finance](./m2-finance/input-flow.md)
- [m3-inventory overview](./m3-inventory/overview.md)
- [Panduan Input Inventory](./m3-inventory/input-flow.md)
- [m4-purchase overview](./m4-purchase/overview.md)
- [Panduan Input Purchasing](./m4-purchase/input-flow.md)
- [production overview](./m6-manufacturing/overview.md)
- [Panduan Input Production](./m6-manufacturing/input-flow.md)
- [fixed overview](./m7-procurement-advanced/overview.md)
- [Panduan Input Fixed](./m7-procurement-advanced/input-flow.md)
