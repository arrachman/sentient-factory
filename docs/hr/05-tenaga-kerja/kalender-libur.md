---
sidebar_position: 4
title: Kalender Libur
---

# Kalender Libur

Rute `/app/holidays` · grup **Manajemen Tenaga Kerja** · *live* · kode layar `HOL`
· CRUD **privileged** (daftar publik).

Daftar **hari libur** (nasional/regional) yang dipakai perhitungan lembur dan
rekap timesheet.

![Kalender Libur](/img/hr/kalender-libur.png)

## Bagian layar

- **Filter Tahun** + **Reset filter**.
- **Pencarian** (`/`), **refresh**, tombol **+ Tambah Hari Libur**.
- **Penghitung** *Hari libur · N baris*.

### Kolom tabel

| Kolom | Isi |
| --- | --- |
| **Tanggal** | Tanggal libur. |
| **Hari** | Nama hari. |
| **Nama** | Nama libur (mis. *Hari Kemerdekaan RI*). |
| **Wilayah** | Cakupan (mis. *Nasional*). |
| **Sifat** | `Berulang` (tahunan) · aktif/nonaktif. |

Ikon **edit**/**hapus** per baris.

## Alur

1. Pilih tahun, tekan **+ Tambah Hari Libur**.
2. Isi tanggal, nama, wilayah, dan tandai **Berulang** bila libur tahunan tetap.
3. Hari libur aktif dipakai oleh kebijakan *Hari libur = lembur* di
   [Aturan Lembur](/hr/laporan-lainnya/aturan-lembur) dan diperhitungkan dalam
   [Timesheet](/hr/tenaga-kerja/timesheet) (`holidayDays`/`holidayMinutes`).
