---
sidebar_position: 2
title: Jadwal & Shift (Tambah · Ubah · Hapus)
---

# Jadwal & Shift

Rute `/app/schedules` · grup **Manajemen Tenaga Kerja** · *live* · **privileged**.

Layar ini mengelola **pola shift** (definisi jam kerja) dan **jadwal kerja**
(penugasan shift ke karyawan) — adaptasi *jibble Work Schedules*. Halaman ini juga
menjadi **contoh baku alur CRUD** di Senti HR: tombol tambah di kanan atas, dialog
form di tengah layar, dan ikon **ubah**/**hapus** per baris. Pola yang sama
(dialog + toast konfirmasi) berlaku di hampir semua layar master HR — Lokasi,
Karyawan, Kalender Libur, Proyek — jadi setelah paham alur di sini, layar lain
akan terasa familiar.

:::note Siapa yang bisa membuka layar ini
Jadwal & Shift bersifat **privileged**. Anda harus login sebagai pengguna dengan
peran `HR_ADMIN`/`HR_MANAGER`, atau peran platform `admin`/`manager`. Karyawan
biasa (`HR_EMPLOYEE`) tidak melihat menu ini di sidebar; jika mereka membuka URL
`/app/schedules` langsung, backend menolak permintaan data dan layar menampilkan
tombol **Masuk**/galat akses, bukan tabel shift.
:::

## Use case: kenapa shift dikelola di sini

Bayangkan sebuah pabrik yang beroperasi 24 jam dengan tiga giliran kerja. Sebelum
seorang karyawan bisa di-*clock-in* dan jam kerjanya dihitung benar oleh timesheet,
sistem perlu tahu **bentuk hari kerjanya**: jam berapa mulai, jam berapa selesai,
dan berapa menit istirahat yang dipotong. Itulah yang Anda definisikan di tab
**Master Shift**. Misalnya pabrik membuat tiga pola: *Shift Pagi* (08:00–16:00),
*Shift Siang* (14:00–22:00), dan *Shift Malam* (22:00–06:00), masing-masing dengan
60 menit istirahat.

Setelah pola shift ada, supervisor berpindah ke tab **Jadwal Kerja** untuk
**menetapkan** siapa bekerja shift mana pada tanggal mana. Pemisahan ini disengaja:
pola shift jarang berubah (Anda mendefinisikannya sekali), sedangkan penugasan
berubah setiap minggu mengikuti rotasi tim. Durasi istirahat yang Anda isi di sini
juga menjadi acuan perhitungan jam reguler vs lembur — lihat
[Aturan Lembur & Istirahat](/hr/laporan-lainnya/aturan-lembur).

![Daftar Master Shift dengan tiga pola shift aktif](/img/hr/crud-01-list-shifts.png)

Tab **Master Shift** menampilkan setiap definisi shift sebagai satu baris dengan
empat kolom informasi plus dua tombol aksi:

| Kolom | Isi | Contoh |
| --- | --- | --- |
| **Kode** | Pengenal singkat shift, ditulis tebal. Dipakai sebagai referensi cepat. | `PAGI`, `SIANG`, `MALAM` |
| **Nama** | Nama manusiawi shift. | *Shift Pagi* |
| **Jam** | Jam mulai–selesai diikuti durasi istirahat (teks abu-abu). | `08:00–16:00 · 60m istirahat` |
| **Status** | Lencana hijau **Aktif** atau abu-abu **Nonaktif**. | ● Aktif |
| *(aksi)* | Ikon **pensil** (ubah) dan **tong sampah** (hapus) di ujung kanan baris. | ✏️ 🗑️ |

---

## Menambah shift baru

### Langkah 1 — Buka dialog tambah

Klik tombol **+ Tambah Shift** di pojok kanan atas. Sebuah dialog berjudul
**"Tambah Shift"** muncul di tengah layar dengan latar di-redup-kan. Semua kolom
tampil dalam keadaan awal: **Kode** dan **Nama** kosong (hanya menampilkan teks
contoh `PAGI` / `Shift Pagi` sebagai *placeholder*), sedangkan **Mulai**,
**Selesai**, dan **Istirahat (mnt)** sudah terisi nilai default `08:00`, `16:00`,
dan `60`.

![Dialog Tambah Shift dalam keadaan kosong](/img/hr/crud-02-add-modal-empty.png)

