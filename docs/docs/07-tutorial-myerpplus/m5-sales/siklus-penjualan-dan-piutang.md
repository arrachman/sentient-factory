---
title: Tutorial Lengkap Siklus Penjualan dan Piutang
sidebar_position: 2
description: Alur operasional sales MyERPPlus dari quotation sampai pelunasan piutang.
---

# Tutorial Lengkap Siklus Penjualan dan Piutang

Tutorial ini mencakup seluruh alur operasional penjualan, mulai dari penawaran ke customer, pengiriman barang, hingga pencatatan piutang dan jurnal akuntansi di dalam sistem MyERPPlus.

## Tahap 1: Pra-Penjualan dan Order

Proses pencatatan sebelum barang dikirim, meliputi kesepakatan dan pesanan resmi dari customer.

### 1. Sales Quotation (SQ)

**Fungsi:** Memberikan penawaran awal ke calon customer.

**Detail:** Berisi produk yang ditawarkan, spesifikasi, harga, dan diskon bila ada.

### 2. Kontrak Jual (SF - Sales Contract)

**Fungsi:** Mencatat kesepakatan penjualan jangka panjang dengan customer untuk kuantitas besar.

**Catatan:** SF memonitor jumlah outstanding atau sisa kuota yang belum ditarik ke dalam order.

### 3. Sales Order (SO)

**Fungsi:** Menginput pesanan resmi berdasarkan PO dari customer.

**Cara kerja:** SO dapat menarik data dari SF. Jika memakai SF, jumlah outstanding di SF akan berkurang sesuai jumlah yang diorder di SO. Di SO juga dicatat estimasi tanggal kirim atau delivery plan.

## Tahap 2: Manajemen Uang Masuk Pra-Invoice

Pencatatan dana yang masuk ke rekening perusahaan sebelum invoice resmi diterbitkan.

### 1. Terima Pembayaran (IP - Incoming Payment)

**Fungsi:** Mencatat mutasi uang masuk dari rekening koran bank setiap hari sebelum peruntukannya diketahui.

**Tujuan:** Memastikan saldo rekening koran bank selalu sinkron dengan buku besar di sistem.

### 2. Uang Muka Penjualan (AS - Advance Sales)

Diinput ketika peruntukan uang masuk sudah dikonfirmasi oleh customer.

Terdapat dua jenis:

- **Advance Sales:** uang muka yang sudah memiliki referensi nomor SO spesifik.
- **Deposit:** uang muka tanpa referensi SO, disimpan sebagai saldo deposit untuk memotong tagihan transaksi lain di kemudian hari.

## Tahap 3: Pengiriman Barang

Proses pergerakan fisik barang dari gudang ke customer.

### 1. Packing Barang (PL - Packing List)

**Fungsi:** Mencatat detail packing seperti nomor pack, bentuk, dan berat.

**Catatan:** Dokumen ini opsional dan belum mempengaruhi stok maupun keuangan.

### 2. Delivery Order (DO)

**Fungsi:** Mencatat proses keluarnya barang dari gudang untuk dikirim.

**Efek stok:** Stok di gudang asal berkurang, lalu stok di gudang intransit bertambah.

### 3. Delivery Receipt (DR)

**Fungsi:** Menginput status barang saat tiba di lokasi customer.

**Efek stok jika diterima:** stok intransit berkurang lalu stok gudang customer bertambah.

**Efek stok jika dikembalikan:** stok intransit berkurang lalu stok kembali ke gudang asal.

## Tahap 4: Invoicing dan Pembayaran Piutang

Siklus penagihan resmi dan pencatatan laba perusahaan.

### 1. Proforma Invoice (PI)

**Fungsi:** Dokumen pelengkap bagi customer sebelum invoice resmi.

**Catatan:** PI bersifat opsional dan tidak mempengaruhi laporan keuangan, HPP, maupun pergerakan persediaan.

### 2. Sales Invoice (SI)

**Fungsi:** Menerbitkan tagihan resmi ke customer dan menentukan umur piutang berdasarkan termin.

**Efek stok:** Mengurangi stok secara permanen dari gudang customer, atau dari gudang transit bila langsung ditarik dari DO.

**Efek jurnal:** Muncul piutang, PPN, penjualan, dan HPP terhadap persediaan.

### 3. Sales Return (SR)

**Fungsi:** Mencatat pengembalian barang setelah invoice diterbitkan.

**Efek stok:** Stok kembali masuk ke gudang perusahaan.

**Efek jurnal:** Piutang dan akun penjualan berkurang, persediaan bertambah, dan HPP berkurang.

### 4. Penagihan Piutang (IC - Incoming Collection)

**Fungsi:** Membuat dokumen rincian tagihan dengan perhitungan total invoice, uang muka, terima pembayaran, dan retur.

**Catatan:** Pada tahap ini bisa ditambahkan penyesuaian COA manual, misalnya diskon tambahan.

### 5. Pembayaran Piutang

**Fungsi:** Mengeksekusi pelunasan tagihan dengan memilih invoice mana saja yang dibayar dan memotongnya dengan deposit atau uang muka yang tersedia.

**Efek jurnal:** Piutang berkurang dan saldo kas atau bank bertambah.

## Ringkasan Alur Dokumen

Urutan operasional yang paling umum:

1. `SQ`
2. `SF` bila ada kontrak
3. `SO`
4. `IP` dan `AS` bila ada pembayaran awal
5. `PL` bila perlu packing detail
6. `DO`
7. `DR`
8. `PI` bila diperlukan customer
9. `SI`
10. `SR` bila ada retur
11. `IC`
12. `Pembayaran piutang`

## Fokus Analisis Data M5

Dalam konteks query, schema, dan dashboard, modul sales biasanya dianalisis dari sisi berikut:

- outstanding order per customer
- delivery status per dokumen
- aging piutang
- realisasi invoice terhadap SO atau DO
- retur dan dampaknya ke penjualan bersih

