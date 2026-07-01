---
slug: /referensi/master-data/work-calendar
sidebar_position: 5
title: Work Calendar
---

# Work Calendar

**Rute:** `/app/master/work-calendars` · **Domain:** `mdp`

*Planned operating time* — jadwal **waktu operasi terencana**. Inilah **penyebut
Availability** di OEE: bila kalender kerja kosong, OEE tidak bisa dihitung
(kolom OEE menampilkan `—`).

![Daftar Work Calendar](/img/mdp/master-work-calendars.png)

## Untuk apa & kapan dipakai

- **Basis Availability OEE:** Availability = waktu jalan ÷ **waktu rencana**.
  Waktu rencana inilah yang didefinisikan Work Calendar. Tanpa data ini, OEE
  tidak terhitung.
- **Menetapkan hari/jam kerja & non-kerja** (libur, maintenance terjadwal) agar
  perhitungan tidak menghukum waktu yang memang tidak direncanakan berproduksi.

**Contoh skenario:** lini beroperasi Senin–Jumat 2 shift → definisikan planned
operating time di Work Calendar → OEE Availability langsung punya penyebut yang
benar.

## Kolom / field utama

| Field | Wajib | Keterangan |
| --- | --- | --- |
| **Kode** | ✔ | Business key unik. |
| **Nama** | ✔ | Nama kalender (mis. *Kalender Lini A*). |
| **Planned time** | ✔ | Definisi waktu operasi terencana (basis Availability). |
| **Status** | — | `Aktif`/nonaktif. |

## Alur singkat

Tambah kalender → isi kode/nama → definisikan **planned operating time** →
**Simpan**. Setelah terisi, sel Availability di [OEE](/mdp/referensi/oee) berhenti
menampilkan `—`.
