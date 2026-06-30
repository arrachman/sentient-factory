---
sidebar_position: 2
title: Absensi Saya
---

# Absensi Saya

Rute `/app/attendance` · grup **Kehadiran** · *live* · kode layar `ATT`.

Layar **clock-in / clock-out** personal dengan verifikasi **selfie** dan **lokasi
GPS** (adaptasi *jibble Timer + Verification*). Inilah layar yang dipakai karyawan
setiap hari.

![Layar Absensi Saya](/img/hr/absensi-saya.png)

## Bagian layar

Layar terbagi dua kolom:

### Kolom kiri — Kamera & selfie

- **Pratinjau kamera** menampilkan umpan kamera depan. Saat menekan tombol clock,
  sistem mengambil **snapshot selfie otomatis** — posisikan wajah di dalam bingkai.
- Tombol **Daftarkan Wajah** membuka pendaftaran template wajah (lihat
  [Pendaftaran Wajah](/hr/kehadiran/pendaftaran-wajah)) bila wajah Anda belum
  direkam.

:::caution Kamera butuh konteks aman (HTTPS)
Jika muncul *“Gagal mengakses kamera”*, pastikan: (1) izin kamera diberikan ke
situs, dan (2) halaman diakses lewat **HTTPS** atau `localhost`. Browser memblokir
kamera pada origin HTTP non-localhost — buka lewat domain produksi
`https://hr.fr-labs.my.id`.
:::

### Kolom kanan — Panel jam & status

- **Jam besar (live)** dan **tanggal** berjalan real-time.
- **Status kontekstual** — mis. *“Belum clock in”*, atau *“Sedang bekerja”* setelah
  masuk.
- Slot **MASUK** dan **KELUAR** menampilkan stempel waktu clock-in / clock-out hari
  ini.
- **Checklist kesiapan** sebelum clock-in:
  - **Kamera siap** — kamera terdeteksi & dapat diakses.
  - **Lokasi terkunci** — koordinat GPS sudah didapat (ditampilkan, mis.
    `-6.2000, 106.8000`).
- Tombol aksi utama **Clock In** (berubah menjadi **Clock Out** saat sedang
  bekerja).

## Alur clock-in

1. Buka **Absensi Saya**. Tunggu checklist *Kamera siap* dan *Lokasi terkunci*
   tercentang.
2. Tekan **Clock In**. Selfie diambil otomatis.
3. Sistem memverifikasi wajah terhadap template terdaftar dan mencocokkan lokasi
   terhadap geofence worksite Anda.
4. Bila semua syarat lolos, status menjadi **Sedang Bekerja** dengan stempel waktu
   di slot **MASUK**.
5. Di akhir kerja, tekan **Clock Out** untuk mengisi slot **KELUAR**.

## Bila verifikasi tidak lolos

Clock tetap tercatat namun **ditandai untuk ditinjau** supervisor. Alasan umum:

| Kode | Arti |
| --- | --- |
| `camera_denied` | Akses kamera ditolak/tidak tersedia. |
| `face_not_detected` | Wajah tidak terdeteksi pada selfie. |
| `liveness_not_verified` | Uji *liveness* (keaslian) tidak terpenuhi. |
| `outside_geofence` | Lokasi di luar radius worksite. |

Kejadian ini muncul di [Tinjauan Absensi](/hr/kehadiran/tinjauan-absensi) untuk
disetujui atau ditolak.
