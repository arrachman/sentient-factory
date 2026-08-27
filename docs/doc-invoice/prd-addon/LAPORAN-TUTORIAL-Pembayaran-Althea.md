# Pembaruan Sistem Althea Psychology — Invoice & Bukti Pembayaran

**Untuk:** Klinik Althea Psychology (Bu Vina)
**Dari:** Tim Pengembang — PT. Tarik Data Digital
**Tanggal:** 20 Juni 2026
**Modul:** Add-on 2 — Sistem Pembayaran (Invoice & Bukti Pembayaran + Cicilan) · SQ-ALT-2026-0002

---

## 1. Ringkasan Singkat

Fitur **pembayaran** sudah selesai dipasang di sistem dan **siap dipakai**. Sekarang admin/resepsionis
bisa membuat **Invoice** (tagihan) dan **Bukti Pembayaran** (receipt) langsung dari aplikasi, dengan
tampilan **persis seperti contoh desain yang Ibu kirim**, lalu mengirimnya ke klien lewat WhatsApp
dalam bentuk **lampiran PDF**.

Singkatnya, sekarang bisa:

- ✅ Membuat **Bukti Pembayaran** & **Invoice** dengan rincian item bebas (Fee Psikolog, Tester,
  Terapis, After Hour, Fee Althea, dll).
- ✅ Mencatat **pembayaran penuh maupun cicilan** (nominal bebas) — otomatis menghitung
  **Total / Terbayar / Belum Terbayar**.
- ✅ Status pembayaran: **Lunas**, **Cicil 50%**, **Cicil Khusus**, **Belum Bayar**.
- ✅ **Mengirim ke WhatsApp klien** (lampiran PDF) + ucapan terima kasih & permintaan feedback.
- ✅ **Riwayat transaksi & rekap pembayaran per klien** di halaman detail tiap klien.
- ✅ Mengisi **default fee per layanan** supaya pengisian invoice lebih cepat (otomatis terisi,
  tetap bisa diubah).

---

## 2. Laporan Pengerjaan

### Yang sudah selesai & terpasang

| Item | Status |
|------|:------:|
| Dokumen Invoice & Bukti Pembayaran tampil **100% mirip contoh desain Althea** | ✅ Selesai |
| Rincian item fleksibel (Fee Psikolog/Tester/Terapis/After Hour/Althea/dll) | ✅ Selesai |
| Cicilan nominal bebas + tracking Total / Terbayar / Belum Terbayar | ✅ Selesai |
| Status Lunas / Cicil 50% / Cicil Khusus / Belum Bayar | ✅ Selesai |
| Default fee per layanan (otomatis terisi saat buat dokumen) | ✅ Selesai |
| Generate **PDF** otomatis (logo & branding Althea + nomor dokumen) | ✅ Selesai |
| Kirim Invoice/Bukti Pembayaran via **WhatsApp (lampiran PDF)** | ✅ Selesai |
| Riwayat transaksi & rekap pembayaran **per klien** | ✅ Selesai |
| Menu **Pembayaran** baru + ringkasan status di dashboard | ✅ Selesai |

Sudah kami uji: membuat 1 contoh untuk **keempat case** yang Ibu kirim, dan hasil PDF-nya sudah
diperiksa sesuai desain (header, tabel, total, metode pembayaran, "TERIMAKASIH").

### Catatan penomoran dokumen

- **Invoice** bernomor `INV-2026-0001`, `INV-2026-0002`, dst.
- **Bukti Pembayaran** bernomor `RCP-2026-0001`, `RCP-2026-0002`, dst.

(Penomoran berjalan otomatis & berurutan per tahun.)

### Satu hal yang perlu tindakan Ibu (penting)

Saat proses pemasangan, **koneksi WhatsApp pengirim sempat terputus** dan perlu **disambungkan ulang
(scan QR sekali)**. Selama belum disambungkan, pengiriman WhatsApp (termasuk notifikasi lain) belum
jalan. Caranya ada di **Bagian 4 — Menyambungkan kembali WhatsApp** di bawah. Prosesnya hanya
sebentar (scan QR pakai HP WhatsApp klinik).

> Catatan: Fitur **Rekam Medis "refer" antar-psikolog** (Add-on 1) **tidak dikerjakan** sesuai
> keputusan Ibu sebelumnya — tetap mengikuti proposal awal.