:::tip Nilai default itu disengaja
Tiga kolom waktu tidak pernah benar-benar kosong — kalaupun Anda tidak menyentuhnya,
sistem memakai `08:00–16:00` dengan istirahat 60 menit. Artinya satu-satunya hal
yang **wajib** Anda isi adalah **Kode** dan **Nama**. Inilah yang divalidasi pada
langkah berikut.
:::

### Langkah 2 — Peringatan validasi bila Kode/Nama kosong

Jika Anda menekan **Simpan** tanpa mengisi **Kode** atau **Nama**, form **tidak**
dikirim ke server. Sebagai gantinya muncul **toast peringatan** di pojok kanan bawah
dengan ikon dan teks:

> ⚠️ **Kode dan nama shift wajib diisi.**

![Toast peringatan validasi saat Kode dan Nama belum diisi](/img/hr/crud-03-add-validation-warning.png)

Ini adalah validasi **sisi klien** — terjadi seketika di browser, tanpa
memanggil backend, sehingga tidak ada data setengah jadi yang tercipta. Dialog
tetap terbuka dengan isian Anda utuh; cukup lengkapi kolom yang kurang lalu tekan
Simpan lagi. Toast menghilang otomatis setelah beberapa detik dan tidak memerlukan
tindakan apa pun untuk menutupnya.

### Langkah 3 — Isi seluruh kolom

Lengkapi form. Sebagai contoh kita buat *Shift Sore* yang masuk 14:00 dan pulang
22:00 dengan istirahat 45 menit:

| Kolom | Yang diisi | Catatan |
| --- | --- | --- |
| **Kode** | `SORE` | Bebas, sebaiknya singkat & huruf besar agar konsisten. |
| **Nama** | `Shift Sore` | Nama yang dikenali tim. |
| **Mulai** | `14:00` | Pemilih waktu (jam:menit). |
| **Selesai** | `22:00` | Boleh melewati tengah malam untuk shift malam (mis. `22:00`→`06:00`). |
| **Istirahat (mnt)** | `45` | Angka menit; minimal `0`, tidak boleh negatif. |

![Dialog Tambah Shift setelah seluruh kolom diisi](/img/hr/crud-04-add-filled.png)

### Langkah 4 — Simpan dan konfirmasi sukses

Tekan **Simpan**. Form dikirim ke backend; bila berhasil, terjadi tiga hal
sekaligus: dialog tertutup, daftar shift di-*refresh* otomatis sehingga baris baru
**SORE / Shift Sore** langsung muncul, dan toast hijau konfirmasi tampil di pojok
kanan bawah:

> ✅ **Shift dibuat.**

![Shift baru muncul di daftar dengan toast sukses "Shift dibuat."](/img/hr/crud-05-add-success.png)

Shift baru otomatis berstatus **Aktif**. Tombol **Batal** (atau ikon **✕** di
sudut dialog) menutup form tanpa menyimpan apa pun — aman dipakai kapan saja jika
Anda berubah pikiran.

---

## Mengubah shift

Untuk menyunting shift yang sudah ada, klik ikon **pensil** (✏️) di baris yang
bersangkutan. Dialog yang sama terbuka, kali ini berjudul **"Ubah Shift"** dan
**seluruh kolom sudah terisi** nilai shift tersebut — bukan kosong seperti saat
menambah.

![Dialog Ubah Shift dengan kolom yang sudah terisi nilai lama](/img/hr/crud-06-edit-dialog.png)

Aturan validasinya identik dengan menambah: **Kode** dan **Nama** tetap wajib, jadi
jika Anda mengosongkan salah satunya lalu menekan Simpan, peringatan
**"Kode dan nama shift wajib diisi."** yang sama akan muncul. Ubah kolom yang
perlu — misalnya memperpanjang istirahat dari 45 ke 60 menit, atau mengoreksi nama
— lalu tekan **Simpan**. Toast konfirmasi yang muncul berbeda dari saat menambah:

> ✅ **Shift diperbarui.**

![Toast sukses "Shift diperbarui." setelah menyimpan perubahan](/img/hr/crud-07-edit-success.png)

Seperti pada penambahan, dialog tertutup dan daftar otomatis menampilkan nilai
terbaru. Use case umum: pabrik mengubah jam operasional sementara (mis. jam Ramadan),
atau HR mengoreksi durasi istirahat agar selaras dengan kebijakan lembur yang baru.

---

## Menghapus shift

Klik ikon **tong sampah** (🗑️) merah di baris yang ingin dihapus.

