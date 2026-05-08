# Jawaban atas Feedback & Pertanyaan Klien — Althea Psychology

**Tanggal:** 7 Mei 2026
**Paket:** Standard
**Re:** Feedback prototype + 9 pertanyaan tambahan

Terima kasih atas konfirmasi pengambilan paket Standard dan masukannya. Berikut tanggapan kami, dibagi menjadi dua bagian: (A) konfirmasi 9 poin penyesuaian prototype dan (B) jawaban 9 pertanyaan.

---

## A · Konfirmasi 9 Poin Penyesuaian Prototype

Semua poin **bisa kami akomodasi di paket Standard** tanpa biaya tambahan dan sudah kami refleksikan ke prototype (silakan review ulang artboard yang relevan).

| # | Permintaan | Status | Keterangan / Tempat di Prototype |
|---|---|---|---|
| 1 | Notifikasi WA otomatis ke psikolog **dan** klien saat reschedule / cancel | ✅ Sudah | Dialog *Reschedule* & *Batalkan sesi* — bagian "Notifikasi WhatsApp otomatis · 2 penerima" dengan rincian status pengiriman & retry. |
| 2 | Auto-unblock kuota psikolog setelah cancel/reschedule (dari 4 klien penuh, langsung jadi 3) | ✅ Sudah | Halaman *Tim Psikolog* — badge "hari ini X/4" + label "slot baru terbuka" pada psikolog yang baru dapat cancel. Banner BR-01 di atas daftar menjelaskan mekanismenya. |
| 3 | Admin dapat menjadwalkan klien baru di **psikolog & ruangan yang sama** pada slot yang baru saja kosong | ✅ Sudah | Dialog *Batalkan sesi* — kotak "Otomatis setelah pembatalan" menjelaskan slot psikolog + ruangan langsung bebas dan bisa diisi klien lain tanpa pindah ruangan. |
| 4 | Admin dapat **edit layanan** klien terjadwal tanpa kirim WA (silent edit) | ✅ Sudah | Dialog *Detail Sesi* — tombol "Ubah" pada baris **Layanan**, dengan penjelasan: ubah layanan = edit silent, tidak trigger WA. Reschedule/batal tetap kirim WA otomatis. |
| 5 | Form klien hanya: **nama, jenis kelamin, layanan, umur, nomor rekam medis, no. WA** — semua wajib | ✅ Sudah | Dialog *Tambah Klien Baru* + langkah "Klien baru" di Booking Wizard — semua field di-set required, kolom nama panggilan / tanggal lahir / email / alamat / keluhan dihapus. |
| 6 | Halaman *Pemakaian Ruangan* disamakan dengan *Jadwal Hari Ini*: baris = jam, kolom = ruangan, sel = nama psikolog dengan warna unik | ✅ Sudah | Halaman *Pemakaian Ruangan* di-redesign penuh — grid baru dengan psikolog ber-warna unik per sel. Legend warna psikolog ada di header kartu. |
| 7 | Tampilan landing role **Owner & Admin** ditambah grid Pemakaian Ruangan (read-only) untuk cari ruangan kosong cepat | ✅ Sudah | Owner Dashboard: kartu baru "Pemakaian Ruangan · Slot × Ruangan (read-only)". Admin Jadwal Hari Ini: kartu read-only di bawah grid penjadwalan utama. |
| 8 | Nama 4 ruangan konseling: **Sky Room, Sage Room, Forest Room, Sunset Room** | ✅ Sudah | Diterapkan di seluruh aplikasi (data, jadwal, dialog, mobile). |
| 9 | Nama ruangan konseling besar: **Mint Room** | ✅ Sudah | Diterapkan di seluruh aplikasi. |

---

## B · Jawaban 9 Pertanyaan

### 1. Berapa besar kemungkinan website error/down? Penyebabnya apa? Berapa lama perbaikannya?

**Target uptime kami: 99,5% per bulan** (artinya potensi downtime sekitar 3,5 jam/bulan terdistribusi dalam beberapa kejadian kecil). Berdasarkan track record website-website klien lain pada skala dan kompleksitas serupa, ini realistis untuk dicapai.

Penyebab umum & perkiraan durasi perbaikan:

