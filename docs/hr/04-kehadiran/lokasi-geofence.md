---
sidebar_position: 5
title: Lokasi & Geofence (Tambah · Ubah · Hapus)
---

# Lokasi & Geofence

Rute `/app/worksites` · grup **Kehadiran** · *live* · kode layar `GEO` ·
**privileged**.

Layar ini mengelola master **worksite** (lokasi kerja) beserta **radius geofence**
yang dipakai memvalidasi absensi berbasis GPS — adaptasi *jibble Geofencing*. Ini
adalah **layar CRUD paling kaya** di Senti HR: selain dialog tambah/ubah biasa, ia
punya **pemilihan baris (checkbox)**, **penghapusan massal** lewat bulk bar, dan
**menu kebab ⋮ / klik-kanan** per baris. Jadi selain alur tambah–ubah–hapus dasar,
di sini Anda juga akan lihat cara menghapus banyak lokasi sekaligus.

## Use case: kenapa geofence penting

Absensi Senti HR bukan sekadar "pencet tombol clock-in". Setiap clock-in memvalidasi
posisi GPS karyawan terhadap **titik pusat** dan **radius** worksite tempat ia
ditugaskan. Bila ia berada di luar radius, kejadian ditandai `outside_geofence` dan
masuk antrian [Tinjauan Absensi](/hr/kehadiran/tinjauan-absensi) untuk diputuskan
supervisor — bukan langsung ditolak. Karena itu Admin HR perlu mendaftarkan setiap
lokasi kerja (kantor pusat, cabang, gudang, pabrik) dengan koordinat dan radius yang
realistis. Radius yang terlalu sempit membuat karyawan sah ikut ke antrian tinjauan;
terlalu lebar membuat geofence kehilangan gunanya. Nilai umum yang seimbang dengan
akurasi GPS ponsel adalah **50–150 meter**.

![Daftar Lokasi & Geofence dengan kolom dan kontrol list](/img/hr/geo-01-list.png)

### Elemen di daftar

- **Filter Status** — *Semua* / *Aktif* / *Nonaktif*.
- **Kotak pencarian** (`/`) menyaring berdasarkan **kode** atau **nama**.
- Tombol **⟳ refresh** dan **+ Tambah** (`N`).
- **Checkbox** di kolom paling kiri: satu per baris, plus **select-all** di kepala
  kolom, untuk memilih beberapa lokasi sekaligus.
- **Penghitung** *Worksite · N baris* di kanan.

| Kolom | Isi |
| --- | --- |
| **Kode** | Kode singkat lokasi (mis. `HQ`, `BJ01`). |
| **Nama Lokasi** | Nama lengkap (mis. *Head Office*, *Branch Jakarta*). |
| **Koordinat** | Titik pusat geofence (lintang, bujur). |
| **Radius** | Toleransi geofence dalam meter (mis. `100 m`, `1000 m`). |
| **Status** | Lencana **Aktif** / **Nonaktif**. |
| *(aksi)* | Menu **⋮ (kebab)** di ujung kanan — juga muncul lewat **klik-kanan** baris. |

:::caution Kolom Koordinat menampilkan `NaN, NaN`
Pada data saat ini, kolom **Koordinat** menampilkan `NaN, NaN` di semua baris —
termasuk lokasi yang baru dibuat dengan lintang/bujur yang valid. Ini adalah
**masalah tampilan pada jalur baca** (nilai koordinat tidak ter-parse saat
dirender), *bukan* berarti Anda salah mengisi. Nilai radius dan status tetap benar.
Perbaikan tampilan koordinat sedang ditindaklanjuti; sementara itu gunakan Kode/Nama
untuk mengenali lokasi.
:::

---

## Menambah lokasi

### Langkah 1 — Buka dialog

Tekan **+ Tambah** (atau `N`). Dialog **"Tambah Worksite"** terbuka. Semua kolom
teks kosong (dengan *placeholder* contoh seperti `HQ`, `Head Office`, `-6.2`,
`106.8166`), **Radius (m)** sudah terisi default `100`, dan **Aktif** sudah
tercentang.

![Dialog Tambah Worksite kosong](/img/hr/geo-02-add-empty.png)

### Langkah 2 — Peringatan validasi

Menekan **Simpan** tanpa data yang benar memunculkan toast:

> ⚠️ **Kode, nama, dan koordinat wajib diisi dengan benar.**

![Toast validasi worksite](/img/hr/geo-03-validation-warning.png)

Peringatan ini muncul bila **Kode** atau **Nama** kosong, **atau** bila **Latitude**
/ **Longitude** bukan angka yang valid (mis. dikosongkan atau berisi huruf). Berbeda
dari layar lain, di sini koordinat **wajib** dan harus berupa angka — karena tanpa
titik pusat, geofence tidak bisa dihitung.

### Langkah 3 — Isi form

| Kolom | Yang diisi | Catatan |
| --- | --- | --- |
| **Kode** | `WS01` | Wajib, singkat. |
| **Nama** | `Gudang Contoh` | Wajib. |
| **Latitude** | `-6.2000` | Wajib, angka desimal. |
| **Longitude** | `106.8166` | Wajib, angka desimal. |
| **Radius (m)** | `150` | Default `100`; sesuaikan 50–150 m. |
| **Aktif** | ✔ (default) | Hilangkan centang untuk menyimpan tapi menonaktifkan. |

![Dialog Tambah Worksite terisi](/img/hr/geo-04-add-filled.png)

