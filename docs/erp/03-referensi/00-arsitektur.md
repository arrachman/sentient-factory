---
slug: /referensi/arsitektur
sidebar_position: 1
title: Arsitektur & Navigasi
---

# Arsitektur & Navigasi

Sebelum masuk ke tiap modul, pahami **kerangka aplikasi (shell)** yang sama di
seluruh Senti ERP. Memahami satu kali berarti Anda menguasai pola di semua
halaman.

![Master Item — anatomi shell Senti ERP](/img/erp/md-items.png)

## Anatomi layar

Setiap layar tersusun atas empat zona tetap:

| Zona | Letak | Isi |
| --- | --- | --- |
| **Sidebar modul** | Kiri | Daftar modul (Administrator, Master Data, Finance, dst). Klik modul → sub-grup mengembang; klik sub-item → membuka tab. |
| **Topbar** | Atas | Logo, **pemilih workspace** (mis. *Global*), *breadcrumb* (Modul / Halaman), **Search everything** (⌘K), notifikasi, status, dan menu akun. |
| **Bilah tab** | Bawah topbar | Tab halaman yang sedang terbuka. Tombol **+** membuka tab baru; setiap tab punya rute sendiri. |
| **Area kerja** | Tengah | Konten halaman aktif — biasanya sebuah **grid** (daftar) atau **form**. |

### Workspace & tab

Senti ERP mendukung **banyak tab** dalam satu workspace (hingga 16 tab). Ini
memungkinkan, misalnya, membuka PO sambil mengecek stok item di tab lain.
Susunan tab disimpan otomatis sehingga pulih saat Anda kembali. Workspace
*Global* adalah ruang kerja default.

### Command palette (⌘K)

Tekan **⌘K** (macOS) atau **Ctrl+K** (Windows/Linux), atau klik **Search
everything…** di topbar, lalu ketik nama halaman/dokumen untuk melompat tanpa
menelusuri sidebar.

## Pola halaman daftar (grid)

Mayoritas master data dan daftar transaksi memakai **grid** dengan elemen yang
konsisten:

- **Judul + kode** halaman (mis. *Item · ITM*).
- **Toolbar kanan-atas**: **Search**, **Export**, **Refresh** (⟳), dan **+ New**
  untuk membuat entri baru.
- **Baris filter**: filter **Status** (Active/Inactive/All), **Tipe**, rentang
  **Tanggal**, dan **Reset filter**. Penghitung **Σ … rows** menampilkan total.
- **Header kolom** dapat di-*sort* (ikon panah). Kolom umum: Kode, Nama,
  Status, dan kolom spesifik modul.
- **Kolom aksi** per baris (titik tiga / tombol) untuk **Edit**, **Nonaktifkan**,
  **Hapus**.
- **Pagination** di bawah: *rows per page* (default 25), navigasi halaman.
- **Pintasan keyboard** (pojok kanan-bawah): `J`/`K` pindah baris, `X` pilih,
  `N` entri baru.

Contoh berikut memakai halaman **Master Data → Units/Satuan**. Halaman ini
dipilih karena bentuknya sederhana, tetapi pola interaksinya sama dengan banyak
master lain: user melihat daftar, mencari record, menambah record baru,
mengoreksi data lewat edit, lalu menghapus record yang tidak dipakai.

![Daftar Units/Satuan — grid, filter status, search, export, refresh, dan tombol New](/img/erp/crud-01-units-list.png)

## Model CRUD master data

Bayangkan admin implementasi sedang menyiapkan master satuan sebelum item
barang diimpor. Item tidak bisa dipakai dengan benar bila satuannya belum
rapi: `KG`, `PCS`, `LTR`, `ROLL`, dan satuan lain perlu tersedia dulu. Dalam
use case seperti ini, admin biasanya bekerja dari halaman daftar, mengecek
apakah satuan sudah ada, menambah satuan yang belum ada, memperbaiki nama atau
faktor konversi bila salah, lalu menghapus data uji atau data yang tidak
seharusnya masuk.

### Menambah data

Untuk membuat satuan baru, klik **New** di kanan atas atau tekan `N`. Sistem
membuka form di atas grid, sementara daftar di belakang dibuat redup agar fokus
tetap pada form yang sedang diisi.

