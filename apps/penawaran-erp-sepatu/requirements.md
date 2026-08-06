# Requirement — ERP Sepatu + E-Katalog + Absensi

**Klien**: Produsen sepatu (segmen sekolah / sepatu sekolah)
**Dokumen**: Requirement fungsional awal (draft)
**Status**: Draft — perlu konfirmasi klien pada poin bertanda ❓

---

## 1. Ringkasan Bisnis

Bisnis memproduksi dan mendistribusikan sepatu, dengan fokus pasar **sekolah-sekolah**
dan **toko-toko** (reseller). Model operasinya campuran:

- Produksi **in-house** (stok milik sendiri) → didistribusikan ke toko.
- Produksi **subkontrak ke tukang** → hasilnya dijual kembali ke toko.
- Penjualan **online / e-katalog** dan **order via sales**.
- Titip barang di toko dengan **POS** dan **SPG** untuk monitoring.
- **Absensi** untuk admin, SPG, dan sales.

## 2. Dimensi Produk (kritikal)

Setiap SKU sepatu wajib punya dimensi varian:

| Dimensi | Keterangan |
| --- | --- |
| **Nomor / Size** | Ukuran sepatu (mis. 30–45). Range per model bisa beda. |
| **Warna** | Master warna tersendiri (hitam, putih, dst.) |
| Model / Artikel | Kode artikel produk induk |
| Jenis | Sepatu sekolah, olahraga, dll. |

**Implikasi**: stok, harga, BOM, order, dan penjualan semuanya di-track pada level
**varian (artikel × nomor × warna)**, bukan level artikel. Struktur ini juga
dipakai untuk *size run* — pemesanan per set ukuran (mis. 1 karton = 30–38 mix).

❓ Konfirmasi: apakah harga bisa berbeda per nomor (size besar lebih mahal)?

---

## 3. Modul

### M0 — Master Data

| Master | Field utama |
| --- | --- |
| **Master Tukang** | Kode, nama, alamat, kontak, jenis kerja (upper/assembling/finishing), tarif ongkos per pasang, mode bahan (bahan dari kita / bahan sendiri), termin bayar |
| **Master Warna** | Kode warna, nama, kode hex (untuk katalog) |
| **Master Sales** | Kode, nama, area/wilayah, target, skema komisi, atasan |
| Master Artikel/Model | Kode artikel, kategori, gambar, range nomor, HPP, harga jual |
| Master Ukuran (nomor) | Nomor, urutan, grup size-run |
| Master Bahan | Kode, satuan, stok, harga beli |
| Master Toko/Pelanggan | Kode, nama, alamat kirim, sales penanggung jawab, plafon kredit, jenis (toko / sekolah) |
| Master SPG | Nama, toko penempatan, jadwal |
| Master Gudang | Gudang jadi, gudang bahan, gudang tukang (konsinyasi bahan) |

### M1 — E-Katalog & Order

- Katalog produk online: foto per warna, pilihan nomor, stok tersedia, harga.
- **Order sales**: sales input order atas nama toko/sekolah (bisa dari HP).
- **Order online**: pelanggan/toko order mandiri lewat katalog.
- Keranjang berbasis **size-run** (input kuantitas per nomor dalam satu grid).
- Alur: Order → Approval (limit kredit/harga) → SO → Alokasi stok / Perintah Produksi.
- Status order transparan ke pemesan (dipesan → produksi → dikirim → diterima).

❓ Konfirmasi: apakah order online butuh pembayaran online (payment gateway) atau
cukup transfer manual + konfirmasi admin?

### M2 — Produksi (In-House)

- **BOM** per artikel × nomor (konsumsi bahan berbeda per ukuran).
- Perintah Produksi (WO) dari SO atau dari rencana stok.
- Tahapan produksi: potong (cutting) → upper → assembling → finishing → QC → gudang jadi.
- Pencatatan hasil per tahap + reject/afkir.
- Otomatis **potong stok bahan** sesuai BOM saat WO dijalankan.
- Perhitungan **HPP**: bahan + ongkos tukang + overhead.

