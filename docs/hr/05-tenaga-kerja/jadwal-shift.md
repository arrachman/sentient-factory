---
sidebar_position: 2
title: Jadwal & Shift
---

# Jadwal & Shift

Rute `/app/schedules` · grup **Manajemen Tenaga Kerja** · *live* · **privileged**.

Mengelola **pola shift** dan **jadwal kerja** karyawan — adaptasi *jibble Work
Schedules*.

![Jadwal & Shift](/img/hr/jadwal-shift.png)

## Bagian layar

Layar memiliki dua tab:

### Tab **Master Shift**

Daftar definisi shift. Tombol **+ Tambah Shift** membuat shift baru.

| Kolom | Isi |
| --- | --- |
| **Kode** | Kode shift (mis. `PAGI`, `SIANG`, `MALAM`). |
| **Nama** | Nama shift (mis. *Shift Pagi*). |
| **Jam** | Jam mulai–selesai + durasi istirahat (mis. `08:00–16:00 · 60m istirahat`). |
| **Status** | Aktif / nonaktif. |

Ikon **edit**/**hapus** per baris.

### Tab **Jadwal Kerja**

Penugasan shift ke karyawan (siapa kerja shift mana, kapan) lewat dialog
penetapan shift.

## Alur

1. Pada **Master Shift**, definisikan shift (jam kerja + istirahat).
2. Pindah ke **Jadwal Kerja**, tetapkan shift ke karyawan/tim.
3. Durasi istirahat default per shift selaras dengan
   [Aturan Lembur & Istirahat](/hr/laporan-lainnya/aturan-lembur).