:::danger Penghapusan langsung — TIDAK ada dialog konfirmasi
Berbeda dengan banyak aplikasi, menekan tombol hapus **langsung menghapus shift
saat itu juga** — tidak ada kotak dialog "Yakin ingin menghapus?". Begitu diklik,
tombol sesaat dinonaktifkan (mencegah klik ganda), permintaan terkirim ke server,
lalu baris hilang dari daftar. **Pastikan Anda mengklik baris yang benar.** Jika
shift masih dipakai pada penugasan di tab *Jadwal Kerja*, pertimbangkan dampaknya
sebelum menghapus.
:::

Bila berhasil, baris hilang dari tabel dan toast konfirmasi tampil:

> ✅ **Shift dihapus.**

![Daftar kembali ke tiga shift dengan toast "Shift dihapus."](/img/hr/crud-08-delete-success.png)

Pada contoh di atas, *Shift Sore* yang tadi kita buat dan ubah sudah lenyap, dan
daftar kembali ke tiga shift semula. Karena tidak ada konfirmasi, satu-satunya
"jaring pengaman" adalah membuat ulang shift via **+ Tambah Shift** jika ternyata
terhapus tak sengaja — data shift yang sudah dihapus tidak bisa di-*undo*.

---

## Tab Jadwal Kerja

Tab kedua, **Jadwal Kerja**, menampilkan penugasan shift ke karyawan: kolom
**Tanggal**, **Karyawan**, dan **Shift** (nama shift + jam). Tombol kanan atas
berubah menjadi **+ Assign Shift**, yang membuka dialog penetapan: pilih karyawan,
tanggal, dan shift yang sudah Anda definisikan di Master Shift. Setiap baris
penugasan punya ikon **hapus** sendiri dengan perilaku yang sama persis seperti di
atas — penghapusan langsung tanpa konfirmasi, lalu toast **"Jadwal dihapus."**

Alurnya berurutan dan saling bergantung:

1. Di **Master Shift**, definisikan pola shift (jam kerja + istirahat). *Ini harus
   ada lebih dulu* — Anda tidak bisa menugaskan shift yang belum dibuat.
2. Pindah ke **Jadwal Kerja**, klik **+ Assign Shift**, dan tetapkan shift ke
   karyawan/tim untuk tanggal tertentu.
3. Hasil penugasan inilah yang dibaca modul **Timesheet** dan **Laporan** untuk
   menghitung jam kerja, serta dipakai **Aturan Lembur** untuk memisahkan jam
   reguler dari lembur.

---

## Referensi pesan & peringatan sistem

Semua umpan balik layar ini muncul sebagai **toast** di pojok kanan bawah dan
menghilang otomatis. Berikut daftar lengkapnya beserta penyebabnya:

| Pesan | Jenis | Kapan muncul | Tindakan Anda |
| --- | --- | --- | --- |
| **Kode dan nama shift wajib diisi.** | ⚠️ Peringatan | Menekan *Simpan* di dialog Tambah/Ubah saat kolom Kode atau Nama kosong. Form tidak dikirim ke server. | Isi Kode dan Nama, lalu Simpan lagi. |
| **Shift dibuat.** | ✅ Sukses | Shift baru berhasil disimpan. Dialog menutup, daftar refresh. | — (informasional). |
| **Shift diperbarui.** | ✅ Sukses | Perubahan shift berhasil disimpan. | — (informasional). |
| **Shift dihapus.** | ✅ Sukses | Shift berhasil dihapus permanen. | — (informasional, tak bisa di-undo). |
| **Gagal menyimpan shift.** | ❌ Galat | Server menolak penyimpanan (mis. koneksi putus, sesi kedaluwarsa, atau pesan galat spesifik dari backend ditampilkan apa adanya). | Coba lagi; bila berulang, periksa koneksi/sesi atau hubungi admin. |
| **Gagal menghapus shift.** | ❌ Galat | Server menolak penghapusan. | Muat ulang halaman dan coba lagi. |
| **Jadwal dihapus.** | ✅ Sukses | Penugasan di tab *Jadwal Kerja* berhasil dihapus. | — (informasional). |
| **Gagal menghapus jadwal.** | ❌ Galat | Server menolak penghapusan penugasan. | Coba lagi atau periksa sesi. |

:::note Sesi kedaluwarsa
Pesan **Gagal…** sering kali berarti sesi login Anda sudah habis (cookie
`sf_token` kedaluwarsa). Jika itu terjadi, layar akan mengarahkan Anda ke halaman
**Masuk**; login ulang lalu ulangi tindakan. Lihat
[Login & Navigasi](/hr/memulai/login-dan-navigasi).
:::
