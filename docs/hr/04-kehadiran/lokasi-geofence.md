---
sidebar_position: 5
title: Lokasi & Geofence
---

# Lokasi & Geofence

Rute `/app/worksites` · grup **Kehadiran** · *live* · kode layar `GEO` ·
**privileged**.

Master **worksite** (lokasi kerja) beserta **radius geofence** yang dipakai untuk
memvalidasi absensi berbasis GPS — adaptasi *jibble Geofencing*.

![Lokasi & Geofence](/img/hr/lokasi-geofence.png)

## Bagian layar

- **Filter status** — *Semua* / Aktif / nonaktif.
- **Pencarian** (`/`), **refresh**, dan tombol **+ Tambah** (lokasi baru).
- **Checkbox** per baris + *select-all* untuk aksi massal (mis. hapus banyak
  sekaligus lewat bulk bar).

### Kolom tabel

| Kolom | Isi |
| --- | --- |
| **Kode** | Kode singkat lokasi (mis. `HQ`, `BJ01`). |
| **Nama Lokasi** | Nama lengkap (mis. *Head Office*, *Branch Jakarta*). |
| **Koordinat** | Titik pusat geofence (lintang, bujur). |
| **Radius** | Toleransi geofence dalam meter (mis. 100 m, 1000 m). |
| **Status** | Aktif / nonaktif. |

Menu **⋮ (kebab)** / klik-kanan tiap baris menyediakan aksi **Edit** dan **Hapus**.

## Alur konfigurasi

1. Tekan **+ Tambah**, isi **kode**, **nama**, **koordinat** pusat, dan **radius**
   geofence (meter).
2. Tetapkan status **Aktif** agar dipakai validasi.
3. Kaitkan karyawan ke worksite lewat tombol **Worksite** di
   [Karyawan](/hr/kehadiran/karyawan).
4. Saat karyawan clock-in di luar radius, kejadian ditandai `outside_geofence` dan
   masuk [Tinjauan Absensi](/hr/kehadiran/tinjauan-absensi).

## Praktik baik

- Sesuaikan radius dengan akurasi GPS perangkat (umumnya **50–150 m**).
- Tinjau kejadian *out of range* secara berkala untuk menyetel radius.

:::caution Koordinat kosong
Jika kolom **Koordinat** menampilkan `NaN, NaN`, titik pusat lokasi belum terisi
benar. Edit lokasi dan isi lintang/bujur yang valid agar geofence berfungsi.
:::
