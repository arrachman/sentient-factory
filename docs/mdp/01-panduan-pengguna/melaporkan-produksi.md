---
sidebar_position: 1
title: Melaporkan Hasil Produksi (MES)
---

# Melaporkan Hasil Produksi (MES)

Panduan operator mencatat hasil produksi terhadap perintah kerja (*production
order*). Untuk rincian setiap halaman lihat [Referensi MES](/mdp/referensi/mes).

## Langkah

1. Buka **Manufacturing Execution → Production Orders** lewat sidebar.
2. Pilih perintah kerja yang berstatus `RELEASED` atau `IN_PROGRESS`
   (tekan `Enter` atau klik kodenya).
3. Catat pelaporan di **Production Logs** (**+ Tambah** / pintasan `N`):
   - **Kuantitas baik** dan **kuantitas reject** yang dihasilkan.
   - Periode/waktu bila diminta.
4. Tekan **Simpan**. Sistem **menghitung ulang** akumulasi *good qty* pada order
   induk secara otomatis (rollup transaksional).
5. Data masuk ke perhitungan [OEE](/mdp/referensi/oee) (Performance & Quality).

## Mencatat downtime & jam kerja

- **Downtime mesin** → **MES → Downtime Events**: isi waktu mulai/selesai dan
  pilih **reason code**. Durasi dihitung saat event ditutup.
- **Jam kerja** → **MES → Labor Logs**: catat operator dan rentang waktu.

> Entri bersifat **manual-entry-first**: dapat diisi manual sebelum integrasi
> mesin tersedia.