![Form New Satuan — field wajib Kode dan Nama, faktor konversi, status, Save, dan Simpan & Tambah Baru](/img/erp/crud-02-units-add-empty.png)

Pada form ini, label bertanda `*` adalah field wajib. **Kode** dipakai sebagai
identitas bisnis yang singkat dan mudah dicari, sedangkan **Nama** adalah label
yang dibaca user di transaksi. **Faktor Konversi** menjelaskan hubungan satuan
ini terhadap satuan dasar; misalnya Lusin = 12 atau Kwintal = 100. Status
**Aktif/Nonaktif** menentukan apakah satuan muncul sebagai pilihan di form lain.

Jika user langsung menekan **Save** tanpa mengisi field wajib, sistem tidak
menyimpan data. Ia menampilkan ringkasan error di bagian atas form dan pesan
per-field tepat di bawah input yang bermasalah.

![Validasi form Satuan — 2 field perlu diperbaiki, Kode wajib diisi, Nama wajib diisi](/img/erp/crud-03-units-validation-warning.png)

Pesan **“2 field perlu diperbaiki”** berarti validasi masih berhenti di
browser, sebelum data dikirim sebagai record final. Dalam contoh ini,
tindakannya jelas: isi Kode dan Nama. Setelah semua field wajib valid, admin
bisa memilih:

- **Save** untuk menyimpan dan menutup form.
- **Simpan & Tambah Baru** untuk menyimpan lalu mengosongkan form agar admin
  bisa lanjut input satuan berikutnya.
- **Cancel** atau tombol **X** untuk menutup tanpa menyimpan.

Saat data berhasil dibuat, record langsung muncul di grid dan toast sukses
ditampilkan di kanan bawah.

![Record Satuan berhasil dibuat — baris DOC502319 muncul dan toast “Satuan created” tampil](/img/erp/crud-05-units-add-success.png)

### Mengedit data

Edit dipakai ketika data sudah ada tetapi nilainya perlu dikoreksi, misalnya
nama satuan kurang jelas, faktor konversi salah, atau status perlu diganti
menjadi Nonaktif. Ada dua jalur umum: klik kode pada baris, atau buka menu
titik tiga di kanan baris lalu pilih **Edit**.

![Form Edit Satuan — data existing terisi kembali untuk dikoreksi](/img/erp/crud-06-units-edit-modal.png)

Perhatikan bahwa mode edit tidak menampilkan tombol **Simpan & Tambah Baru**,
karena konteksnya memperbarui satu record yang sudah ada. User mengubah nilai
yang diperlukan lalu klik **Save**. Aturan validasinya sama seperti tambah:
Kode dan Nama tetap wajib, dan sistem akan menolak simpan bila data tidak
memenuhi aturan backend.

Pada pengujian screenshot, server sempat mengembalikan toast **“Bad Request”**
saat update. Ini adalah contoh warning/error server-side: form tetap terbuka,
data belum dianggap tersimpan, dan user harus mengecek nilai yang dikirim atau
mengulang setelah penyebabnya diketahui.

![Warning server saat edit — toast “Bad Request” muncul dan form tetap terbuka](/img/erp/crud-08-units-edit-success.png)

### Menghapus data

Hapus dilakukan dari menu aksi baris. Klik titik tiga di kanan baris untuk
membuka pilihan **Edit**, **Duplikat**, **History**, dan **Delete**.

![Menu aksi baris Satuan — Edit, Duplikat, History, Delete](/img/erp/crud-09-units-row-actions.png)

Ketika **Delete** dipilih, sistem tidak langsung menghapus. Dialog konfirmasi
muncul lebih dulu dengan nama record yang akan dihapus. Ini penting karena data
master sering dipakai oleh transaksi lain; konfirmasi membuat user membaca
ulang record yang akan terkena aksi.

![Dialog konfirmasi delete — record DOC502319 akan dihapus permanen](/img/erp/crud-10-units-delete-confirm.png)

Pilih **Cancel** untuk batal. Pilih **Delete** untuk melanjutkan. Setelah
berhasil, record hilang dari hasil pencarian dan toast sukses muncul.

