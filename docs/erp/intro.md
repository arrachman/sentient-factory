---
slug: /
sidebar_position: 1
title: Selamat Datang di Senti ERP
---

# Senti ERP

**Senti ERP** adalah sistem *Enterprise Resource Planning* terpadu untuk
manufaktur dan distribusi: master data, keuangan, persediaan, pembelian,
penjualan, dan produksi dalam satu platform berbasis web yang cepat dan presisi.

Aplikasi berjalan sebagai **SPA multi-tab** — Anda dapat membuka banyak halaman
sekaligus dalam satu jendela (seperti tab browser), berpindah cepat lewat
*command palette*, dan menjalankan transaksi tanpa berpindah halaman.

Dokumentasi ini ditujukan untuk:

- **Pengguna / Operator** — yang membuat transaksi harian (PO, penerimaan
  barang, faktur, jurnal). → mulai dari **[Panduan Pengguna](/panduan-pengguna)**.
- **Admin / Implementator** — yang menyiapkan master data, bagan akun, penomoran
  dokumen, pengguna & hak akses. → **[Panduan Admin](/panduan-admin)**.
- **Semua peran** — yang ingin memahami setiap halaman secara rinci. →
  **[Referensi Modul](/referensi/arsitektur)** (lengkap dengan screenshot).

## Peta modul

Navigasi utama (sidebar kiri) tersusun atas modul-modul berikut:

| Modul | Kode | Fungsi inti |
| --- | --- | --- |
| **Administrator** | `ADM` | Setup awal, pengaturan sistem, pengguna, role, hak akses, penomoran, periode fiskal, perancang laporan |
| **Master Data** | `M1` | Organisasi (cabang/gudang/divisi), item, partner, bagan akun, referensi, master produksi |
| **Finance & Accounting** | `FIN` | Kas/bank, jurnal, giro, AR/AP, dan laporan keuangan (neraca, laba rugi, arus kas) |
| **Warehouse & Inventory** | `M3` | Permintaan material, transfer, stok opname, penyesuaian, kartu & laporan stok, statistik |
| **Purchasing** | `M4` | PR → RFQ → PO → GRN → faktur beli → retur → pembayaran vendor |
| **Sales** | `M5` | Penawaran → SO → pengiriman → faktur jual → retur → penagihan AR |
| **Production** | `M6` | Bill of Materials (BOM) & Work Order (WO) |
| **Fixed Assets** | `M7` | Aset tetap & penyusutan *(dalam pengembangan)* |
| **Point of Sale** | `M12` | Kasir ritel *(dalam pengembangan)* |

:::info Sumber kebenaran menu
Struktur menu di atas diambil **langsung dari menu pengguna live** (endpoint
`/sys-menus/my-menus`) yang difilter berdasarkan role. Apa yang Anda lihat di
sidebar bisa berbeda tergantung hak akses akun Anda.
:::

## Masuk ke aplikasi

Halaman login adalah pintu masuk. Gunakan kredensial perusahaan Anda; sesi
disimpan lewat cookie aman dan dipulihkan otomatis saat Anda kembali.

![Halaman login Senti ERP](/img/erp/login.png)

- **Username & Password** — kredensial yang dibuat admin di
  **Administrator → User Management**.
- **Ingat saya** — mempertahankan sesi pada perangkat ini.
- **Mode demo** — pada lingkungan uji, kredensial demo terisi otomatis.

Setelah masuk, Anda berada di dalam **shell aplikasi**: sidebar modul di kiri,
bilah tab di atas, *command palette* (⌘K / Ctrl+K) untuk lompat ke halaman mana
pun, dan area kerja utama di tengah. Pelajari elemen-elemen ini di
**[Referensi → Arsitektur & Navigasi](/referensi/arsitektur)**.

:::tip Versi dokumen
Gunakan pemilih versi di bilah navigasi untuk membuka dokumentasi versi rilis
tertentu.
:::
