---
title: Panduan Input Finance
sidebar_position: 2
description: Langkah praktis input transaksi MYERPPlus untuk modul finance.
---

# Panduan Input Finance

Modul finance dipakai untuk transaksi operasional yang tidak selalu berasal langsung dari flow sales atau purchase, misalnya biaya operasional, mutasi bank, giro, dan jurnal penyesuaian.

## Menu yang Umum Dipakai

- Kas Masuk (`m2_cr`)
- Kas Keluar (`m2_cd`)
- Bank Masuk / Receipt Money (`m2_rm`)
- Bank Keluar / Send Money (`m2_sm`)
- Giro Masuk (`m2_rg`)
- Giro Keluar (`m2_sg`)
- Jurnal Umum (`m2_gj`)
- Adjustment Journal (`m2_aj`)
- Memorial Journal (`m2_jm`)
- Buku Besar
- Neraca
- Laba Rugi
- Arus Kas

Catatan:
Nama UI bisa sedikit berbeda per implementasi, tetapi family dokumen `m2_*` di atas adalah anchor teknis yang konsisten di repo.

## Kapan Pakai Menu Finance

- gunakan `Kas Masuk (m2_cr)` saat ada penerimaan tunai operasional
- gunakan `Kas Keluar (m2_cd)` saat ada pengeluaran kas kecil atau biaya operasional harian
- gunakan `Bank Masuk / Receipt Money (m2_rm)` dan `Bank Keluar / Send Money (m2_sm)` untuk transaksi via transfer atau rekening bank
- gunakan `Jurnal Umum (m2_gj)` untuk jurnal umum reguler
- gunakan `Adjustment Journal (m2_aj)` atau `Memorial Journal (m2_jm)` untuk penyesuaian tertentu sesuai SOP internal
- gunakan `Giro Masuk (m2_rg)` dan `Giro Keluar (m2_sg)` untuk pencatatan giro yang belum cair

## Alur Input Finance

### A. Kas Masuk (`m2_cr`) / Kas Keluar (`m2_cd`)

Contoh kasus:

- pengembalian sisa uang jalan
- pembayaran listrik
- pembayaran internet
- pembayaran gaji tertentu di luar payroll flow lain

Langkah umum:

1. buka menu `Kas Masuk (m2_cr)` atau `Kas Keluar (m2_cd)`
2. isi tanggal transaksi
3. pilih kas atau akun kas yang digunakan
4. isi pihak terkait jika ada
5. isi nominal
6. pilih akun biaya atau akun lawan transaksi
7. isi memo atau keterangan transaksi
8. simpan dan pastikan nomor dokumen terbentuk

Validasi:

- saldo kas berubah
- transaksi muncul di buku besar akun terkait

### B. Bank Masuk / Receipt Money (`m2_rm`) dan Bank Keluar / Send Money (`m2_sm`)

Contoh kasus:

- pembayaran pajak
- pembayaran ekspedisi
- mutasi antar bank
- penerimaan transfer non-penjualan

Langkah umum:

1. buka menu `Bank Masuk / Receipt Money (m2_rm)` atau `Bank Keluar / Send Money (m2_sm)`
2. pilih rekening bank sumber atau tujuan
3. isi tanggal transaksi
4. isi referensi transfer atau nomor bukti
5. isi nominal
6. pilih akun lawan
7. simpan

Validasi:

- saldo rekening berubah
- mutasi muncul di laporan bank dan buku besar

### C. Jurnal Umum (`m2_gj`), Adjustment Journal (`m2_aj`), dan Memorial Journal (`m2_jm`)

Gunakan untuk:

- selisih kurs
- pembulatan
- koreksi audit
- penyesuaian akhir periode

Langkah umum:

1. buka menu `Jurnal Umum (m2_gj)` atau jurnal penyesuaian yang relevan
2. isi header jurnal: tanggal, memo, referensi
3. tambahkan baris debit dan kredit
4. pastikan total debit = total kredit
5. simpan dan posting jika proses internal mengharuskan

Validasi:

- jurnal masuk ke buku besar
- pengaruhnya terlihat di neraca atau laba rugi

### D. Giro Masuk (`m2_rg`) / Giro Keluar (`m2_sg`)

Langkah umum:

1. buat dokumen `Giro Masuk (m2_rg)` atau `Giro Keluar (m2_sg)`
2. isi nomor giro, bank, tanggal jatuh tempo, dan nominal
3. simpan sebagai giro outstanding
4. saat giro cair atau ditolak, update status dokumen

Validasi:

- saat status berubah menjadi cair, saldo bank ikut berubah
- saat ditolak atau batal, outstanding giro ikut disesuaikan

## Menu Cek Hasil Finance

- Buku Besar untuk mutasi akun
- Neraca untuk posisi aset, kewajiban, dan ekuitas
- Laba Rugi untuk dampak pendapatan dan biaya
- Arus Kas untuk klasifikasi cashflow
