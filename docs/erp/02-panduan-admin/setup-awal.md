---
sidebar_position: 0
title: Setup Awal (Implementasi)
---

# Setup Awal (Implementasi)

Urutan langkah yang disarankan saat pertama kali menyiapkan Senti ERP untuk
sebuah perusahaan. Kerjakan dari atas ke bawah — tiap langkah menjadi fondasi
langkah berikutnya.

## Checklist

1. **Company Settings** — isi identitas perusahaan (nama legal, alamat, NPWP,
   logo) di **Administrator → Initial Setup → Company Settings**.
2. **Fiscal Periods** — buka periode fiskal berjalan di **Administrator →
   System → Fiscal Periods**.
3. **Document Numbering** — atur format nomor semua jenis dokumen. Lihat
   **[Penomoran Dokumen](/panduan-admin/penomoran-dokumen)**.
4. **Accounting & Tax Settings** — tetapkan **akun default** (kas, bank,
   piutang, utang, persediaan, COGS) dan **pajak**.
5. **Master Data** — siapkan:
   - **Chart of Accounts** (bagan akun),
   - **Organization** (cabang, gudang, divisi, cost center),
   - **Items** (barang + satuan + kategori),
   - **Partners** (customer, supplier).
6. **Opening Balances** — input **saldo awal CoA** (Finance) dan **stok awal**
   (Warehouse → Opening Stock).
7. **Users, Roles & Permissions** — buat akun pengguna, role, dan hak akses di
   **Administrator → Administration**.

## Tips

- Gunakan **Import Data** (**Administrator → Initial Setup → Import Data**) untuk
  memuat master/saldo awal secara massal saat migrasi.
- Master yang sudah dipakai dokumen sebaiknya **dinonaktifkan**, bukan dihapus,
  agar histori tetap utuh.
- Rincian tiap halaman setup ada di
  **[Referensi → Administrator](/referensi/administrator)** dan
  **[Referensi → Master Data](/referensi/master-data)**.
