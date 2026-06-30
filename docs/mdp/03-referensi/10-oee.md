---
slug: /referensi/oee
sidebar_position: 11
title: OEE — Overall Equipment Effectiveness
---

# OEE — Overall Equipment Effectiveness

**OEE** adalah **overlay metrik turunan** — *bukan* modul dengan tabel sendiri.
Ia dihitung dari data MES (downtime/log), kalender kerja, dan QMS. Karena
turunan, OEE selalu mencerminkan data operasional terkini tanpa entri ganda.

```
OEE = Availability × Performance × Quality
```

![Dashboard OEE Overlay](/img/mdp/oee.png)

## Bagian halaman

1. **Filter** — rentang tanggal **Dari/Sampai** dan pemilih **Work Center**
   (atau *Semua*). Mengubah filter menghitung ulang seluruh metrik.
2. **Kartu KPI** — empat angka ringkas: **OEE**, **Ketersediaan**
   (Availability), **Performa** (Performance), dan **Kualitas** (Quality) untuk
   rentang terpilih.
3. **Tabel per work center** — kolom: **Planned** (jam terencana), **Downtime**,
   **Good / Total**, lalu **A** · **P** · **Q** · **OEE** per work center.

## Komponen & sumber data

| Komponen | Rumus konseptual | Sumber |
| --- | --- | --- |
| **Availability (A)** | waktu jalan ÷ waktu rencana | Work Calendar (planned) − Downtime (MES/CMMS) |
| **Performance (P)** | output aktual ÷ output ideal | Good/Total (MES) vs *ideal cycle time* Work Center |
| **Quality (Q)** | qty baik ÷ total produksi | Production Logs (MES), NCR (QMS) |

## Mengapa sel bisa kosong (`—`)

Bila data pendukung belum lengkap, sel menampilkan `—` dan OEE tidak terhitung:

- **Availability** butuh **Work Calendar** (planned time) terisi.
- **Performance** butuh **ideal cycle time** pada Work Center terisi — bila
  kosong, P = `—` (terlihat pada screenshot: beberapa work center menampilkan P
  `—` sehingga OEE pun `—`).
- Footer halaman menjelaskan kondisi ini secara eksplisit.

## Cara menyiapkan OEE yang akurat (admin)

1. Isi **[Work Calendar](/mdp/referensi/master-data#5-work-calendar)** → basis
   Availability.
2. Isi **ideal cycle time** tiap
   **[Work Center](/mdp/referensi/master-data#1-work-center)** → basis
   Performance.
3. Pastikan operator rutin mengisi **Production Logs** dan **Downtime Events**
   di [MES](/mdp/referensi/mes).
4. NCR/scrap di [QMS](/mdp/referensi/qms) menurunkan Quality.

:::tip
OEE adalah cermin: kualitas angkanya hanya sebaik kelengkapan data MES, kalender
kerja, dan parameter work center. Mulai dari mengisi planned time + ideal cycle.
:::
