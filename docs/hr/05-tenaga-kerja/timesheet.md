---
sidebar_position: 1
title: Timesheet
---

# Timesheet

Rute `/app/timesheets` · grup **Manajemen Tenaga Kerja** · *live* · kode layar
`TMS`.

Rekap **jam kerja** per karyawan untuk periode pembayaran (pay-period) — adaptasi
*jibble Timesheets*. Datanya **diturunkan** dari sesi absensi (tidak diinput
manual) dan menerapkan kebijakan lembur/libur.

![Timesheet](/img/hr/timesheet.png)

## Bagian layar

- **Filter rentang tanggal** — *dari* `s/d` *sampai* (default bulan berjalan).
- **Pencarian** (`/`) dan **refresh**.
- **Penghitung** *Karyawan · N baris*.

### Kolom (saat ada data)

Rekap per karyawan mencakup hari hadir, total jam kerja, jam lembur, dan jam di
hari libur — dihitung dari kebijakan di
[Aturan Lembur](/hr/laporan-lainnya/aturan-lembur) dan
[Kalender Libur](/hr/tenaga-kerja/kalender-libur):

- `overtimeMinutes` = jam di atas **jam reguler/hari**, atau **seluruh** jam di
  hari libur bila opsi *Hari libur = lembur* aktif.
- `holidayDays` / `holidayMinutes` = kehadiran yang jatuh pada hari libur.

## Alur

1. Pilih periode (rentang tanggal).
2. Tinjau rekap jam per karyawan.
3. Lanjut ke [Laporan](/hr/laporan-lainnya/laporan) untuk export ke CSV/XLSX bila
   perlu dikirim ke payroll.

:::note Kosong itu normal
*“Tidak ada data timesheet untuk filter ini.”* muncul bila belum ada sesi absensi
tertutup pada periode terpilih.
:::
