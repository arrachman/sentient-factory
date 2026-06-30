---
sidebar_position: 4
title: Pengaturan (Verifikasi)
---

# Pengaturan

Rute `/app/settings` · grup **Laporan & Lainnya** · *live* · **privileged**.

Konfigurasi **kebijakan absensi & verifikasi** — terutama ambang skor wajah dan
perilaku auto-submit. Tiap baris adalah satu setelan dengan tombol **Simpan**
sendiri.

![Pengaturan verifikasi](/img/hr/pengaturan.png)

## Setelan

| Kunci | Arti | Contoh |
| --- | --- | --- |
| `autoSubmitEnabled` | Apakah clock yang lolos verifikasi langsung disahkan otomatis (tanpa antri tinjauan). | `true` |
| `autoSubmitConfidenceThreshold` | Ambang keyakinan minimum agar clock di-*auto-submit*. | `0.25` |
| `faceIdentifyConfidenceThreshold` | Ambang keyakinan untuk **mengidentifikasi** wajah (1:N). | `0.05` |
| `faceVerifyConfidenceThreshold` | Ambang keyakinan untuk **memverifikasi** wajah terhadap template (1:1). | `0.05` |

## Alur

1. Ubah nilai pada kolom yang diinginkan.
2. Tekan **Simpan** pada baris tersebut.

:::caution Dampak ke antrian tinjauan
Ambang lebih **tinggi** = verifikasi lebih ketat = lebih banyak clock yang gagal
otomatis dan masuk [Tinjauan Absensi](/hr/kehadiran/tinjauan-absensi). Setel
hati-hati dan pantau volume antrian setelah perubahan.
:::

:::note Beda dengan Tampilan
Halaman ini mengatur **kebijakan sistem** (verifikasi). Preferensi visual
per-pengguna (tema, bahasa, layout) ada di
[Tampilan](/hr/memulai/tampilan).
:::
