---
sidebar_position: 4
title: Kalender Libur (Tambah · Ubah · Hapus)
---

# Kalender Libur

Rute `/app/holidays` · grup **Manajemen Tenaga Kerja** · *live* · kode layar `HOL`
· CRUD **privileged** (daftar publik).

Layar ini mengelola daftar **hari libur** (nasional/regional) yang menjadi acuan
perhitungan lembur dan rekap timesheet. Alur CRUD-nya mirip
[Jadwal & Shift](/hr/tenaga-kerja/jadwal-shift), tetapi ada **dua perbedaan penting**
yang sengaja ditonjolkan di halaman ini: (1) daftar dibungkus *list layout* kaya —
ada **pencarian**, **filter tahun**, dan penghitung baris; dan (2) **penghapusan di
sini MEMINTA konfirmasi** lebih dulu, tidak langsung seperti pada shift. Perhatikan
kontras itu saat membaca.

## Use case: kenapa hari libur perlu didaftarkan

Perhitungan jam kerja tidak bisa "menebak" tanggal merah. Ketika seorang karyawan
tetap masuk pada 17 Agustus, sistem harus tahu bahwa hari itu **hari libur** agar
jamnya bisa diperlakukan sebagai lembur (bila kebijakan *hari libur = lembur*
aktif), dan agar rekap timesheet menandainya benar. Sebaliknya, hari libur yang
terdaftar juga dipakai untuk memvalidasi cuti dan menghitung hari kerja efektif.

Karena itu Admin HR mendaftarkan seluruh tanggal merah di awal tahun — libur
nasional yang **berulang tiap tahun** (Tahun Baru, Hari Buruh, Natal) cukup ditandai
sekali dengan opsi *Berulang*, sedangkan cuti bersama yang tanggalnya berubah tiap
tahun didaftarkan per tahun. Hasilnya dikonsumsi oleh
[Aturan Lembur](/hr/laporan-lainnya/aturan-lembur) dan
[Timesheet](/hr/tenaga-kerja/timesheet) (`holidayDays`/`holidayMinutes`).

![Daftar Kalender Libur tahun berjalan](/img/hr/hol-01-list.png)

### Elemen di daftar

Berbeda dari tabel polos Jadwal & Shift, layar ini memakai *list layout* standar
Senti HR dengan beberapa kontrol di kepala tabel:

- **Filter Tahun** (kiri) — memilih tahun sebelumnya, tahun berjalan, atau tahun
  depan; tabel hanya menampilkan libur pada tahun terpilih. Di sebelahnya ada
  **✕ Reset filter**.
- **Kotak pencarian** (kanan atas, pintasan `/`) — menyaring berdasarkan **nama**
  atau **wilayah** secara langsung di sisi klien.
- Tombol **⟳ refresh** dan **+ Tambah Hari Libur** (pintasan `N`).
- **Penghitung** *Hari libur · N baris* di kanan menunjukkan jumlah baris yang
  tampil dibanding total.
- Baris footer menampilkan **pintasan keyboard**: `/` cari · `N` tambah · `J`/`K`
  pindah baris.

| Kolom | Isi |
| --- | --- |
| **Tanggal** | Tanggal libur (format `YYYY-MM-DD`). |
| **Hari** | Nama hari (otomatis dari tanggal, mis. *Senin*). |
| **Nama** | Nama libur (mis. *Hari Kemerdekaan RI*). |
| **Wilayah** | Cakupan (mis. *Nasional*); boleh kosong → tampil `—`. |
| **Sifat** | Lencana `Berulang` (bila tahunan) + lencana `aktif`/`nonaktif`. |
| *(aksi)* | Ikon **pensil** (ubah) dan **tong sampah** (hapus). |

---

## Menambah hari libur

### Langkah 1 — Buka dialog

Tekan **+ Tambah Hari Libur** (atau tombol `N`). Dialog **"Tambah Hari Libur"**
terbuka. Kolom **Tanggal** dan **Nama** kosong; **Wilayah** kosong dengan
*placeholder* `Nasional`; kotak centang **Berulang tiap tahun** *tidak* tercentang,
sementara **Aktif** **sudah tercentang** sebagai default (libur baru langsung
berlaku).

![Dialog Tambah Hari Libur kosong](/img/hr/hol-02-add-empty.png)

### Langkah 2 — Peringatan validasi

Menekan **Simpan** tanpa **Tanggal** atau **Nama** memunculkan toast peringatan di
pojok kanan bawah, tanpa mengirim apa pun ke server:

> ⚠️ **Tanggal dan nama hari libur wajib diisi.**

![Toast validasi saat Tanggal/Nama kosong](/img/hr/hol-03-validation-warning.png)

Kolom **Wilayah** bersifat opsional — boleh dikosongkan (nanti tampil `—` di
tabel). Jadi hanya **Tanggal** dan **Nama** yang wajib.

### Langkah 3 — Isi form

Contoh: mendaftarkan sebuah hari libur nasional yang berulang tiap tahun.

