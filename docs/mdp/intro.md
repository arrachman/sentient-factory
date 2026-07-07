---
slug: /
sidebar_position: 1
title: Selamat Datang di Senti MDP
---

# Senti MDP

**Senti MDP** (*Manufacturing Digitalization Platform*) adalah sistem
**ISA-95 Level 3 / MOM** (*Manufacturing Operations Management*) yang
menjembatani **Senti ERP** (Level 4 — bisnis) dengan **operasi di lapangan**
(Level 2–0 — SCADA/PLC/sensor). MDP **bukan** modul ERP; ia adalah aplikasi
terpisah dengan persona, kecepatan data, dan UX yang berbeda — fokus pada apa
yang terjadi di lantai pabrik **saat ini**.

![Beranda Senti MDP — Manufacturing Operations Management](/img/mdp/beranda.png)

## Posisi dalam piramida ISA-95

```
Level 4  │  Senti ERP        — perencanaan bisnis, work order, inventory, finance
─────────┼──────────────────────────────────────────────────────────────────────
Level 3  │  Senti MDP (MOM)  — eksekusi & pelaporan operasi: MES · QMS · CMMS · WMS …
─────────┼──────────────────────────────────────────────────────────────────────
Level 2-0│  SCADA / PLC / sensor / operator di mesin  (integrasi = fase mendatang)
```

ERP menurunkan **rencana** (work order, kebutuhan material) ke MDP; MDP
mengeksekusi di lapangan dan **mengemit hasil** (produksi, konsumsi, pergerakan
stok) kembali ke ERP. Saat ini MDP adalah **manual-entry-first**: operator
mengisi data lewat UI tablet/kiosk; integrasi mesin otomatis adalah ekstensi
masa depan, bukan bagian MVP.

## Untuk siapa dokumentasi ini

- **Pengguna / Operator** — operator produksi, QC, dan teknisi yang mencatat
  hasil kerja di lantai pabrik.
- **Admin / Implementator** — yang menyiapkan master MOM (work center, shift,
  kalender, reason code), alur kerja, hak akses, dan parameter OEE.
- **Pengembang / Analis** — yang perlu memahami modul, struktur data, dan
  kontrak integrasi ke ERP.

## Modul utama

MDP terdiri dari **8 modul MOM** + **overlay OEE** + **foundation master**
(`mdp`/`eam`). Tabel berikut adalah peta cepat; tiap modul punya halaman
referensi tersendiri dengan screenshot, rincian fungsi, bagian, dan flow.

| Modul | System | Domain DB | Fungsi inti | Referensi |
| --- | --- | --- | --- | --- |
| MES | Eksekusi Produksi | `mes` `eam` | Jalankan & catat produksi dari work order | [MES](/mdp/referensi/mes) |
| WMS | Eksekusi Gudang | `wms` | Putaway, picking, perpindahan stok fisik | [WMS](/mdp/referensi/wms) |
| QMS | Kualitas | `qms` | Inspeksi, nonconformance (NCR), CAPA | [QMS](/mdp/referensi/qms) |
| CMMS | Pemeliharaan | `mnt` `eam` | Work order PM, jadwal, spare parts | [CMMS](/mdp/referensi/cmms) |
| PRTS | Problem & Tracking | `prt` | Andon, penangkapan masalah, eskalasi | [PRTS](/mdp/referensi/prts) |
| DMS | Dokumen | `dms` | Dokumen terkontrol, revisi, acknowledgement | [DMS](/mdp/referensi/dms) |
| IMS | QHSE Terpadu | `ehs` | Insiden, audit, izin kerja | [IMS](/mdp/referensi/ims) |
| LMS | Pelatihan | `lms` | Kursus, enrollment, matriks kompetensi | [LMS](/mdp/referensi/lms) |
| OEE | Metrik (overlay) | turunan | Availability × Performance × Quality | [OEE](/mdp/referensi/oee) |

## Cara membaca dokumentasi ini

1. **[Arsitektur & Konsep](/mdp/referensi/arsitektur)** — pahami dulu shell
   aplikasi, navigasi, dan model interaksi CRUD yang dipakai seragam di seluruh
   modul. Membaca ini sekali = paham cara kerja 40+ halaman.
2. **[Master Data](/mdp/referensi/master-data)** — fondasi yang harus disiapkan
   admin sebelum modul dipakai.
3. **Referensi per modul** — buka modul yang Anda butuhkan.
4. **Panduan Pengguna / Admin** — alur tugas spesifik langkah-demi-langkah.

:::tip Versi dokumen
Gunakan pemilih versi di bilah navigasi untuk membuka dokumentasi versi rilis
tertentu.
:::