| Kategori | Frekuensi tipikal | Durasi perbaikan |
|---|---|---|
| Hosting / server provider down (di luar kendali kami) | 1–2× per tahun | 30 menit – 1 jam (tergantung provider) |
| Bug pada fitur baru pasca-update | 0–1× per bulan di awal, menurun setelahnya | 15 menit – 1 jam (deploy hotfix) |
| WhatsApp gateway gangguan (Meta/WA Business API) | 1–3× per tahun | 30 menit – 1 jam (di luar kendali kami; sistem retry otomatis) |
| Database lambat / penuh storage | sangat jarang dengan monitoring | 1–2 jam |
| Domain/SSL certificate kedaluwarsa | tidak terjadi jika auto-renew aktif | 15 menit jika terjadi |

**Yang kami lakukan untuk memperkecil risiko:**
- Backup harian otomatis (database)
- Auto-renewal SSL & domain
- Staging environment untuk uji setiap update sebelum naik ke production

Jika ada down, kami atau pihak althea bisa follow up via WA group.

### 2. Tambahan **Export PDF/Excel** + **Support & Maintenance** di paket Standard — biaya tambahan berapa?

Kedua add-on ini bisa kami sediakan. Estimasi awal (akan kami konfirmasi final di proposal teknis terpisah, sekali lagi — bukan invoice):

| Add-on | Lingkup | Estimasi biaya |
|---|---|---|
| **Export PDF/Excel** | Modul export untuk: daftar klien, jadwal harian/mingguan, laporan layanan/psikolog. PDF rapi untuk print, Excel untuk olah data. | One-time fee,  tergantung jumlah laporan yang ingin di-export. |
| **Support & Maintenance** | Bug-fix, monitoring 24/7, backup harian, update minor, response time SLA 4 jam jam kerja, satu kontak person dari tim kami. | **Bulanan**,  tergantung intensitas. Bisa 6 atau 12 bulan kontrak (diskon untuk 12 bulan). |

Kalau diambil paket bundling (Export + Support 12 bulan), biasanya kami berikan diskon. Kami akan kirim breakdown final via dokumen terpisah setelah Bapak/Ibu konfirmasi.

### 3. Website ini compatible untuk device apa saja?

Website kami buat **responsive** — satu codebase, otomatis menyesuaikan layar. Yang sudah dites:

- **Desktop / Laptop**: Chrome. Layar 13"–27".
- **HP**: iPhone (Safari), Android (Chrome).

Yang **tidak** kami support: Internet Explorer (sudah end-of-life), browser yang sangat lama (>4 tahun).

Khusus untuk mobile, semua fitur penjadwalan, daftar klien, notifikasi WA — bisa dibuka penuh dari HP via browser (lihat artboard *Mobile · Admin Klinik* di prototype).

### 4. Penjelasan detail tiap laman — di training, atau ada booklet panduan?

**Hanya ada training** (tanpa booklet panduan tertulis). Penjelasan detail tiap laman akan disampaikan langsung di sesi training, sambil walk-through aplikasi.

**Sesi Training Langsung** — 1× sesi 2 jam (offline atau online), kami walk-through tiap laman aplikasi sambil hands-on. Tim Anda bisa tanya jawab langsung selama sesi.

**Tentang batasan revisi (max 2×):** revisi yang ditemukan **sebelum sign-off (UAT)** tidak terhitung sebagai revisi paket. Hitungan dimulai setelah sign-off dilakukan. Kami sengaja bagi delivery ke beberapa milestone dengan UAT di tiap akhir, supaya hampir semua catatan ketangkap di fase UAT (bukan setelah training).

### 5. Mobile app — apakah include di paket Standard? Bisa untuk penjadwalan? Web atau download di App Store?

**Yang include di paket Standard:**
- **Web app responsive** yang bisa dibuka di browser HP (Chrome/Safari). Ini yang Anda lihat di artboard *Mobile · Admin* dan *Mobile · Psikolog* di prototype.
- Penjadwalan **bisa** dilakukan dari HP via browser — admin bisa lihat jadwal, daftar klien, status ruangan, log WA. Untuk *jadwalkan klien baru* dari HP, alurnya lebih ringkas dari versi desktop tapi tetap lengkap.
- Bisa ditambahkan ke home screen HP (Add to Home Screen) sehingga terasa seperti aplikasi (PWA — Progressive Web App). Icon di home screen, full-screen.

**Yang TIDAK include (perlu paket terpisah / add-on):**
- Native app yang di-download di App Store / Play Store. Itu butuh akun developer Apple/Google + proses review yang berbeda. Estimasi development sekali bayar (di luar fee tahunan App Store/Google Play sekitar 1,6 juta/tahun). Kami sarankan ambil ini hanya jika ada use case spesifik (misal: butuh push notification native, akses kamera, integrasi kontak HP).