| Kolom | Yang diisi | Catatan |
| --- | --- | --- |
| **Tanggal** | pilih dari kalender | Pemilih tanggal bawaan browser. |
| **Wilayah** | `Nasional` | Opsional; isi bila libur hanya berlaku di wilayah tertentu. |
| **Nama** | `Hari Kemerdekaan RI` | Wajib. |
| **Berulang tiap tahun** | ✔ dicentang | Tandai bila tanggalnya tetap tiap tahun. |
| **Aktif** | ✔ (default) | Hilangkan centang untuk menyimpan libur tapi menonaktifkannya. |

![Dialog Tambah Hari Libur terisi lengkap](/img/hr/hol-04-add-filled.png)

:::caution Tanggal tidak boleh bentrok
Satu tanggal hanya boleh punya satu entri libur. Bila Anda mencoba menyimpan
tanggal yang **sudah ada** di daftar, server menolak dan muncul toast galat
**"Gagal menyimpan hari libur."** — bukan sukses. Ubah tanggalnya atau sunting
entri yang sudah ada.
:::

### Langkah 4 — Simpan

Tekan **Simpan**. Bila berhasil: dialog tertutup, daftar bertambah satu baris, dan
toast konfirmasi tampil:

> ✅ **Hari libur ditambahkan.**

![Baris baru muncul dengan toast "Hari libur ditambahkan."](/img/hr/hol-05-add-success.png)

---

## Mengubah hari libur

Klik ikon **pensil** pada baris. Dialog **"Edit Hari Libur"** terbuka dengan seluruh
kolom sudah terisi nilai lama, termasuk status centang **Berulang**/**Aktif**.

![Dialog Edit Hari Libur ter-prefill](/img/hr/hol-06-edit-dialog.png)

Validasinya sama: **Tanggal** dan **Nama** tetap wajib. Ubah yang perlu — misalnya
mengoreksi wilayah atau menonaktifkan libur dengan menghapus centang **Aktif** —
lalu tekan **Simpan**. Toast konfirmasi:

> ✅ **Hari libur diperbarui.**

![Toast "Hari libur diperbarui." setelah menyimpan](/img/hr/hol-07-edit-success.png)

:::tip Menonaktifkan vs menghapus
Bila sebuah libur ternyata tidak berlaku (mis. cuti bersama dibatalkan), lebih aman
**menghapus centang Aktif** lewat Edit daripada menghapus barisnya. Libur nonaktif
tetap tersimpan (lencana abu-abu *nonaktif*) dan tidak diperhitungkan lembur, tapi
riwayatnya tidak hilang.
:::

---

## Menghapus hari libur

Klik ikon **tong sampah** merah pada baris.

:::note Ada konfirmasi — berbeda dari Jadwal & Shift
Tidak seperti penghapusan shift yang langsung, di sini browser lebih dulu
menampilkan **kotak konfirmasi bawaan** dengan pesan yang menyebut nama libur,
misalnya:

> **Hapus hari libur "Hari Kemerdekaan RI"?**  — dengan tombol **OK** dan **Batal**.

Penghapusan baru terjadi bila Anda menekan **OK**. Menekan **Batal** membatalkan
tanpa efek apa pun. Ini adalah jaring pengaman yang tidak dimiliki layar Jadwal &
Shift — namun tetap **tidak bisa di-undo** setelah dikonfirmasi.
:::

Setelah konfirmasi, baris hilang dan muncul toast:

> ✅ **Hari libur dihapus.**

![Toast "Hari libur dihapus." setelah konfirmasi](/img/hr/hol-08-delete-success.png)

---

## Referensi pesan & peringatan sistem

| Pesan | Jenis | Kapan muncul | Tindakan Anda |
| --- | --- | --- | --- |
| **Tanggal dan nama hari libur wajib diisi.** | ⚠️ Peringatan | *Simpan* ditekan saat Tanggal atau Nama kosong. Tidak dikirim ke server. | Lengkapi Tanggal & Nama. |
| **Hapus hari libur "…"?** | ❓ Konfirmasi (dialog browser) | Ikon hapus diklik. | **OK** untuk menghapus, **Batal** untuk membatalkan. |
| **Hari libur ditambahkan.** | ✅ Sukses | Libur baru tersimpan. | — |
| **Hari libur diperbarui.** | ✅ Sukses | Perubahan tersimpan. | — |
| **Hari libur dihapus.** | ✅ Sukses | Libur terhapus permanen. | — (tak bisa di-undo). |
| **Gagal menyimpan hari libur.** | ❌ Galat | Server menolak simpan (mis. tanggal bentrok, sesi kedaluwarsa, atau pesan spesifik backend). | Ubah tanggal / login ulang / coba lagi. |
| **Gagal menghapus.** | ❌ Galat | Server menolak penghapusan. | Muat ulang lalu coba lagi. |
| **Belum ada hari libur tahun ini.** | ℹ️ Info (state kosong) | Tahun terpilih tidak punya entri libur sama sekali. | Tambahkan libur, atau ganti tahun. |
| **Tidak ada hasil untuk filter ini.** | ℹ️ Info (state kosong) | Pencarian/tahun menyaring habis semua baris. | Longgarkan pencarian atau **Reset filter**. |