### M3 — Produksi Subkontrak (Tukang)

Kasus: tukang **tidak punya stok**; mereka hanya mengerjakan produksi. Bahan bisa:

**Mode A — Bahan disediakan kita**
1. Terbit SPK (Surat Perintah Kerja) ke tukang: artikel, nomor, warna, qty, tarif.
2. **Setor BOM**: bahan dikeluarkan dari gudang ke tukang sesuai BOM (surat jalan bahan).
3. Stok bahan **dipotong** dan tercatat sebagai *stok di tukang* (konsinyasi keluar).
4. Tukang setor hasil jadi → terima barang jadi + rekonsiliasi pemakaian bahan.
5. Selisih bahan (susut/sisa/kelebihan) dicatat dan dibebankan sesuai kebijakan.
6. Hutang ongkos tukang terbentuk otomatis dari qty diterima × tarif.

**Mode B — Bahan milik tukang sendiri**
1. Terbit SPK dengan harga **beli jadi per pasang** (bukan ongkos saja).
2. Tidak ada pengeluaran bahan; penerimaan barang jadi = pembelian ke tukang.

- Laporan: outstanding SPK, saldo bahan di tiap tukang, produktivitas & reject per tukang, hutang ongkos.

❓ Konfirmasi: apakah pembayaran tukang mingguan borongan per pasang, atau ada
komponen lain (uang makan, potongan bahan rusak)?

### M3b — Purchasing

- Master supplier, daftar harga beli, termin pembayaran.
- Permintaan Pembelian (PR) dari kebutuhan bahan produksi/stok minimum.
- Purchase Order (PO) dengan approval berjenjang.
- Penerimaan barang (Goods Receipt) dengan pencocokan terhadap PO; selisih dicatat.
- Retur pembelian; invoice pembelian → hutang supplier di modul Finance.
- Laporan: outstanding PO, riwayat harga beli, evaluasi ketepatan kirim supplier.

### M3c — Warehouse & Inventory

- Multi-gudang: gudang bahan, gudang barang jadi, gudang tukang, stok titipan di toko.
- Penerimaan & pengeluaran barang, transfer antar gudang, mutasi stok.
- Kartu stok per item sampai level varian **artikel × nomor × warna**.
- Stok opname berkala + penyesuaian selisih (dengan approval).
- Penilaian persediaan (FIFO/Average — disepakati saat analisis) terhubung ke jurnal persediaan.
- Peringatan stok minimum / reorder point.

❓ Konfirmasi: metode penilaian persediaan yang dipakai saat ini (FIFO atau Average)?

### M4 — Distribusi & Sales

- Stok jadi milik kita dipasarkan ke toko-toko.
- Setiap pengiriman mencatat: **sales siapa**, **dikirim kemana**, ekspedisi, ongkir.
- Dokumen: SO → Surat Jalan (DO) → Invoice → Pembayaran/Piutang.
- Dukungan **jual putus** dan **konsinyasi** (barang titip, dibayar setelah laku).
- Retur penjualan (barang rusak / tidak laku / salah nomor).
- Komisi sales dihitung dari penjualan/penagihan sesuai skema.
- Laporan: penjualan per sales, per toko, per area, per artikel/nomor/warna.

### M5 — POS Toko

POS dapat berdiri sendiri **atau** tersambung (nempel) ke sistem pusat.

- Kasir dioperasikan oleh **pihak toko**; transaksi penjualan eceran ke konsumen.
- Pusat melakukan **monitoring barang kita** yang ada di toko tersebut
  (stok titipan, laku berapa, sisa berapa) secara real-time saat online.
- **Mode offline**: POS tetap bisa transaksi saat internet mati, lalu sinkron
  otomatis saat kembali online.
- **SPG** ditempatkan di toko: input penjualan, stok opname harian, laporan display.
- Rekap konsinyasi otomatis: penjualan POS → dasar tagihan ke toko.
- Cetak struk, shift kasir, tutup kasir harian.

