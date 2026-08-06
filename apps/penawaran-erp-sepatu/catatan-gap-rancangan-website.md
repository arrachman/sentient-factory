# CATATAN KLARIFIKASI LINGKUP PENAWARAN

**Nomor**: ADD-SPT-2026-0001
**Tanggal**: 6 Agustus 2026
**Lampiran dari**: Sales Quotation No. SQ-SPT-2026-0001
**Kepada Yth.**: Bapak Anil — Jl. Terusan Dieng, Malang, Jawa Timur
**Perihal**: Hal-hal yang belum tercakup dalam penawaran, merujuk dokumen
*"Rancangan Website"* yang Bapak sampaikan

---

Dengan hormat,

Setelah kami pelajari dokumen **"Rancangan Website"** yang Bapak sampaikan dan
membandingkannya dengan lingkup pekerjaan pada Sales Quotation No.
SQ-SPT-2026-0001, kami menemukan sejumlah kebutuhan yang tercantum dalam dokumen
tersebut namun **belum tercakup** dalam nilai penawaran Rp 210.000.000.

Kami sampaikan hal ini di awal — sebelum kontrak ditandatangani — agar tidak
menjadi persoalan di tengah pelaksanaan proyek. Setiap butir di bawah ini
memerlukan keputusan Bapak: **masuk ke lingkup** (dengan penyesuaian nilai dan
jadwal), atau **dikeluarkan** dari tahap pertama.

---

## 1. Integrasi Payment Gateway — perhatian utama

Dokumen Rancangan Website mencantumkan alur **Keranjang → Checkout → Pembayaran**
serta peran **Admin Pembayaran** (memverifikasi pembayaran pelanggan,
mengonfirmasi pembayaran berhasil, menangani pembayaran gagal atau belum
terkonfirmasi).

Pada penawaran saat ini, modul E-Katalog & Order **belum mencakup integrasi
payment gateway**. Yang tersedia baru pencatatan pembayaran secara manual
(transfer + konfirmasi admin).

Integrasi payment gateway yang sesungguhnya mencakup pekerjaan berikut:

| Komponen | Keterangan |
| --- | --- |
| Pendaftaran & aktivasi merchant | Midtrans / Xendit / Doku — perlu dokumen legal usaha |
| Metode pembayaran | Virtual Account, QRIS, e-wallet, kartu kredit |
| Callback / webhook | Penerimaan notifikasi status bayar dari provider, verifikasi tanda tangan digital, penanganan notifikasi ganda |
| Rekonsiliasi | Pencocokan otomatis pembayaran masuk dengan pesanan |
| Penanganan status | Pending, kedaluwarsa, gagal, batal, dan pengembalian dana (*refund*) |
| Halaman & notifikasi | Halaman status pembayaran untuk pembeli beserta pemberitahuannya |

**Yang perlu Bapak putuskan:**

1. Apakah pembayaran online benar-benar diperlukan pada tahap pertama, atau cukup
   transfer manual dengan verifikasi oleh Admin Pembayaran?
2. Bila diperlukan, penyedia mana yang dipilih?
3. Siapa yang mengurus pendaftaran merchant — pihak Bapak atau kami dampingi?

**Perlu diketahui:** setiap transaksi melalui payment gateway dikenakan biaya
potongan oleh penyedia (umumnya berkisar 0,7%–2,9% per transaksi, tergantung
metode pembayaran). Biaya ini **ditanggung pihak klien** dan berada di luar nilai
penawaran. Proses verifikasi merchant juga memakan waktu 1–3 minggu dan berada di
luar kendali kami — hal ini berpengaruh pada jadwal go-live.

---

## 2. Integrasi Pihak Ketiga Lainnya

### a. Ekspedisi / Kurir

Dokumen Rancangan Website meminta: **cetak label pengiriman**, **nomor resi**,
**pembaruan status pengiriman secara real-time**, dan **pelacakan oleh pembeli**.

Pada penawaran saat ini (Ketentuan butir 5), integrasi ekspedisi **dikecualikan** —
sistem hanya mencatat nama ekspedisi, nomor resi, dan ongkos kirim secara manual.

Terdapat tiga tingkatan yang perlu dipilih:

1. **Manual** — admin memasukkan nomor resi, pembeli melacak di situs kurir.
   *(sesuai penawaran saat ini)*
2. **Semi-otomatis** — cek ongkos kirim & pembuatan resi melalui agregator
   (RajaOngkir, Biteship, Shipper). *(belum tercakup)*
3. **Penuh** — multi-kurir, permintaan penjemputan, pelacakan otomatis via webhook.
   *(belum tercakup)*

### b. QRIS & Mesin EDC pada POS

Dokumen menyebut metode pembayaran **Tunai, Transfer, QRIS, Debit/Kredit** di kasir.

- **QRIS statis** (satu QR ditempel di meja kasir, rekonsiliasi manual) — dapat
  diakomodasi tanpa integrasi.
- **QRIS dinamis** (QR muncul per transaksi dengan nominal otomatis) — memerlukan
  integrasi ke *acquirer*. **Belum tercakup.**
