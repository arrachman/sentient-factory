---
sidebar_position: 1
title: Login & Navigasi
---

# Login & Navigasi

## Login

Senti HR memakai **sesi platform Sentient** (cookie `sf_token`). Aplikasi tidak
memiliki backend autentikasi sendiri — ia hanya menukar kredensial platform Anda
menjadi cookie pada origin HR.

![Halaman login Senti HR](/img/hr/login.png)

Halaman login bergaya **split-screen**:

- **Panel kiri (brand)** — identitas Senti HR (teal) dengan ringkasan nilai jual:
  *“Kehadiran tim, terverifikasi real-time”* dan tiga statistik (10 modul aktif,
  absensi 24/7, GPS + Wajah).
- **Panel kanan (form)** — kolom **Email** dan **Password**, opsi **Ingat saya**
  (memperpanjang sesi 7 hari), tautan **Lupa password?**, dan tombol **Masuk**.
- **Mode demo** — di lingkungan dev tersedia akun seed `admin@example.com` /
  `Password123!`; tombol **isi otomatis** mengisi password.

### Alur masuk

1. Masukkan email & password lalu tekan **Masuk**.
2. Aplikasi mengirim `POST /api/auth/login` (by email) ke gateway; bila berhasil,
   JWT disimpan sebagai cookie `sf_token`.
3. Anda diarahkan ke halaman yang diminta (`returnTo`), default **Dashboard**.

:::note Penjaga rute
Membuka `/app/*` tanpa cookie sesi otomatis dialihkan ke `/login?returnTo=<halaman>`.
Bila cookie ada tapi token kedaluwarsa, layar menampilkan tombol **Masuk** untuk
masuk ulang.
:::

### Logout

Klik nama Anda di kanan atas **topbar** lalu **keluar**. Sesi dihapus di sisi
klien (cookie `sf_token` dibuang) dan aplikasi memuat ulang ke halaman login.

## Struktur layar (shell)

Setelah masuk, seluruh modul tampil dalam satu **shell multi-tab** bergaya
browser. Empat bagian utama:

![Dashboard dengan shell multi-tab](/img/hr/dashboard.png)

| Bagian | Letak | Fungsi |
| --- | --- | --- |
| **Icon-rail** | Strip vertikal paling kiri | Ikon per **grup** modul; arahkan kursor untuk membuka *flyout* daftar modul. |
| **Topbar** | Atas | Logo **Senti HR**, **breadcrumb** (mis. *Time & Attendance / Dashboard*), tombol tema terang/gelap, dan menu pengguna. |
| **Tab strip** | Bawah topbar | Tiap modul yang dibuka menjadi sebuah **tab** seperti browser — bisa ditutup, ditutup-lainnya, di-reload, dan diurut ulang (drag). |
| **Area konten** | Tengah | Halaman modul aktif. |

### Tiga grup navigasi

Sidebar memetakan modul ke tiga grup (lihat [peta modul](/hr/#peta-modul)):

1. **Kehadiran** — operasional absensi harian + data master kehadiran.
2. **Manajemen Tenaga Kerja** — timesheet, jadwal, cuti, libur, proyek.
3. **Laporan & Lainnya** — laporan/export, kiosk, kebijakan, pengaturan.

:::tip Menu dinamis vs statis
Daftar modul di sidebar di-*filter* sesuai peran Anda (menu dinamis dari backend).
Bila API menu kosong, shell jatuh ke daftar statis bawaan sehingga navigasi tetap
berfungsi.
:::

## Pintasan keyboard

Layar berbentuk daftar (tabel) mendukung navigasi cepat tanpa mouse:

| Tombol | Aksi |
| --- | --- |
| `/` | Fokus ke kolom **cari** |
| `N` | **Tambah** data baru (bila tersedia) |
| `J` / `K` | Pindah fokus baris ke bawah / atas |
| `←` / `→` | Halaman sebelumnya / berikutnya |
| `Enter` | Buka baris yang difokus |
| `X` | Tandai/centang baris yang difokus |
