---
slug: /referensi/keuangan
sidebar_position: 4
title: Finance & Accounting
---

# Finance & Accounting

Modul **Finance & Accounting** (`FIN`) mencatat seluruh aktivitas kas/bank,
jurnal, giro, dan piutang/utang, lalu menyajikannya sebagai laporan keuangan.
Setiap dokumen yang **diposting** membentuk **jurnal** di buku besar secara
otomatis. Sub-navigasi terbagi **Transactions** dan **Reports**.

## Transactions

### Cash Receipt & Cash Disbursement

**Kas Masuk** (Cash Receipt) dan **Kas Keluar** (Cash Disbursement) mencatat
penerimaan/pengeluaran kas. Header memuat tanggal, kas/akun lawan, dan partner;
baris detail memuat akun & nominal. Posting → jurnal kas.

![Cash Receipt](/img/erp/fin-cash-receipts.png)

![Cash Disbursement](/img/erp/fin-cash-disbursements.png)

### Bank Receipt & Bank Disbursement

Setara kas masuk/keluar untuk rekening **bank**. Mendukung pencocokan ke
rekening bank yang terdaftar di master.

![Bank Receipt](/img/erp/fin-bank-receipts.png)

### General Journal

**Jurnal Umum** — entri akuntansi manual debit/kredit untuk transaksi yang tidak
melalui modul lain (penyesuaian, alokasi, koreksi). Total debit harus sama
dengan total kredit sebelum posting.

![General Journal](/img/erp/fin-general-journals.png)

Keluarga jurnal lain: **Adjustment Journal**, **Memorial Journal**, dan **FX
Revaluation** (revaluasi selisih kurs).

### Giro

Pengelolaan **giro/cek** masuk dan keluar lewat siklus penuh:

- **Receipt Giro** / **Send Giro** — penerimaan/penerbitan giro.
- **Receipt/Send Giro Clearing** — pencairan (kliring) giro; jurnal terbentuk
  saat kliring.

![Receipt Giro](/img/erp/fin-receipt-giros.png)

### Opening Balance (CoA)

**Saldo awal** akun saat implementasi/awal periode — titik mula buku besar
sebelum transaksi berjalan.

![Opening Balance](/img/erp/fin-opening-balances.png)

Transaksi lain pada grup ini: **Receipt Memo**, **Send Memo**, dan **Cash/Bank
Transfer** (pindah dana antar kas/bank).

## Reports

Laporan keuangan mengambil data langsung dari buku besar. Sebagian besar
menyediakan filter periode + ekspor **Excel / PDF / Word**.

### General Ledger & Trial Balance

- **General Ledger** (Buku Besar) — mutasi rinci per akun pada periode tertentu.
- **Trial Balance** (Neraca Saldo) — saldo seluruh akun untuk uji keseimbangan
  debit/kredit.

![General Ledger](/img/erp/fin-ledger.png)

![Trial Balance](/img/erp/fin-trial-balance.png)

### Balance Sheet (Neraca)

**Neraca** per tanggal tertentu: Aset, Kewajiban, dan Ekuitas dengan saldo per
akun. Parameter **Per Tanggal** + **Tampilkan**, ekspor Excel/PDF/Word.

![Balance Sheet](/img/erp/fin-balance-sheet.png)

### Income Statement & Cash Flow

- **Income Statement** (Laba Rugi) — pendapatan dikurangi beban pada periode.
- **Cash Flow** (Arus Kas) — arus kas operasi/investasi/pendanaan.

![Income Statement](/img/erp/fin-income-statement.png)

![Cash Flow](/img/erp/fin-cash-flow.png)

### AR / AP Aging

- **AR Aging** — umur piutang per pelanggan (jatuh tempo).
- **AP Aging** — umur utang per pemasok.

![AR Aging](/img/erp/fin-ar-aging.png)

![AP Aging](/img/erp/fin-ap-aging.png)

Grup Reports juga memuat **Neraca Mutasi**, **Perubahan Modal**, **Daily Cash &
Bank**, **AR/AP Card**, **Giro Maturity**, dan **Budget vs Realization**.

:::info Hubungan dengan modul lain
Faktur dari **Purchasing** & **Sales** otomatis menambah utang/piutang (AP/AR);
penerimaan/pembayaran di modul tersebut maupun di Finance memperbarui saldo yang
sama. Semua bermuara di **buku besar** dan tampil di laporan ini.
:::