---

## 3. Tutorial Penggunaan

> Yang bisa membuat & mengirim dokumen: **Admin** dan **Resepsionis**.

### 3.1. (Opsional tapi disarankan) Isi default fee per layanan

Supaya pengisian dokumen lebih cepat, isi dulu fee default untuk tiap layanan.

1. Masuk menu **Layanan** (sidebar kiri).
2. Klik **Edit** pada layanan yang diinginkan.
3. Isi **Default Fee Psikolog (Rp)** dan **Default Fee Althea (Rp)**.
4. **Simpan.**

Nanti saat membuat dokumen dari sebuah booking, kedua fee ini **otomatis terisi** (tetap bisa diubah
per transaksi).

---

### 3.2. Membuat Bukti Pembayaran / Invoice

Ada **3 jalur** untuk membuat dokumen — pilih yang paling pas:

**A. Dari menu Pembayaran (paling umum)**
1. Buka menu **Pembayaran** (sidebar kiri).
2. Klik tombol **Buat Dokumen**.
3. Pilih jenis: **Bukti Pembayaran** atau **Invoice**.
4. Pilih **Klien**, isi **Judul layanan** (mis. `TERAPI ANAK LENGKAP`), dan **Tanggal**.
5. Tambah baris item lewat tombol cepat (**+ Fee Psikolog**, **+ Fee Tester**, dst) atau **+ Item
   kosong**. Isi **Keterangan**, **Jml**, dan **Harga satuan** tiap baris.
6. Isi **Metode pembayaran** (mis. `TRANSFER`, `QRIS`, `CASH`, atau `TRANSFER 50%`) dan **Status**.
7. Lihat **Preview di sebelah kanan** — tampilannya persis seperti dokumen yang akan dikirim.
8. (Opsional) Centang **"Kirim ke WhatsApp klien setelah simpan"** untuk langsung mengirim.
9. Klik **Simpan Dokumen**.

**B. Dari Detail Klien** (untuk case keringanan / cicilan khusus / 1 klien butuh keduanya)
1. Buka **Klien** → klik klien → di bagian **"Pembayaran & Transaksi"**.
2. Klik **Bukti Bayar** atau **Invoice** → form terbuka dengan klien sudah terpilih.

**C. Dari Detail Booking** (otomatis ambil data layanan)
1. Buka **Daftar Jadwal** → klik booking → tab **Pembayaran**.
2. Klik **Buat Bukti Pembayaran** / **Buat Invoice** → item **otomatis terisi** dari default fee
   layanan. Tinggal sesuaikan lalu simpan.

---

### 3.3. Contoh sesuai 4 case Althea

**Case 1 — Bukti Pembayaran "TERAPI ANAK LENGKAP" (cicilan)**
- Jenis: **Bukti Pembayaran**, Status: **Cicil 50%**, Metode: **TRANSFER 50%**.
- Item: Fee Terapis (75.000/sesi) × 10, Fee Psikolog × 1 (50.000), Fee Tester × 1 (90.000),
  Fee After Hour (40.000/sesi) × 10, Fee Althea Psychology × 1 (60.000).
- Isi **Terbayar awal** `500.000`. Sistem otomatis menampilkan **Total 1.350.000 · Terbayar 500.000
  · Belum Terbayar 850.000**.

**Case 2 — Invoice "TES TUMBUH KEMBANG ANAK" (tagihan)**
- Jenis: **Invoice**, Status: **Belum Bayar**, Metode: **QRIS**.
- Item: Fee Psikolog (150.000), Fee Tester (100.000), Fee Althea Psychology (50.000) → Total
  **300.000**. Cocok untuk klien online / yang dibayar sekolah/perusahaan.

**Case 3 — Bukti Pembayaran "KONSULTASI HASIL TES" (lunas)**
- Jenis: **Bukti Pembayaran**, Status: **Lunas**, Metode: **CASH**.
- Item: Fee Konsultasi Hasil Tes (100.000). Isi Terbayar `100.000` → Total **100.000**.

**Case 4 — Bukti Pembayaran "KONSELING DEWASA" (lunas)**
- Jenis: **Bukti Pembayaran**, Status: **Lunas**, Metode: **CASH**.
- Item: Fee Psikolog (120.000), Fee Althea Psychology (75.000) → Total **195.000**.