### Langkah 4 — Simpan

Tekan **Simpan**. Bila berhasil: dialog tertutup, baris baru muncul, dan toast:

> ✅ **Worksite dibuat.**

![Baris worksite baru dengan toast "Worksite dibuat."](/img/hr/geo-05-add-success.png)

---

## Mengubah lokasi

Aksi ubah **tidak** memakai ikon pensil terpisah, melainkan **menu kebab ⋮** di
ujung baris (atau **klik-kanan** di mana saja pada baris). Menu menampilkan dua
pilihan: **Edit** dan **Hapus** (merah).

![Menu kebab dengan pilihan Edit dan Hapus](/img/hr/geo-06-kebab-menu.png)

Pilih **Edit** → dialog **"Edit Worksite"** terbuka dengan seluruh kolom terisi
nilai lama. Ubah yang perlu (mis. memperlebar radius, mengoreksi koordinat, atau
menonaktifkan lokasi dengan menghapus centang **Aktif**) lalu **Simpan**.

![Dialog Edit Worksite ter-prefill](/img/hr/geo-07-edit-dialog.png)

Validasinya sama seperti menambah, dan toast sukses berbunyi:

> ✅ **Worksite diperbarui.**

:::tip Membuka Edit lebih cepat
Selain lewat kebab, menekan **Enter** pada baris yang sedang di-fokus keyboard
(navigasi `J`/`K`) juga membuka dialog Edit lokasi tersebut.
:::

---

## Menghapus lokasi

Ada **dua cara** menghapus, dan **keduanya meminta konfirmasi** lewat kotak dialog
bawaan browser.

### Hapus satu lokasi (via kebab)

Buka menu **⋮** pada baris → **Hapus**. Browser menampilkan konfirmasi yang menyebut
nama lokasi:

> **Hapus worksite "Gudang Contoh"?** — tombol **OK** / **Batal**.

Tekan **OK** untuk menghapus. Toast sukses menyesuaikan jumlah: **1 worksite dihapus.**

### Hapus banyak lokasi sekaligus (bulk)

Centang **checkbox** beberapa baris (atau **select-all** di kepala kolom). Begitu ada
minimal satu baris terpilih, **bulk action bar** muncul di bawah layar dengan teks
*"N baris dipilih"* dan tombol **Hapus** serta **Batal pilihan**.

![Bulk action bar muncul saat baris dipilih](/img/hr/geo-08-bulk-selection.png)

Klik **Hapus** di bulk bar → konfirmasi **"Hapus N worksite?"** → **OK**. Seluruh
lokasi terpilih dihapus dalam satu operasi, pilihan dibersihkan, dan toast tampil:

> ✅ **N worksite dihapus.**

![Toast sukses setelah penghapusan](/img/hr/geo-09-delete-success.png)

:::danger Penghapusan permanen & berdampak ke absensi
Menghapus worksite tidak bisa di-undo. Karena worksite dikaitkan ke karyawan dan
dipakai memvalidasi geofence, menghapusnya bisa membuat clock-in karyawan terkait
kehilangan acuan lokasi. Jika lokasi hanya sedang tidak dipakai, lebih aman
**menonaktifkannya** (hapus centang *Aktif* lewat Edit) daripada menghapus.
:::

---

## Kaitannya dengan modul lain

Setelah worksite ada, kaitkan karyawan ke lokasi lewat tombol **Worksite** di
[Karyawan](/hr/kehadiran/karyawan). Saat karyawan clock-in di luar radius, kejadian
ditandai `outside_geofence` dan masuk [Tinjauan Absensi](/hr/kehadiran/tinjauan-absensi).
Tinjau kejadian *out of range* secara berkala untuk menyetel radius yang pas.

---

## Referensi pesan & peringatan sistem

| Pesan | Jenis | Kapan muncul | Tindakan Anda |
| --- | --- | --- | --- |
| **Kode, nama, dan koordinat wajib diisi dengan benar.** | ⚠️ Peringatan | *Simpan* saat Kode/Nama kosong **atau** Latitude/Longitude bukan angka valid. | Lengkapi kode, nama, dan koordinat numerik. |
| **Hapus worksite "…"?** | ❓ Konfirmasi (dialog browser) | Hapus lewat kebab satu baris. | **OK** hapus / **Batal**. |
| **Hapus N worksite?** | ❓ Konfirmasi (dialog browser) | Hapus lewat bulk bar. | **OK** hapus semua / **Batal**. |
| **Worksite dibuat.** | ✅ Sukses | Lokasi baru tersimpan. | — |
| **Worksite diperbarui.** | ✅ Sukses | Perubahan tersimpan. | — |
| **N worksite dihapus.** | ✅ Sukses | Satu/banyak lokasi terhapus permanen. | — (tak bisa di-undo). |
| **Gagal menyimpan worksite.** | ❌ Galat | Server menolak simpan (mis. kode bentrok, sesi kedaluwarsa). | Perbaiki data / login ulang / coba lagi. |
| **Gagal menghapus.** | ❌ Galat | Server menolak penghapusan (satu atau bulk). | Muat ulang lalu coba lagi. |
| **Belum ada worksite.** | ℹ️ Info (state kosong) | Belum ada lokasi sama sekali. | Tambahkan lokasi pertama. |
| **Tidak ada hasil untuk filter ini.** | ℹ️ Info (state kosong) | Pencarian/filter status menyaring habis semua baris. | Longgarkan pencarian atau ganti filter. |
