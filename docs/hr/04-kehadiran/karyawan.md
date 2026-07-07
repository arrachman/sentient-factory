---
sidebar_position: 7
title: Karyawan
---

# Karyawan

Rute `/app/employees` · grup **Kehadiran** · *live* · kode layar `EMP`.

Daftar **karyawan** yang menjadi subjek absensi, beserta status pendaftaran wajah
dan kaitan worksite.

![Daftar Karyawan](/img/hr/karyawan.png)

## Bagian layar

- **Pencarian** (`/`) dan **refresh**, dengan penghitung *Karyawan · N baris*.

### Kolom tabel

| Kolom | Isi |
| --- | --- |
| **Kode** | Kode karyawan (mis. `EMP-0001`, `EMP-DEMO-001`). |
| **Nama** | Nama lengkap. |
| **Username** | Akun login terkait (mis. `administrator`, `manager`, `staff_hr`). |
| **Wajah** | `enrolled` (sudah daftar) / `not_enrolled` (belum). |

### Aksi per baris

- **Worksite** — buka dialog penugasan worksite: tentukan lokasi/geofence mana
  yang berlaku untuk karyawan tersebut. Penugasan ini yang dipakai validasi
  geofence saat clock-in.

## Alur

1. Telusuri/cari karyawan.
2. Tekan **Worksite** untuk mengaitkan satu/lebih lokasi kerja.
3. Untuk merekam wajah, lanjut ke
   [Pendaftaran Wajah](/hr/kehadiran/pendaftaran-wajah); untuk peran akses, ke
   [Akses & Peran](/hr/kehadiran/akses-peran).

:::note Sumber data karyawan
Karyawan berasal dari pengguna platform; layar ini berfokus pada atribut yang
relevan untuk kehadiran (kode, wajah, worksite), bukan manajemen akun penuh.
:::
