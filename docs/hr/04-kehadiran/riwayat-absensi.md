---
sidebar_position: 3
title: Riwayat Absensi
---

# Riwayat Absensi

Rute `/app/attendance-history` · grup **Kehadiran** · *live* · kode layar `ATT`.

Daftar **sesi absensi** historis: kapan setiap karyawan clock-in dan clock-out,
beserta statusnya. Karyawan melihat riwayatnya sendiri; supervisor/admin melihat
seluruh tim.

![Riwayat Absensi](/img/hr/riwayat-absensi.png)

## Bagian layar

- **Filter rentang tanggal** — kotak *dari* `mm/dd/yyyy` `s/d` *sampai*
  `mm/dd/yyyy` untuk membatasi periode.
- **Pencarian** (`/`) — cari berdasarkan karyawan.
- **Tombol refresh** — muat ulang data.
- **Penghitung baris** — mis. *Catatan · 2 baris*.

### Kolom tabel

| Kolom | Isi |
| --- | --- |
| **Karyawan** | Nama/kode karyawan. |
| **Tanggal** | Tanggal sesi absensi. |
| **Clock In** | Waktu masuk (timestamp). |
| **Clock Out** | Waktu keluar; kosong (“—”) bila sesi belum ditutup. |
| **Status** | Status sesi (mis. hadir/terbuka). |

Footer menampilkan paginasi (*Halaman 1 dari 1 · N baris*) dan hint pintasan
keyboard (`/` cari · `N` tambah · `J`/`K` baris).

## Alur

1. Pilih rentang tanggal (opsional) — daftar tersaring per periode.
2. Gunakan pencarian untuk menemukan karyawan tertentu.
3. Baris dengan **Clock Out** kosong berarti sesi masih berjalan (karyawan belum
   clock-out).
