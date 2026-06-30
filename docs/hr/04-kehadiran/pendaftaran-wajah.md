---
sidebar_position: 6
title: Pendaftaran Wajah
---

# Pendaftaran Wajah

Rute `/app/face-enrollments` · grup **Kehadiran** · *live*.

Mengelola & merekam **template wajah** karyawan untuk verifikasi anti
*buddy-punch* saat clock-in — adaptasi *jibble Face Recognition*.

![Pendaftaran Wajah](/img/hr/pendaftaran-wajah.png)

## Bagian layar

Tabel berisi seluruh karyawan dengan status pendaftaran wajahnya.

| Kolom | Isi |
| --- | --- |
| **Wajah** | Thumbnail template (bila sudah ada). |
| **Kode** | Kode karyawan (mis. `EMP-DEMO-001`). |
| **Nama** | Nama karyawan. |
| **Status** | **Terdaftar** (hijau) atau **Belum**. |

### Aksi per baris

- **Daftarkan** — buka dialog perekaman wajah untuk karyawan yang **Belum**
  terdaftar.
- **Daftar ulang** — rekam ulang template untuk karyawan yang sudah **Terdaftar**
  (mis. saat wajah berubah / kualitas rendah).

## Alur pendaftaran

1. Cari karyawan, tekan **Daftarkan**.
2. Pada dialog, arahkan wajah ke kamera mengikuti panduan bingkai.
3. Sistem merekam template; status berubah menjadi **Terdaftar** dan thumbnail
   muncul.
4. Karyawan kini dapat diverifikasi otomatis saat clock-in di
   [Absensi Saya](/hr/kehadiran/absensi-saya).

:::tip Hubungan dengan tinjauan
Karyawan yang **belum** terdaftar wajahnya akan sering memicu kejadian
`face_not_detected` di [Tinjauan Absensi](/hr/kehadiran/tinjauan-absensi).
Daftarkan wajah lebih dulu untuk menekan antrian tinjauan.
:::
