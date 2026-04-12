---
title: Panduan Input Production
sidebar_position: 2
description: Langkah praktis input transaksi MYERPPlus untuk modul production.
---

# Panduan Input Production

Modul production dipakai untuk mencatat konversi bahan baku menjadi barang setengah jadi atau barang jadi, sekaligus menjaga jejak kebutuhan material, hasil produksi, dan nilai biaya produksi.

## Menu yang Umum Dipakai

- Formula Produksi / BOM (`m6_bom`)
- Permintaan Produksi / PDR (`m6_pdr`)
- Work Order / WO (`m6_wo`)
- Material Release / MRS (`m6_mrs`)
- Material Return / MRN (`m6_mrn`)
- Transaksi Produksi / PD (`m6_pd`)

Catatan:
Nama UI bisa sedikit berbeda per implementasi, tetapi family dokumen `m6_*` di atas adalah anchor teknis yang konsisten di repo.

## Alur Utama Production

### A. Formula Produksi / BOM (`m6_bom`)

Gunakan menu ini untuk menetapkan standar pemakaian bahan.

Langkah umum:

1. buka menu `Formula Produksi / BOM (m6_bom)`
2. pilih item hasil produksi atau finish good
3. isi daftar bahan baku dan bahan pembantu
4. isi quantity standar per batch atau per satuan hasil
5. simpan formula

Validasi:

- BOM bisa dipakai ulang saat membuat `WO`
- kebutuhan material produksi menjadi konsisten

### B. Permintaan Produksi / PDR (`m6_pdr`)

Dokumen ini biasanya dibuat saat stok barang jadi menipis atau ada kebutuhan dari sales dan planning.

Langkah umum:

1. buka menu `Permintaan Produksi / PDR (m6_pdr)`
2. pilih item yang harus diproduksi
3. isi quantity target dan tanggal kebutuhan
4. isi gudang asal permintaan jika flow internal mengharuskan
5. simpan

Output:

- divisi produksi menerima kebutuhan produksi sebagai dasar review

### C. Work Order / WO (`m6_wo`)

`WO` adalah dokumen kerja resmi untuk memulai proses produksi.

Langkah umum:

1. buka menu `Work Order / WO (m6_wo)`
2. tarik referensi dari `Permintaan Produksi / PDR (m6_pdr)` bila ada
3. pilih `BOM` yang dipakai
4. review bahan baku, hasil produksi, dan quantity kerja
5. simpan `WO`

Validasi:

- daftar bahan dari `BOM` masuk ke dokumen kerja
- `WO` menjadi dasar release material

### D. Material Release / MRS (`m6_mrs`)

Menu ini dipakai untuk memindahkan bahan dari gudang bahan ke gudang atau area produksi.

Langkah umum:

1. buka menu `Material Release / MRS (m6_mrs)`
2. referensikan `WO`
3. pilih gudang bahan asal dan gudang produksi tujuan
4. review item serta quantity yang dilepas
5. simpan dokumen release

Dampak:

- stok bahan di gudang asal berkurang
- stok bahan tersedia di area produksi

### E. Material Return / MRN (`m6_mrn`)

Gunakan saat ada sisa bahan, salah spesifikasi, atau bahan perlu dikembalikan dari area produksi ke gudang asal.

Langkah umum:

1. buka menu `Material Return / MRN (m6_mrn)`
2. referensikan `Material Release / MRS (m6_mrs)` bila flow mengharuskan
3. pilih item yang dikembalikan
4. isi quantity return dan alasan
5. simpan

Dampak:

- stok bahan di area produksi berkurang
- stok gudang asal bertambah kembali

### F. Transaksi Produksi / PD (`m6_pd`)

Ini adalah tahap pengakuan hasil produksi.

Langkah umum:

1. buka menu `Transaksi Produksi / PD (m6_pd)`
2. referensikan `WO` atau `MRS` yang sudah selesai diproses
3. isi quantity hasil barang jadi atau WIP yang diakui
4. review pemakaian bahan baku dan bahan pembantu
5. simpan transaksi produksi

Dampak:

- stok bahan baku berkurang final sesuai konsumsi
- stok finish good atau WIP bertambah
- nilai biaya produksi terakumulasi ke hasil produksi

## Penanganan Barang NG atau Reject

Sesuai alur yang dijelaskan pada materi video, barang gagal produksi biasanya tetap diakui dulu pada flow produksi, lalu dikeluarkan melalui penyesuaian stok pada modul inventory.

Urutan praktis:

1. selesaikan dulu `Transaksi Produksi / PD (m6_pd)` untuk hasil yang diakui
2. jika ada barang NG, lanjutkan ke `Transaksi Barang (m3_sa)` pada modul inventory
3. buat adjustment keluar sesuai alasan reject atau scrap

## Menu Cek Hasil Production

- `BOM` untuk review standar formula
- `WO` untuk monitoring order kerja berjalan
- `MRS` dan `MRN` untuk audit keluar masuk bahan
- `PD` untuk review hasil produksi dan quantity barang jadi
- kartu stok inventory untuk validasi perpindahan bahan dan hasil