- **Mesin EDC debit/kredit** — umumnya tidak terhubung ke sistem; kasir memasukkan
  nomor persetujuan secara manual. Integrasi langsung ke mesin EDC memerlukan SDK
  dari bank penerbit dan proses persetujuan tersendiri di pihak bank. **Belum
  tercakup.**

### c. Perpajakan / e-Faktur

Dokumen mencantumkan peran **Admin Pajak** (input pajak pengeluaran, retur pajak,
arsip laporan bulanan) serta pembedaan **harga pajak vs non-pajak**.

Perlu ditegaskan tingkat kebutuhannya:

- **Perhitungan PPN internal** + cetak faktur dari sistem sendiri — cakupan
  moderat, dapat ditambahkan.
- **Integrasi ke Coretax / e-Faktur DJP** — memerlukan sertifikat elektronik,
  format pertukaran data resmi, dan penyesuaian berkelanjutan mengikuti perubahan
  regulasi. **Belum tercakup**, dan merupakan butir dengan ketidakpastian jadwal
  tertinggi.

### d. Notifikasi WhatsApp / SMS

Pelacakan pesanan dan pemberitahuan status kepada pembeli akan jauh lebih efektif
melalui WhatsApp. Terdapat dua jalur layanan yang dapat dipilih:

- **Jalur tidak resmi** — menggunakan penyedia layanan pihak ketiga dengan biaya
  berlangganan bulanan. Jalur ini tidak berafiliasi resmi dengan Meta sehingga
  memiliki risiko pembatasan atau pemblokiran nomor oleh WhatsApp.
- **Jalur resmi (WhatsApp Business Platform)** — memerlukan verifikasi bisnis oleh
  Meta dan persetujuan templat pesan. Biaya layanan dikenakan berdasarkan jumlah
  pesan yang dikirim sesuai tarif Meta dan/atau penyedia resmi.

Biaya berlangganan maupun biaya per pesan ditanggung pihak klien. Integrasi
notifikasi WhatsApp/SMS **belum tercakup** dalam nilai penawaran.

### e. Peta & Geolokasi (Absensi)

Absensi berbasis GPS/geofence, termasuk penggunaan koordinat, radius lokasi, dan
kebutuhan peta/geolokasi yang berkaitan dengan proses absensi, **sudah tercakup**
dalam nilai penawaran.

---

## 3. Kebutuhan Fungsional yang Belum Tercakup

Di luar integrasi pihak ketiga, terdapat kebutuhan berikut pada dokumen Rancangan
Website yang belum masuk lingkup penawaran:

| No | Kebutuhan | Sumber di dokumen Bapak |
| --- | --- | --- |
| 1 | **Penggajian penuh** — perhitungan gaji, bonus & insentif, potongan, lembur, dan **cetak slip gaji** | Modul HR — Penggajian |
| 2 | **Modul perpajakan** — pajak pengeluaran, retur pajak, pengeluaran kelilingan sales, arsip laporan bulanan | Peran Admin Pajak |
| 3 | **Skema komisi mitra berjenjang** — Affiliate 10%, Dropship 14%, Reseller 19%, Agen 24%, masing-masing dengan minimum order | Tabel Jenis Kerjasama |
| 4 | **Empat tingkat harga jual** — Grosir, Pajak, Non-pajak, Konsumen | Tabel Jenis Harga |
| 5 | **Jenis pelanggan berjenjang** — Konsumen, Affiliate, Dropship, Reseller, Agen | Data Customer |
| 6 | **Target Order harian sales** Rp 8.000.000/hari beserta pemantauan pencapaian | Data Sales |
| 7 | **Pembelian produk impor** | Modul Pembelian |

Perlu kami sampaikan secara terbuka bahwa butir **nomor 1 (Penggajian)** saat ini
**dinyatakan di luar lingkup** pada dokumen Requirement kami — sistem hanya
menyediakan data jam kerja sebagai dasar perhitungan. Karena dokumen Bapak
memintanya secara eksplisit, butir ini perlu diselaraskan sebelum kontrak berjalan.

---

## 4. Usulan Langkah Selanjutnya

Kami mengusulkan satu sesi pembahasan untuk menyepakati:

1. **Integrasi mana yang masuk tahap pertama** — terutama payment gateway,
   ekspedisi, dan perpajakan.
2. **Status modul Penggajian** — masuk lingkup atau tetap dikecualikan.
3. **Penyesuaian nilai dan jadwal** apabila butir-butir di atas ditambahkan.

Setelah kesepakatan tercapai, kami akan menerbitkan **penawaran revisi** dengan
lingkup dan nilai yang telah disesuaikan.

Perlu kami tekankan bahwa **jadwal 4 (empat) bulan** pada penawaran saat ini
disusun berdasarkan lingkup yang tercantum di dalamnya. Penambahan integrasi
pihak ketiga akan memperpanjang jadwal, terutama karena proses verifikasi merchant
dan persetujuan dari penyedia layanan berada di luar kendali kami.

Demikian catatan ini kami sampaikan sebagai bentuk keterbukaan sejak awal. Kami
berpandangan lebih baik menyelaraskan harapan di depan daripada menemui perbedaan
di tengah pelaksanaan.

Hormat kami,

**PT. Tarik Data Digital**

Fatchur Rachman — Founder
fatchur@tarikdata.digital · WA 0857-3524-8244
