---
slug: /referensi/arsitektur
sidebar_position: 1
title: Arsitektur & Navigasi
---

# Arsitektur & Navigasi

Sebelum masuk ke tiap modul, pahami **kerangka aplikasi (shell)** yang sama di
seluruh Senti ERP. Memahami satu kali berarti Anda menguasai pola di semua
halaman.

![Master Item — anatomi shell Senti ERP](/img/erp/md-items.png)

## Anatomi layar

Setiap layar tersusun atas empat zona tetap:

| Zona | Letak | Isi |
| --- | --- | --- |
| **Sidebar modul** | Kiri | Daftar modul (Administrator, Master Data, Finance, dst). Klik modul → sub-grup mengembang; klik sub-item → membuka tab. |
| **Topbar** | Atas | Logo, **pemilih workspace** (mis. *Global*), *breadcrumb* (Modul / Halaman), **Search everything** (⌘K), notifikasi, status, dan menu akun. |
| **Bilah tab** | Bawah topbar | Tab halaman yang sedang terbuka. Tombol **+** membuka tab baru; setiap tab punya rute sendiri. |
| **Area kerja** | Tengah | Konten halaman aktif — biasanya sebuah **grid** (daftar) atau **form**. |

### Workspace & tab

Senti ERP mendukung **banyak tab** dalam satu workspace (hingga 16 tab). Ini
memungkinkan, misalnya, membuka PO sambil mengecek stok item di tab lain.
Susunan tab disimpan otomatis sehingga pulih saat Anda kembali. Workspace
*Global* adalah ruang kerja default.

### Command palette (⌘K)

Tekan **⌘K** (macOS) atau **Ctrl+K** (Windows/Linux), atau klik **Search
everything…** di topbar, lalu ketik nama halaman/dokumen untuk melompat tanpa
menelusuri sidebar.

## Pola halaman daftar (grid)

Mayoritas master data dan daftar transaksi memakai **grid** dengan elemen yang
konsisten:

- **Judul + kode** halaman (mis. *Item · ITM*).
- **Toolbar kanan-atas**: **Search**, **Export**, **Refresh** (⟳), dan **+ New**
  untuk membuat entri baru.
- **Baris filter**: filter **Status** (Active/Inactive/All), **Tipe**, rentang
  **Tanggal**, dan **Reset filter**. Penghitung **Σ … rows** menampilkan total.
- **Header kolom** dapat di-*sort* (ikon panah). Kolom umum: Kode, Nama,
  Status, dan kolom spesifik modul.
- **Kolom aksi** per baris (titik tiga / tombol) untuk **Edit**, **Nonaktifkan**,
  **Hapus**.
- **Pagination** di bawah: *rows per page* (default 25), navigasi halaman.
- **Pintasan keyboard** (pojok kanan-bawah): `J`/`K` pindah baris, `X` pilih,
  `N` entri baru.

:::note Soft-delete
Menghapus baris umumnya bersifat **soft-delete** (data dinonaktifkan, bukan
dihapus permanen) demi jejak audit. Filter **Status** memakai konsep yang sama:
*Active* menyembunyikan data yang dinonaktifkan.
:::

## Pola halaman form

Form (membuat/mengubah dokumen) tampil di tab tersendiri. Polanya:

- **Header dokumen**: nomor (otomatis dari penomoran), tanggal, partner/akun,
  cabang/gudang.
- **Baris detail**: tabel item/akun yang bisa ditambah/hapus per baris;
  subtotal, pajak, dan total dihitung otomatis.
- **Aksi simpan**: **Simpan** (draft) atau **Posting** (mengesahkan & membentuk
  jurnal/efek stok). Lihat siklus status di bawah.

## Siklus status dokumen

Dokumen transaksi mengikuti siklus hidup standar:

```
DRAFT  →  POSTED  →  (CANCELLED / RETURNED)
```

- **DRAFT** — tersimpan, belum berdampak ke buku besar/stok; masih bisa diedit.
- **POSTED** — disahkan; membentuk **jurnal akuntansi** dan/atau **mutasi stok**.
- **CANCELLED / RETURNED** — pembatalan/retur membentuk efek balik.

## Pola laporan

Halaman **Reports** menampilkan parameter di atas (mis. **Per Tanggal**,
rentang periode) + tombol **Tampilkan**, lalu hasil tabel di bawah. Sebagian
besar laporan menyediakan **ekspor Excel / PDF / Word**.

![Laporan Neraca dengan ekspor Excel/PDF/Word](/img/erp/fin-balance-sheet.png)

## Bahasa & tampilan

Aplikasi mendukung **Indonesia / English / 日本語** serta preferensi tampilan
(tema, kerapatan, mode rute per-halaman). Atur lewat **Administrator → Initial
Setup → Preferensi** dan **System → Appearance**.
