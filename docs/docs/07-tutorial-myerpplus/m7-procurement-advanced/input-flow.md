---
title: Panduan Input Fixed
sidebar_position: 2
description: Langkah praktis input transaksi MYERPPlus untuk modul fixed.
---

# Panduan Input Fixed

Modul fixed dipakai untuk mencatat aset tetap perusahaan beserta kategori, akun terkait, nilai perolehan, umur ekonomis, dan proses penyusutan bulanannya.

## Menu yang Umum Dipakai

- Kategori Pajak Aktiva / Asset Category Tax (`m7_asset_category_tax`)
- Kategori Aktiva Tetap / Asset Category (`m7_asset_category`)
- Metode atau Kategori Depresiasi (`m7_depreciation_category`)
- Master Aktiva Tetap / Asset Master (`m7_asset`)
- Penyusutan Aktiva Tetap / Depreciation (`m7_da`)

Catatan:
Nama menu bisa sedikit berbeda per implementasi, tetapi family master dan dokumen `m7_*` di atas adalah anchor teknis yang konsisten di repo.

## Alur Utama Fixed

### A. Kategori Pajak Aktiva (`m7_asset_category_tax`) dan Kategori Aktiva Tetap (`m7_asset_category`)

Langkah ini dipakai untuk mengelompokkan aset dan menyiapkan default akunnya.

Langkah umum:

1. buka menu `Kategori Pajak Aktiva / Asset Category Tax (m7_asset_category_tax)`
2. isi kelompok aset, umur ekonomis standar, dan metode penyusutan sesuai kebijakan
3. lanjutkan ke `Kategori Aktiva Tetap / Asset Category (m7_asset_category)`
4. isi nama kategori aset seperti bangunan, kendaraan, mesin, atau peralatan kantor
5. mapping akun aset, akun akumulasi penyusutan, dan akun beban penyusutan
6. simpan

Validasi:

- user dapat memilih kategori aset yang tepat saat membuat master aset
- akun default untuk jurnal penyusutan sudah siap

### B. Metode atau Kategori Depresiasi (`m7_depreciation_category`)

Gunakan menu ini jika perusahaan membedakan metode penyusutan per kelompok aset.

Langkah umum:

1. buka menu `Metode atau Kategori Depresiasi (m7_depreciation_category)`
2. pilih metode yang dipakai, misalnya garis lurus
3. pastikan metode ini sesuai dengan kategori aset yang akan digunakan
4. simpan

Validasi:

- master aset dapat menarik metode penyusutan yang benar

### C. Master Aktiva Tetap / Asset Master (`m7_asset`)

Menu ini dipakai saat aset tetap sudah siap diakui sebagai milik perusahaan.

Langkah umum:

1. buka menu `Master Aktiva Tetap / Asset Master (m7_asset)`
2. isi identitas aset: nama aset, kategori, lokasi, dan penanggung jawab bila ada
3. isi nilai perolehan
4. isi umur ekonomis
5. pilih metode penyusutan
6. review akun aset, akumulasi penyusutan, dan beban penyusutan
7. simpan

Validasi:

- sistem menghitung dasar penyusutan per bulan dari nilai perolehan dan umur ekonomis
- aset muncul di daftar aset aktif

Contoh:

- aset senilai Rp60.000.000
- umur ekonomis 60 bulan
- beban susut per bulan menjadi Rp1.000.000 dengan metode garis lurus

### D. Penyusutan Aktiva Tetap / Depreciation (`m7_da`)

Penyusutan tidak cukup hanya dihitung di master aset. User tetap perlu menjalankan proses dokumennya setiap akhir bulan.

Langkah umum:

1. buka menu `Penyusutan Aktiva Tetap / Depreciation (m7_da)`
2. review daftar aset yang masih memiliki nilai buku
3. cek nominal beban susut periode berjalan
4. pilih aset yang akan diposting depresiasinya
5. simpan dokumen penyusutan

Dampak:

- beban penyusutan diakui pada periode berjalan
- akumulasi penyusutan bertambah
- nilai buku aset berkurang

## Siklus Kerja Bulanan

Pada akhir bulan, finance atau accounting biasanya melakukan urutan berikut:

1. review aset baru yang sudah aktif
2. pastikan master aset sudah lengkap
3. jalankan `Penyusutan Aktiva Tetap / Depreciation (m7_da)`
4. cek buku besar akun aset, akun akumulasi, dan akun beban susut

## Menu Cek Hasil Fixed

- daftar master aset aktif
- dokumen penyusutan bulan berjalan
- buku besar akun aset tetap
- buku besar akumulasi penyusutan
- laporan laba rugi untuk beban penyusutan
