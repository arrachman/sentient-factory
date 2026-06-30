---
sidebar_position: 4
title: Tinjauan Absensi
---

# Tinjauan Absensi

Rute `/app/attendance-reviews` · grup **Kehadiran** · *live* · kode layar `REV` ·
**privileged** (supervisor/manager/admin).

Antrian **persetujuan** untuk kejadian absensi yang gagal verifikasi otomatis
(wajah, liveness, atau geofence) — adaptasi *jibble Approvals* dan inti anti
*buddy-punch*.

![Tinjauan Absensi](/img/hr/tinjauan-absensi.png)

## Bagian layar

- **Filter status** — *Pending* / disetujui / ditolak, dll.
- **Penghitung** — mis. *Tinjauan · 9 baris*.
- **Tombol refresh**.

### Kolom tabel

| Kolom | Isi |
| --- | --- |
| **Karyawan** | Pihak yang mengajukan kejadian. |
| **Waktu** | Timestamp kejadian. |
| **Alasan** | Penyebab masuk antrian: `camera_denied`, `outside_geofence`, `face_not_detected`, `liveness_not_verified`. |
| **Status** | `pending` hingga diputuskan. |

### Aksi per baris

| Tombol | Aksi |
| --- | --- |
| **Detail** | Buka halaman detail kejadian (selfie, lokasi, metadata) — rute `/app/attendance-reviews/[eventId]`. |
| **⊘ Klarifikasi** | Minta klarifikasi ke karyawan sebelum memutuskan. |
| **✕ Tolak** | Tolak kejadian. |
| **✓ Setujui** | Setujui kejadian sehingga dihitung sah. |

Selain itu kejadian yang sudah diputus dapat **di-reopen** (dibuka kembali) dari
halaman detail.

## Alur peninjauan

1. Buka **Tinjauan Absensi** (default filter *Pending*).
2. Klik **Detail** untuk memeriksa bukti (selfie, koordinat, alasan).
3. Putuskan: **Setujui**, **Tolak**, atau minta **Klarifikasi**.
4. Keputusan memperbarui status kejadian dan ikut memengaruhi rekap di
   [Laporan](/hr/laporan-lainnya/laporan) serta KPI *Tinjauan Pending* di
   [Dashboard](/hr/kehadiran/dashboard).

:::tip Setel ambang otomatis
Berapa ketat verifikasi otomatis (ambang skor wajah, auto-submit) diatur di
[Pengaturan](/hr/laporan-lainnya/pengaturan). Ambang lebih ketat = lebih banyak
kejadian masuk antrian tinjauan.
:::
