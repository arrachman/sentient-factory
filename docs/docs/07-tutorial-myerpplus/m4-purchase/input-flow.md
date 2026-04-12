---
title: Panduan Input Purchasing
sidebar_position: 2
description: Langkah praktis input transaksi MYERPPlus untuk modul purchasing.
---

# Panduan Input Purchasing

Modul purchasing menghubungkan permintaan internal dengan supplier sampai pembayaran hutang.

## Menu yang Umum Dipakai

- Permintaan Pembelian / PR (`m4_pr`)
- Permintaan Penawaran / RQ (`m4_rq`)
- Undangan Penawaran / RFQ (`m4_rfq`)
- Perbandingan Harga / BS (`m4_bs`)
- Order Pembelian / PO (`m4_po`)
- Uang Muka Pembelian / AP (`m4_ap`)
- Penerimaan Barang / GRN (`m4_grn`)
- Invoice Pembelian / RI (`m4_ri`)
- Rencana Pembayaran Hutang / VPP (`m4_vpp`)
- Pembayaran Hutang / VP (`m4_vp`)
- Retur Pembelian / PRT (`m4_prt`)

Catatan:
Nama menu di atas mengikuti mapping kode dokumen `m4_*` yang sudah terdokumentasi di repo.

## Alur Utama Purchasing

### A. Permintaan Pembelian / PR (`m4_pr`)

Dokumen ini biasanya dibuat oleh user peminta dari gudang, engineering, maintenance, atau divisi operasional lain.

Langkah umum:

1. buka menu `Permintaan Pembelian / PR (m4_pr)`
2. isi departemen atau requester
3. isi item, quantity, spesifikasi, dan kebutuhan tanggal
4. simpan
5. lanjutkan ke approval internal bila ada

Output:

- purchasing menerima daftar kebutuhan pembelian

### B. Permintaan Penawaran / RQ (`m4_rq`), Undangan Penawaran / RFQ (`m4_rfq`), dan Perbandingan Harga / BS (`m4_bs`)

Langkah ini opsional, terutama saat:

- supplier belum fixed
- ingin banding harga
- barang bernilai tinggi

Langkah umum:

1. buka menu `Permintaan Penawaran / RQ (m4_rq)` bila tim ingin membuat request penawaran formal
2. lanjutkan ke `Undangan Penawaran / RFQ (m4_rfq)` untuk beberapa supplier kandidat
3. bandingkan hasilnya di `Perbandingan Harga / BS (m4_bs)` bila flow ini dipakai
4. pilih supplier dan harga final sebagai dasar PO

### C. Order Pembelian / PO (`m4_po`) dan Uang Muka Pembelian / AP (`m4_ap`)

Langkah umum:

1. buat `Order Pembelian / PO (m4_po)` dari PR, RQ, atau RFQ yang sudah dipilih
2. isi supplier final
3. isi harga, quantity, termin, pajak, dan tanggal kirim
4. simpan PO
5. jika supplier meminta DP, input `Uang Muka Pembelian / AP (m4_ap)`

Validasi:

- dokumen PO menjadi acuan gudang saat terima barang
- uang muka tercatat pada hutang atau akun terkait sesuai konfigurasi

### D. Penerimaan Barang / GRN (`m4_grn`)

Saat barang fisik tiba:

1. buka menu `Penerimaan Barang / GRN (m4_grn)`
2. tarik referensi dari PO
3. cek barang datang vs quantity PO
4. input quantity diterima
5. simpan GRN

Dampak:

- stok barang bertambah
- nilai persediaan ikut bertambah sesuai penerimaan

### E. Invoice Pembelian / RI (`m4_ri`)

Saat supplier mengirim tagihan:

1. buka menu `Invoice Pembelian / RI (m4_ri)`
2. referensikan PO atau GRN
3. isi nomor invoice supplier
4. isi nominal tagihan, pajak, dan termin
5. simpan

Dampak:

- saldo hutang usaha bertambah

### F. Rencana Pembayaran Hutang / VPP (`m4_vpp`) dan Pembayaran Hutang / VP (`m4_vp`)

Langkah umum:

1. buka `Rencana Pembayaran Hutang / VPP (m4_vpp)` jika perusahaan memakai approval payment plan
2. pilih invoice yang jatuh tempo
3. lanjutkan ke `Pembayaran Hutang / VP (m4_vp)`
4. pilih metode pembayaran: transfer, cek, atau giro
5. simpan pembayaran

Dampak:

- hutang supplier berkurang
- saldo bank atau kas ikut berkurang

### G. Retur Pembelian / PRT (`m4_prt`)

Gunakan saat:

- barang rusak
- quantity tidak sesuai
- spesifikasi tidak cocok

Langkah umum:

1. buka menu `Retur Pembelian / PRT (m4_prt)`
2. referensikan GRN atau invoice pembelian
3. pilih item yang diretur
4. isi quantity retur dan alasan
5. simpan

Dampak:

- stok berkurang
- hutang supplier ikut dikurangi bila retur disetujui
