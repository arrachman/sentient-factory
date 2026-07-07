---
slug: /referensi/administrator
sidebar_position: 2
title: Administrator
---

# Administrator

Modul **Administrator** (`ADM`) adalah pusat konfigurasi sistem dan kontrol
akses. Hanya admin/implementator yang biasanya memakai modul ini. Sub-navigasi
terbagi tiga grup: **Initial Setup**, **Administration**, dan **System**.

| Grup | Isi ringkas |
| --- | --- |
| **Initial Setup** | Preferensi, pengaturan perusahaan/akuntansi/pajak, penomoran dokumen, rekening bank, preset, kebijakan approval, impor data |
| **Administration** | Pengguna, role, permission, bahasa, menu, pengguna online, log, tutup periode fiskal, recalc COGS, repost jurnal, validasi data |
| **System** | Manajer menu & setting, format akun/angka/tanggal, periode fiskal, audit log, kustomisasi grid, form builder, **Report Designer** |

## Initial Setup

### Preferensi

Preferensi personal/sistem: bahasa, tampilan, dan default tampilan aplikasi.

![Preferensi](/img/erp/adm-preferences.png)

### Company Settings

Identitas perusahaan (nama legal, alamat, NPWP, logo) yang dipakai di kop
dokumen dan laporan cetak.

![Company Settings](/img/erp/adm-company.png)

### Accounting Settings

Pemetaan **akun default** (kas, bank, piutang, utang, persediaan, COGS, dll) yang
dipakai posting otomatis transaksi. Pengaturan ini menentukan jurnal yang
terbentuk saat dokumen di-*posting*.

![Accounting Settings](/img/erp/adm-accounting.png)

### Document Numbering

Format & urutan **nomor dokumen** per jenis (PO, faktur, jurnal, dst): prefix,
panjang counter, reset per periode. Lihat panduan langkah di
**[Panduan Admin → Penomoran Dokumen](/panduan-admin/penomoran-dokumen)**.

![Document Numbering](/img/erp/adm-document-numbering.png)

### Tax Settings

Master & default **pajak** (mis. PPN) — tarif, akun pajak, dan perilaku
inklusif/eksklusif yang dipakai saat menghitung total dokumen.

![Tax Settings](/img/erp/adm-tax.png)

### Import Data

Impor master/transaksi awal secara massal (mis. dari spreadsheet) saat migrasi
atau implementasi.

![Import Data](/img/erp/adm-import.png)

## Administration

### User Management

Daftar **pengguna** sistem. Kolom: Kode, Nama, Bahasa, Cabang, Tgl Exp, Status.
Aksi per baris: **Nonaktifkan** dan **Hapus**; tombol **+ New** menambah
pengguna. Kadaluarsa (Tgl Exp) dan cabang membatasi akses login.

![User Management](/img/erp/adm-users.png)

### Role Management

**Role** mengelompokkan hak akses. Pengguna diberi satu/lebih role; role
dipetakan ke menu (apa yang tampil di sidebar) dan permission (apa yang boleh
dilakukan).

![Role Management](/img/erp/adm-roles.png)

### Permissions

Daftar **permission** granular (mis. lihat/buat/posting/hapus per modul) yang
diikat ke role.

![Permissions](/img/erp/adm-permissions.png)

### Menu Management

Definisi **menu sistem** (`sys_menus`) — judul, kode, ikon, path, dan hierarki
yang membentuk sidebar. Pemetaan role→menu menentukan apa yang dilihat tiap
pengguna.

![Menu Management](/img/erp/adm-menus.png)

### Audit Log / User Log

Jejak aktivitas pengguna dan perubahan data untuk keperluan audit dan
penelusuran.

![Audit Log](/img/erp/adm-audit-logs.png)

### Tools administrasi

Grup Administration juga memuat utilitas operasional:

- **Close Fiscal Period** — menutup periode akuntansi agar tidak bisa diposting lagi.
- **Recalculate COGS** — hitung ulang harga pokok (COGS) untuk konsistensi nilai persediaan.
- **Repost Journals** — posting ulang jurnal saat ada koreksi pemetaan akun.
- **Data Validity Check** — pemeriksaan integritas data.
- **Online Users** — daftar pengguna yang sedang aktif.

## System

### Fiscal Periods

Definisi **periode fiskal** (bulan/tahun buku) — basis untuk laporan,
penutupan, dan kontrol posting per periode.

![Fiscal Periods](/img/erp/adm-fiscal-periods.png)

### Report Designer

**Perancang laporan** band-based untuk membuat/menyesuaikan template cetak
(faktur, PO, kwitansi, buku besar). Lihat juga modul template laporan terpisah.

![Report Designer](/img/erp/adm-report-designer.png)

Grup System juga memuat **Menu Manager**, **Settings Manager**, format
**Akun/Angka/Tanggal**, **Document Numbering**, **Audit Log**, **Kustomisasi
Grid**, dan **Form Builder**.

:::tip Urutan setup yang disarankan
1. **Company Settings** → identitas perusahaan.
2. **Fiscal Periods** → buka periode berjalan.
3. **Document Numbering** → format nomor semua dokumen.
4. **Accounting & Tax Settings** → akun default & pajak.
5. **Master Data** → CoA, item, partner (lihat modul berikutnya).
6. **Users, Roles, Permissions** → buat akun & hak akses.
:::
