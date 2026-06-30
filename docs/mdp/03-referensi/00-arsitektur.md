---
slug: /referensi/arsitektur
sidebar_position: 1
title: Arsitektur & Konsep
---

# Arsitektur & Konsep

Halaman ini menjelaskan kerangka aplikasi MDP yang **berlaku seragam di seluruh
modul**: posisi sistem, struktur navigasi (shell), dan **model interaksi CRUD**
yang dipakai ulang oleh hampir semua halaman. Pahami ini sekali → Anda paham
cara kerja 40+ halaman.

## 1. Posisi sistem (ISA-95)

MDP adalah lapisan **Level 3 / MOM**. Ia tidak menyimpan saldo bisnis (itu milik
ERP) dan tidak terhubung langsung ke mesin (itu Level 2-0, fase mendatang).
Perannya: **menerima rencana dari ERP, mengeksekusi di lapangan, mengemit hasil
balik ke ERP.**

| Aspek | Senti ERP (L4) | Senti MDP (L3) |
| --- | --- | --- |
| Fokus | Perencanaan bisnis | Eksekusi operasi |
| Kecepatan data | Harian/transaksional | Real-time/per-shift |
| Pengguna | Staf kantor | Operator, QC, teknisi |
| Contoh objek | Work order, invoice, stok | Production log, inspeksi, downtime |
| Saldo stok | **Memiliki & posting** | Hanya mengemit pergerakan |

## 2. Shell aplikasi

Setiap halaman digambar dalam **shell** yang sama:

![Halaman Master Data dengan sidebar modul ter-expand](/img/mdp/master-work-centers.png)

- **Topbar** — brand `Sentient / MDP`, breadcrumb konteks (*Manufacturing
  Digitalization Platform · ISA-95 Level 3*), kotak **Cari semua** global
  (pintasan `K`), serta ikon notifikasi, aktivitas, dan **pengaturan**.
- **Sidebar kiri** — daftar modul MOM (MES, WMS, QMS, CMMS, PRTS, DMS, IMS, LMS),
  **OEE**, dan **Master Data**. Grup yang aktif ter-*expand* menampilkan
  sub-halaman. Sidebar ini **role-aware**: isinya difilter dari peta
  `role → menu` (lihat [Akses Menu per Role](/mdp/referensi/master-data#7-akses-menu-per-role)).
  Bila user belum punya pemetaan, ditampilkan pohon menu penuh sebagai fallback.
- **Area konten** — judul halaman + tag modul, sub-judul (domain · deskripsi),
  toolbar, dan tabel/konten.

## 3. Model interaksi CRUD (penting)

Mayoritas halaman MDP adalah **halaman CRUD seragam** (organism
`MasterCrudPage`). Mengenali polanya berarti Anda bisa mengoperasikan modul
apa pun tanpa pelatihan ulang.

### Toolbar

| Kontrol | Fungsi | Pintasan |
| --- | --- | --- |
| **Cari semua** | Filter baris berdasarkan teks | `/` |
| **Export** | Unduh data tampilan | — |
| **Refresh** (⟳) | Muat ulang dari server | — |
| **+ Tambah** | Buka form pembuatan record baru | `N` |

### Tabel

- Kolom **bisa diurutkan** (klik header). Kolom angka rata-kanan.
- Kolom **Status** memakai *badge* berwarna (mis. `Aktif`, `RELEASED`,
  `IN_PROGRESS`, `COMPLETED`).
- Kolom kiri = **checkbox** untuk seleksi (aksi massal).
- Kolom paling kanan = menu **⋯ (kebab)** berisi aksi baris: **Edit** dan
  **Hapus** (*soft-delete* — data tidak benar-benar dihapus, hanya ditandai
  `deletedAt`).
- **Footer** menampilkan pintasan keyboard: `/` cari · `N` tambah · `J/K`
  navigasi baris · `X` pilih · `Enter` buka.

### Form (modal Tambah/Edit)

Field di-render menurut tipe data: **text**, **number**, **time**,
**datetime** (lokal ↔ ISO UTC), **select** (enum), dan **checkbox**. Field
wajib divalidasi sebelum simpan. Pada slice fungsional saat ini, **referensi
antar-record (FK) diisi sebagai ID mentah** — pemilih *lookup* visual adalah
peningkatan yang direncanakan.

:::note Manual-entry-first
Semua angka (kuantitas, durasi, hasil ukur) diisi **manual** oleh operator.
Desain sudah menyediakan titik ekstensi untuk integrasi mesin/SCADA, tetapi itu
**bukan bagian MVP**.
:::

## 4. Konvensi data & integrasi

- **Penamaan tabel**: `<domain>_<plural>` (mis. `mes_production_orders`,
  `qms_inspections`). Domain MDP: `mdp`, `eam`, `mes`, `qms`, `mnt`, `wms`,
  `prt`, `dms`, `ehs`, `lms`.
- **Field standar**: setiap record punya `code`/`name`, status `isActive`,
  *soft-delete* `deletedAt`, dan audit (`createdAt`/`updatedAt` + pembuat).
  Uang/kuantitas `Decimal(19,4)`; semua waktu UTC.
- **Kontrak L4↔L3** (lihat tiap modul):
  - **WMS** mengemit pergerakan → **ERP `inv_`** yang memposting stok.
  - **MES** mengeksekusi `mfg_work_orders` ERP → mengemit log produksi balik.
  - **OEE** = metrik **turunan** (dihitung dari MES/CMMS/QMS), tanpa tabel
    sumber sendiri.
  - Emit ke ERP berjalan lewat **outbox** (sedang di-stub); record yang
    menunggu emit bertanda `postingStatus = PENDING`.
- **Backend**: NestJS di `api-gateway`, endpoint `/api/mdp/...`, dijaga JWT
  (cookie `erp_token`, autentikasi memakai akun ERP yang sama).

## 5. Login

Akses MDP memakai akun ERP yang sama (Single Sign-On lewat cookie `erp_token`).

![Halaman login Senti MDP](/img/mdp/login.png)

Masukkan **username/email** dan **password**. Sesi yang berhasil mengarahkan ke
**Beranda** (`/app`).
