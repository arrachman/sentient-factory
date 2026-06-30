---
slug: /
sidebar_position: 1
title: Selamat Datang di Senti HR
---

# Senti HR

**Senti HR** adalah platform *Time & Attendance / Workforce Management* — adaptasi
[jibble.io](https://jibble.io) ke dalam ekosistem **Sentient Factory**. Fokusnya
melakukan **pencatatan waktu kerja dengan sangat baik**: absensi terverifikasi
(wajah + GPS/geofence), jadwal & shift, cuti, proyek, dan laporan jam kerja siap
payroll. Modul payroll/invoicing penuh ditangani lewat integrasi ke **Senti ERP**,
bukan diimplementasikan ulang di sini.

![Halaman login Senti HR](/img/hr/login.png)

## Untuk siapa dokumentasi ini

| Peran | Yang dikerjakan | Mulai dari |
| --- | --- | --- |
| **Karyawan** | Clock-in/out, ajukan cuti, lihat riwayat sendiri | [Absensi Saya](/hr/kehadiran/absensi-saya) |
| **Supervisor / Manager** | Menyetujui kehadiran, cuti, timesheet tim | [Tinjauan Absensi](/hr/kehadiran/tinjauan-absensi) |
| **Admin HR** | Menyiapkan lokasi, shift, kebijakan, peran, wajah | [Lokasi & Geofence](/hr/kehadiran/lokasi-geofence) |

## Peta modul

Aplikasi dikelompokkan menjadi **tiga grup menu** di sidebar — sama persis dengan
struktur dokumentasi ini:

| Grup | Modul |
| --- | --- |
| **Kehadiran** | Dashboard · Absensi Saya · Riwayat Absensi · Tinjauan Absensi · Lokasi & Geofence · Pendaftaran Wajah · Karyawan · Akses & Peran |
| **Manajemen Tenaga Kerja** | Timesheet · Jadwal & Shift · Cuti · Kalender Libur · Proyek & Aktivitas |
| **Laporan & Lainnya** | Laporan · Mode Kiosk · Aturan Lembur · Pengaturan · Tampilan |

## Konsep inti

- **Verifikasi berlapis.** Setiap clock-in dapat memotret **selfie**, mencocokkan
  **wajah** terhadap template terdaftar, dan memvalidasi **lokasi GPS** terhadap
  **geofence** worksite. Kejadian yang gagal salah satu syarat tidak diblokir —
  ia masuk **antrian tinjauan** untuk diputuskan supervisor.
- **Manual-entry first.** Data master (karyawan, lokasi, shift, proyek, hari
  libur) dikelola lewat form di aplikasi; tidak ada ketergantungan integrasi
  eksternal untuk mulai memakai.
- **RBAC additive.** Peran `HR_ADMIN` / `HR_MANAGER` / `HR_EMPLOYEE` hanya
  **menambah** akses (layar privileged seperti tinjauan, kebijakan, peran), tidak
  pernah mengunci akses yang sudah dimiliki dari peran platform.

:::tip Versi dokumen
Dokumentasi ini mendukung beberapa versi rilis. Gunakan pemilih versi di bilah
navigasi untuk membuka dokumentasi versi tertentu.
:::

:::note Status fitur
Seluruh layar yang didokumentasikan di sini berstatus **live** — terhubung ke
backend `/api/hr/*`. Fitur roadmap (SSO/2FA, NFC, offline-sync, lock period)
belum dirilis dan tidak dibahas sebagai layar aktif.
:::