> **Catatan**: Bagian "Terbayar / Belum Terbayar" hanya muncul saat ada cicilan (sebagian dibayar).
> Kalau lunas atau belum dibayar sama sekali, dokumen hanya menampilkan **TOTAL** — sama seperti
> contoh desain Ibu.

---

### 3.4. Mencatat cicilan / pembayaran tambahan

Untuk klien yang membayar bertahap (mis. per pertemuan / per 2 pertemuan):

1. Buka dokumen (dari menu **Pembayaran** atau **Detail Klien**) → klik dokumennya.
2. Klik **Catat Pembayaran**.
3. Isi **nominal** (bebas — boleh kurang dari sisa tagihan), pilih **metode**, lalu **Simpan**.
4. Total **Terbayar** dan **Belum Terbayar** otomatis ter-update. Saat lunas, status otomatis jadi
   **Lunas**.

> **Cicil Khusus**: untuk klien dengan keringanan khusus, pilih status **Cicil Khusus** — ini hanya
> penanda di dashboard, perhitungan tetap mengikuti nominal yang dicatat.

---

### 3.5. Mengirim ke WhatsApp & mengunduh PDF

Di halaman dokumen tersedia tombol:
- **Kirim WA** → mengirim PDF dokumen ke WhatsApp klien + pesan otomatis (untuk bukti pembayaran:
  ucapan terima kasih + permintaan feedback; untuk invoice: pesan tagihan).
- **PDF** → membuka/mengunduh file PDF (bisa dicetak/disimpan).

> Syarat kirim WA: nomor WhatsApp klien terisi, klien tidak meng-opt-out WA, dan **device WhatsApp
> pengirim tersambung** (lihat Bagian 4).

---

### 3.6. Riwayat & rekap pembayaran per klien

1. Buka **Klien** → klik klien.
2. Lihat bagian **"Pembayaran & Transaksi"**: ringkasan **Total / Terbayar / Sisa** + daftar semua
   invoice & bukti pembayaran klien tersebut. Klik salah satu untuk membuka detailnya.

Untuk melihat **semua** dokumen lintas klien + ringkasan status (Lunas / Cicilan / Belum Bayar),
gunakan menu **Pembayaran**.

---

## 4. Menyambungkan Kembali WhatsApp (sekali saja)

Lakukan ini **sekali** supaya pengiriman WhatsApp aktif kembali:

1. Buka **Pengaturan → Notifikasi WA**.
2. Pada bagian koneksi, klik **Sambungkan device WA** → akan muncul **QR Code**.
3. Buka **WhatsApp di HP klinik** → **Perangkat Tertaut (Linked Devices)** → **Tautkan Perangkat** →
   **scan QR** di layar.
4. Tunggu sampai status berubah menjadi **Tersambung**.
5. Pastikan **"Aktifkan kirim WA"** dalam keadaan **menyala** bila ingin notifikasi otomatis juga aktif.

Setelah tersambung, coba **Kirim WA** dari salah satu dokumen untuk memastikan lampiran PDF terkirim.

---

## 5. Tanya–Jawab Singkat

**Apakah 1 klien bisa dapat Invoice lalu Bukti Pembayaran?**
Bisa. Buat **Invoice** saat menagih, lalu buat **Bukti Pembayaran** setelah klien membayar.

**Apakah Invoice dikirim otomatis?**
Tidak. **Invoice dikirim manual** (lewat tombol Kirim WA) — cocok untuk klien online / yang dibayar
sekolah/perusahaan. Untuk klien reguler cukup **Bukti Pembayaran**, dan bisa dicentang agar terkirim
otomatis setelah disimpan.

**Apakah nominal cicilan harus pas 25% / 50%?**
Tidak. Nominal **bebas** — sistem mencatat angka yang benar-benar dibayar, bukan persen kaku.

**Apakah fee bisa berbeda tiap transaksi?**
Bisa. Default fee hanya untuk mempercepat pengisian; semua angka tetap bisa diubah saat membuat
dokumen.

---

Bila ada yang ingin disesuaikan (teks pesan WhatsApp, tata letak, atau kebutuhan lain), silakan
sampaikan — kami bantu sesuaikan. Terima kasih. 🙏

*PT. Tarik Data Digital — Tim Pengembang Aplikasi Althea Psychology*
