---
sidebar_position: 1
title: Dashboard
---

# Dashboard Kehadiran

Rute `/app/dashboard` · grup **Kehadiran** · *live*.

Halaman pertama setelah login. Memberi **ringkasan real-time** kehadiran,
identitas terverifikasi, dan antrian yang menunggu tindakan.

![Dashboard Kehadiran](/img/hr/dashboard.png)

## Kartu ringkasan (KPI)

| Kartu | Arti |
| --- | --- |
| **Total Karyawan** | Jumlah karyawan terdaftar di organisasi. |
| **Hadir Hari Ini** | Karyawan yang sudah clock-in hari ini. |
| **Wajah Terdaftar** | Karyawan yang template wajahnya sudah direkam (siap verifikasi). |
| **Lokasi Aktif** | Jumlah worksite/geofence berstatus aktif. |
| **Tinjauan Pending** | Kejadian absensi yang menunggu persetujuan supervisor. |

Setiap kartu adalah pintu masuk cepat ke modul terkait: *Hadir Hari Ini* dan
*Tinjauan Pending* mengarah ke [Tinjauan Absensi](/hr/kehadiran/tinjauan-absensi),
*Wajah Terdaftar* ke [Pendaftaran Wajah](/hr/kehadiran/pendaftaran-wajah), dan
*Lokasi Aktif* ke [Lokasi & Geofence](/hr/kehadiran/lokasi-geofence).

:::note Nilai kosong
Jika sebuah kartu menampilkan tanda “—”, artinya data belum tersedia untuk
periode/akun tersebut (mis. belum ada absensi hari ini).
:::