Untuk awal, **PWA dari paket Standard biasanya cukup** — fungsionalnya 90% sama dengan native app untuk use case klinik psikologi.

### 6. Paket Standard — notifikasi otomatis ke klien atau hanya ke psikolog?

**Ke keduanya** — klien dan psikolog.

### 7. Status WA "gagal" — apa artinya?

Status pengiriman WA ada 4 level:

| Status | Arti |
|---|---|
| **Terkirim** | Pesan sudah masuk antrian WA gateway, server kami sudah selesai dengan tugasnya. |
| **Sampai** | Pesan sudah ada di chat list klien (centang abu-abu di WA). |
| **Dibaca** | Klien sudah buka dan baca pesan (centang biru di WA). |
| **Gagal** | Pesan **tidak bisa dikirim**. Sistem sudah retry otomatis 3× dengan jeda 5 menit. |

Penyebab "gagal" yang paling sering:
1. Nomor WA tidak aktif / tidak terdaftar di WhatsApp (~80% kasus).
2. Klien block nomor WA klinik.
3. WhatsApp gateway sedang gangguan

Apa yang admin lakukan kalau melihat "gagal"?
- Cek nomor WA klien — apakah typo / sudah ganti nomor.
- Hubungi klien manual (telp atau SMS) untuk pemberitahuan jadwal.
- Update nomor WA di profil klien jika perlu.

### 8. Bisa ditambah bukti pembayaran otomatis + WA setelah sesi (terima kasih + feedback + bukti pembayaran)?

**Bisa**, dan ini termasuk fitur yang sering kami buatkan untuk klinik. Lingkup:

1. **Bukti pembayaran otomatis (PDF)** dengan logo Althea, nomor invoice, nama klien, layanan, tanggal sesi, jumlah, status (lunas/cicilan).
2. **WA otomatis setelah sesi selesai** berisi:
   - Ucapan terima kasih (template bisa di-edit).
   - Link feedback singkat (skala 1–5 + kolom komentar opsional).
   - Bukti pembayaran (PDF terlampir di pesan WA — atau link untuk download).

tergantung kompleksitas template bukti pembayaran (apakah perlu cabang multi-format, sertifikasi, dll). Termasuk integrasi dengan template WA dan storage PDF.

Akan kami konfirmasi lingkup pasti dan biaya final di proposal teknis terpisah jika Bapak/Ibu mau lanjut dengan add-on ini.

### 9. Fitur "berlangsung / akan datang / antar ke ruangan / menunggu" di laman resepsionis — siapa yang bisa edit? Apakah owner/admin/psikolog bisa lihat?

**Edit (mengubah status):**
- ✅ **Resepsionis** — full edit. Tugas utama mereka.
- ✅ **Admin** — full edit (sebagai backup jika resepsionis tidak ada).
- ❌ **Owner** — hanya lihat (view only).
- ❌ **Psikolog** — hanya lihat di Dashboard mereka (untuk tahu klien sudah datang atau belum), tidak bisa ubah status.

**Lihat (read-only):**
- ✅ Owner — lihat di dashboard owner sebagai bagian dari "klien hari ini".
- ✅ Admin — lihat di halaman Penjadwalan utama (status klien muncul di kartu booking).
- ✅ Psikolog — lihat di dashboard pribadi mereka — kolom "klien sudah check-in / menunggu di lobby / sedang berlangsung".

Jadi flow real-nya: Resepsionis update status saat klien datang → semua role yang relevan langsung lihat update (real-time), tanpa harus refresh manual.

---

## Langkah berikutnya

1. Bapak/Ibu review prototype yang sudah di-update (akses link sama dengan sebelumnya, refresh halaman).
2. Konfirmasi balik:
   - Apakah 9 poin penyesuaian sudah sesuai ekspektasi?
   - Apakah jawaban 9 pertanyaan cukup, atau ada follow-up?
3. Setelah konfirmasi, kami siapkan dokumen teknis terpisah untuk add-on yang Bapak/Ibu pilih (Export PDF/Excel, Support & Maintenance, Bukti Pembayaran + WA setelah sesi). Dokumen itu mencantumkan biaya final dan lingkup pekerjaan, tapi bukan tagihan — hanya proposal teknis.

Silakan kabari kalau ada yang perlu diklarifikasi lebih lanjut.

— Tim Althea Psychology App