![Setelah delete — hasil pencarian kosong dan toast “Satuan deleted” tampil](/img/erp/crud-11-units-delete-success.png)

:::note Soft-delete
Menghapus baris umumnya bersifat **soft-delete** (data dinonaktifkan, bukan
dihapus permanen) demi jejak audit. Filter **Status** memakai konsep yang sama:
*Active* menyembunyikan data yang dinonaktifkan.
:::

:::warning Perhatikan jenis data sebelum menghapus
Untuk sebagian master sederhana, UI menyebut delete sebagai penghapusan
permanen di dialog konfirmasi. Untuk data yang sudah dipakai transaksi,
praktik operasional yang lebih aman adalah **Nonaktifkan** atau ubah status
lebih dulu, agar histori dokumen lama tetap bisa dibaca konsisten. Bila backend
menolak delete karena data masih direferensikan, UI akan menampilkan toast
error dan record tidak dihapus.
:::

## Pesan info, warning, dan error

Berikut arti pesan yang terlihat pada alur CRUD ERP:

| Pesan/kondisi | Kapan muncul | Arti dan tindakan |
| --- | --- | --- |
| `*` pada label field | Form tambah/edit | Field wajib. Isi sebelum menyimpan. |
| **“2 field perlu diperbaiki”** | Klik Save saat Kode/Nama kosong | Validasi client gagal. Baca daftar error, perbaiki field yang ditandai merah. |
| **“Kode wajib diisi”**, **“Nama wajib diisi”** | Input wajib kosong | Isi nilai yang benar; fokus biasanya diarahkan ke field pertama yang error. |
| **“Satuan created”** | Save tambah berhasil | Data sudah masuk dan grid dimuat ulang. |
| **“Bad Request”** | Server menolak request simpan/update | Data belum tersimpan. Cek format, duplikasi kode, status sesi, atau aturan backend. |
| Dialog **“Delete satuan?”** | Klik Delete pada menu aksi | Konfirmasi terakhir. Cancel membatalkan; Delete melanjutkan penghapusan. |
| **“Satuan deleted”** | Delete berhasil | Record sudah tidak muncul di daftar aktif/hasil pencarian. |
| **“Tidak ada hasil”** | Search/filter tidak menemukan record | Reset filter atau ubah kata kunci pencarian. |
| **“Memuat...”** atau bar tipis loading | Fetch awal atau refresh | Tunggu sampai data selesai dimuat. |
| **“Export belum tersedia”** | Klik Export pada halaman yang belum punya exporter | Fitur belum aktif untuk halaman itu; gunakan laporan/ekspor lain bila tersedia. |

## Pola halaman form

Form (membuat/mengubah dokumen) tampil di tab tersendiri. Polanya:

- **Header dokumen**: nomor (otomatis dari penomoran), tanggal, partner/akun,
  cabang/gudang.
- **Baris detail**: tabel item/akun yang bisa ditambah/hapus per baris;
  subtotal, pajak, dan total dihitung otomatis.
- **Aksi simpan**: **Simpan** (draft) atau **Posting** (mengesahkan & membentuk
  jurnal/efek stok). Lihat siklus status di bawah.

## Siklus status dokumen

Dokumen transaksi mengikuti siklus hidup standar:

```
DRAFT  →  POSTED  →  (CANCELLED / RETURNED)
```

- **DRAFT** — tersimpan, belum berdampak ke buku besar/stok; masih bisa diedit.
- **POSTED** — disahkan; membentuk **jurnal akuntansi** dan/atau **mutasi stok**.
- **CANCELLED / RETURNED** — pembatalan/retur membentuk efek balik.

## Pola laporan

Halaman **Reports** menampilkan parameter di atas (mis. **Per Tanggal**,
rentang periode) + tombol **Tampilkan**, lalu hasil tabel di bawah. Sebagian
besar laporan menyediakan **ekspor Excel / PDF / Word**.

![Laporan Neraca dengan ekspor Excel/PDF/Word](/img/erp/fin-balance-sheet.png)

## Bahasa & tampilan

Aplikasi mendukung **Indonesia / English / 日本語** serta preferensi tampilan
(tema, kerapatan, mode rute per-halaman). Atur lewat **Administrator → Initial
Setup → Preferensi** dan **System → Appearance**.
