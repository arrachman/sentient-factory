---
title: Panduan Input Inventory
sidebar_position: 2
description: Langkah praktis input transaksi MYERPPlus untuk modul inventory.
---

# Panduan Input Inventory

Modul inventory fokus pada perpindahan barang fisik dan penyesuaian stok sistem.

## Menu yang Umum Dipakai

- Permintaan Barang (`m3_mr`)
- Mutasi Barang (`m3_ts`)
- Terima Mutasi (`m3_rs`)
- Stok Opname (`m3_sp`)
- Transaksi Barang (`m3_sa`)
- Saldo Awal Barang (`m3_ib`)
- Laporan Stok Minimal
- Laporan Stok Maksimal
- Kartu Stok / History Stok

Catatan:
Nama menu di atas mengikuti mapping `m0_menu` yang sudah terdokumentasi di repo untuk family `m3_*`.

## Alur Utama Inventory

### A. Mutasi Barang (`m3_ts`) dan Terima Mutasi (`m3_rs`)

Contoh kasus:

- gudang raw material kirim ke gudang finish good
- gudang pusat kirim ke gudang cabang

Dua pola umum:

- `direct`: stok asal langsung berkurang dan stok tujuan langsung bertambah
- `indirect` atau `in-transit`: gudang asal kirim dulu, gudang tujuan harus konfirmasi lewat `Terima Mutasi (m3_rs)`

Langkah umum:

1. buat dokumen `Mutasi Barang (m3_ts)`
2. pilih gudang asal dan gudang tujuan
3. isi item dan quantity
4. simpan dan approval sesuai flow internal
5. jika model in-transit dipakai, gudang tujuan buka menu `Terima Mutasi (m3_rs)` dan konfirmasi barang datang

Validasi:

- stok gudang asal berkurang
- stok gudang tujuan bertambah setelah status final
- history stok menunjukkan perpindahan dokumen

### B. Stok Opname (`m3_sp`)

Tujuan:

- membandingkan stok fisik dengan stok sistem

Langkah umum:

1. buka menu `Stok Opname (m3_sp)`
2. pilih gudang, area, atau kelompok item
3. tarik data stok sistem
4. isi hasil hitung fisik
5. simpan selisih opname

Validasi:

- sistem menampilkan item surplus atau minus
- dokumen opname menjadi dasar adjustment

### C. Transaksi Barang (`m3_sa`)

Gunakan untuk:

- eksekusi selisih hasil opname
- pemakaian barang habis pakai
- koreksi stok tertentu yang telah disetujui

Langkah umum:

1. buka menu `Transaksi Barang (m3_sa)`
2. referensikan hasil opname jika ada
3. pilih item
4. isi quantity plus atau minus
5. isi alasan adjustment
6. simpan

Validasi:

- stok akhir item berubah sesuai koreksi
- kartu stok mencatat asal penyesuaian

### D. Saldo Awal Barang (`m3_ib`) dan Monitoring Stok

Gunakan `Saldo Awal Barang (m3_ib)` saat perusahaan sedang setup awal stok per item dan gudang.

Langkah umum:

1. buka menu `Saldo Awal Barang (m3_ib)`
2. pilih item, gudang, dan quantity awal
3. isi nilai persediaan awal jika flow implementasi mengharuskan
4. simpan sebelum transaksi harian berjalan penuh

Validasi:

- stok awal tampil benar di kartu stok
- saldo awal tidak bentrok dengan transaksi operasional setelah go-live

### E. Stok Minimal dan Maksimal

Menu ini biasanya dipakai untuk monitoring, bukan transaksi input harian.

Gunakan untuk:

- melihat item yang harus reorder
- menilai item overstock
- menentukan prioritas purchase request
