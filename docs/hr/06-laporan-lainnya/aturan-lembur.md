---
sidebar_position: 3
title: Aturan Lembur & Istirahat
---

# Aturan Lembur & Istirahat

Rute `/app/overtime` · grup **Laporan & Lainnya** · *live* · **privileged**.

Kebijakan perhitungan **lembur**, **break**, dan **hari libur** (adaptasi *jibble
Overtime Tracker*). Nilai di sini dipakai oleh
[Timesheet](/hr/tenaga-kerja/timesheet) dan
[Laporan](/hr/laporan-lainnya/laporan).

![Aturan Lembur & Istirahat](/img/hr/aturan-lembur.png)

## Bagian — Ambang & pengali

| Field | Arti | Contoh |
| --- | --- | --- |
| **Jam reguler / hari** | Jam kerja sebelum dihitung lembur. | `8` |
| **Jam reguler / minggu** | Batas mingguan sebelum lembur. | `40` |
| **Pengali lembur** | Faktor upah jam lembur. | `1.5` (1,5×) |
| **Istirahat (menit)** | Durasi istirahat default per shift. | `60` |

## Bagian — Kebijakan

| Saklar | Efek |
| --- | --- |
| **Hitung lembur** | Mengaktifkan perhitungan jam lembur. |
| **Istirahat dibayar** | Waktu istirahat dihitung sebagai jam kerja terbayar. |
| **Hari libur = lembur** | Kerja di hari libur (kalender) dihitung lembur penuh. |

Tombol **Simpan** menyimpan kebijakan (disimpan di pengaturan, tanpa tabel baru).

## Alur

1. Setel ambang (jam reguler harian/mingguan) dan **pengali** lembur.
2. Aktifkan saklar kebijakan sesuai aturan perusahaan.
3. **Simpan** — perhitungan berikutnya di Timesheet & Laporan mengikuti kebijakan
   ini, dipadukan dengan [Kalender Libur](/hr/tenaga-kerja/kalender-libur).