❓ Konfirmasi: berapa titik toko/POS di tahap awal, dan perangkatnya
(Android tablet / PC kasir / printer thermal)?

### M6 — Finance & Accounting

- **Chart of Account (CoA)** berjenjang + input **Opening Balance** saldo awal.
- Transaksi kas & bank: Cash Receipt, Cash Disbursement, Bank Receipt, Bank Disbursement, Cash/Bank Transfer.
- Jurnal: General Journal, Adjustment Journal, Memorial Journal.
- Giro: Receipt Giro, Send Giro, beserta Receipt/Send Giro Clearing (kliring).
- Memo: Receipt Memo, Send Memo.
- **FX Revaluation** — revaluasi saldo mata uang asing.
- Laporan keuangan: Buku Besar, Neraca Saldo, Neraca, Laba Rugi, Arus Kas, kartu hutang & piutang.
- Integrasi otomatis: invoice penjualan → piutang, hutang ongkos tukang, pembelian bahan → hutang, HPP produksi → persediaan.

❓ Konfirmasi: apakah perlu multi-currency penuh, dan apakah ada periode akuntansi
berjalan yang harus dimigrasi (saldo awal per tanggal cut-off)?

### M7 — Absensi (Admin, SPG, Sales)

- Absensi masuk/pulang untuk **admin** (kantor), **SPG** (di toko), **sales** (lapangan).
- Metode: selfie + **GPS / geofence** (SPG terkunci di lokasi toko, sales mobile),
  admin bisa via kantor.
- Jadwal & shift, izin/cuti, lembur, keterlambatan.
- Sales: kunjungan (check-in di toko) terhubung ke order yang dibuat.
- Rekap jam kerja untuk dasar payroll & tunjangan kehadiran.
- Laporan kehadiran per orang / per lokasi / per periode.

---

## 4. Peran & Hak Akses

| Peran | Akses utama |
| --- | --- |
| Owner / Manajemen | Dashboard, semua laporan |
| Finance / Akuntansi | CoA, kas/bank, jurnal, giro, laporan keuangan |
| Admin Kantor | Master data, order, invoice, absensi |
| Kepala Produksi | WO, BOM, SPK tukang, hasil produksi |
| Gudang | Terima/keluar bahan & barang jadi, transfer, stok opname |
| Purchasing | Supplier, PR, PO, penerimaan barang, retur beli |
| Sales | Katalog, order, kunjungan, piutang toko sendiri |
| SPG | Absensi, penjualan toko, stok opname toko |
| Kasir Toko | POS saja |
| Tukang (opsional) | Lihat SPK & setoran sendiri |

## 5. Laporan Wajib

- Stok per artikel × nomor × warna (gudang, tukang, toko).
- Kartu stok & mutasi bahan.
- Outstanding SPK tukang & saldo bahan di tukang.
- Penjualan per sales / toko / area / periode.
- Penjualan POS & rekap konsinyasi per toko.
- Piutang & umur piutang.
- HPP dan margin per artikel.
- Rekap absensi & kehadiran.
- Buku Besar, Neraca Saldo, Neraca, Laba Rugi, Arus Kas.

## 6. Non-Fungsional

- Web-based, responsif (dipakai di HP untuk sales & SPG).
- POS mendukung mode offline-first + sinkronisasi.
- Multi-user dengan hak akses berjenjang.
- Audit trail untuk transaksi stok dan keuangan.
- Backup database terjadwal.
- Export laporan ke Excel/PDF.

## 7. Di Luar Lingkup (kecuali diminta)

- Payroll penuh (sistem hanya menyediakan data jam kerja).
- Integrasi marketplace (Shopee/Tokopedia).
- Aplikasi mobile native (dipakai web mobile).

## 8. Pertanyaan Terbuka

1. Harga berbeda per nomor/size?
2. Order online perlu payment gateway?
3. Skema bayar tukang detailnya?
4. Jumlah titik POS & perangkatnya?
5. Berapa user aktif per peran?
6. Hosting: cloud kami atau server klien?
7. Ada data master lama (Excel) untuk dimigrasi?
