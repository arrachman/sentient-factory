# Prompt untuk Claude Design — Prototype Sistem Informasi Terpadu Yayasan

> Cara pakai: buka https://claude.ai/design → salin **seluruh isi antara garis "SALIN MULAI DARI SINI" dan "SALIN SAMPAI DI SINI"** → paste sebagai pesan pertama.
> Bagian di bawahnya (Prompt Lanjutan) dipakai belakangan untuk menyempurnakan hasil.

---

## ===== SALIN MULAI DARI SINI =====

Buatkan **prototype web app interaktif** bernama **SIMTERPADU** — Sistem Informasi Manajemen Terpadu untuk sebuah yayasan pendidikan Islam yang menaungi beberapa unit sekaligus. Buat dalam Bahasa Indonesia, siap didemokan ke pengurus yayasan.

### 1. Profil Organisasi

**Yayasan Pendidikan Islam Nurul Hikmah** — berdiri 1998, Kabupaten Jember, Jawa Timur. Menaungi 4 unit:

| Unit | Ringkasan |
|---|---|
| **SMP Islam Nurul Hikmah** | 312 siswa, 12 rombel (kelas 7–9), Kurikulum Merdeka, NPSN 20521477 |
| **MA Nurul Hikmah** | 248 siswa, 9 rombel (kelas 10–12), jurusan IPA / IPS / Keagamaan, di bawah Kemenag |
| **Pondok Pesantren Nurul Hikmah** | 460 santri mukim (250 putra, 210 putri), 6 asrama, program Tahfidz & Kitab Kuning, 24 ustadz/ustadzah |
| **Poskestren (Pos Kesehatan Pesantren)** | 1 perawat tetap, 2 dokter kunjung (Selasa & Jumat), 12 kader Santri Husada, ruang rawat 6 bed |

**Fakta penting yang harus tercermin di sistem:** sebagian besar santri pondok juga siswa SMP/MA (data orang harus **satu identitas, banyak peran**) — jangan buat data terpisah-pisah. Ada juga santri yang sekolah di luar, dan siswa SMP/MA yang tidak mondok (santri kalong).

### 2. Pengguna & Hak Akses

1. **Ketua Yayasan** — melihat semua unit, fokus ringkasan & keuangan
2. **Kepala SMP / Kepala MA** — akademik unit masing-masing
3. **Pengasuh / Lurah Pondok** — kepesantrenan, asrama, perizinan
4. **Petugas Poskestren** — rekam kesehatan santri
5. **Bendahara Yayasan** — SPP, syahriyah, tunggakan
6. **Wali Santri** — portal terbatas (tampilan mobile)

Sediakan **role switcher** di pojok kanan atas agar demo bisa berpindah peran, dan menu sidebar ikut berubah sesuai peran.

### 3. Layar yang Harus Dibuat

**A. Halaman Publik**
1. **Landing page yayasan** — hero, 4 kartu unit, angka statistik, alur PPDB, testimoni alumni, agenda, footer lengkap
2. **Halaman profil unit** (1 contoh saja, untuk Pondok Pesantren) — sejarah, program, jadwal harian santri, fasilitas, galeri
3. **Formulir PPDB Online** — multi-step (Data Diri → Asal Sekolah → Pilih Unit & Program → Berkas → Ringkasan), dengan progress bar dan validasi
4. **Halaman cek status pendaftaran** — input nomor pendaftaran, tampilkan timeline status

**B. Dashboard Internal**
5. **Halaman Login** — pilihan masuk sebagai staf atau wali santri
6. **Dashboard Yayasan (utama)** — KPI 4 unit, grafik tren santri 5 tahun, komposisi santri per unit, ringkasan keuangan bulan berjalan, notifikasi kesehatan & perizinan, agenda terdekat
7. **Modul Akademik SMP & MA** — daftar siswa (tabel dengan search, filter kelas, pagination), detail siswa, rekap presensi, input nilai, cetak rapor
8. **Modul Kepesantrenan** — denah/daftar asrama & kapasitas kamar, absensi jamaah 5 waktu, progress hafalan Al-Qur'an per santri (juz & halaman), jadwal halaqah, buku pelanggaran & poin ta'zir, **perizinan keluar pondok** (ajukan → disetujui → keluar → kembali)
9. **Modul Poskestren** — dashboard kesehatan (kunjungan hari ini, 5 penyakit terbanyak, stok obat menipis), form pemeriksaan pasien, rekam medis santri, stok obat, jadwal piket kader Santri Husada, laporan bulanan ke Puskesmas
10. **Modul Keuangan** — tagihan SPP/syahriyah/makan/laundry, status bayar, daftar tunggakan, riwayat transaksi
11. **Modul Data Induk (Santri/Siswa)** — satu profil orang dengan **tab**: Biodata, Akademik, Kepesantrenan, Kesehatan, Keuangan, Wali. Ini layar paling penting — tunjukkan integrasi antar unit di sini.
12. **Modul PPDB (sisi admin)** — daftar pendaftar, seleksi, kelulusan
13. **Pengaturan** — unit, tahun ajaran aktif, pengguna & peran

**C. Portal Wali Santri (mobile-first, lebar maksimum 420px)**
14. Ringkasan anak: presensi, hafalan, catatan kesehatan terbaru, tagihan, riwayat izin pulang, pengumuman

### 4. Detail Penting per Modul

- **Hafalan Qur'an**: progress bar per santri (contoh: "12 juz 8 halaman"), target vs realisasi, riwayat setoran (tanggal, surat, ayat, nilai: Mumtaz/Jayyid Jiddan/Jayyid/Maqbul), penguji.
- **Absensi jamaah**: grid santri per kamar, tandai Hadir / Izin / Sakit / Alpa untuk Subuh–Isya, rekap persentase mingguan.
- **Poskestren**: form pemeriksaan berisi keluhan, TTV (suhu, TD, nadi), diagnosis, terapi/obat, tindak lanjut (rawat poskestren / rujuk Puskesmas / istirahat di kamar). Munculkan **peringatan otomatis** bila ada ≥3 kasus penyakit sama dalam 1 asrama dalam 7 hari (deteksi dini KLB — scabies, DBD, diare) — tampilkan sebagai banner merah di dashboard.
- **Perizinan**: kartu izin dengan status berwarna, tombol "Setujui / Tolak", dan penanda santri yang **telat kembali** (overdue).
- **Integrasi silang**: di detail santri, kalau ada catatan sakit dari Poskestren pada tanggal tertentu, presensi akademik hari itu otomatis tampil "Sakit (dari Poskestren)". Tunjukkan ini eksplisit sebagai fitur unggulan.

### 5. Data Dummy

Isi semua tabel dan grafik dengan **data dummy yang realistis dan konsisten** — jangan pakai Lorem Ipsum. Gunakan:
- Nama Indonesia-Islami: Ahmad Fauzan Ramadhani, Siti Nur Aisyah, Muhammad Rizky Maulana, Zahra Salsabila, Ust. Abdul Karim, Ny. Hj. Maimunah, dll.
- NIS/NISN 10 digit, kelas 7A–9D, X-IPA-1 s/d XII-Keagamaan
- Asrama: Al-Ghazali, Ibnu Sina, Imam Syafi'i (putra); Khadijah, Aisyah, Fatimah (putri)
- Penyakit khas pesantren: scabies (gudik), ISPA, dermatitis, gastritis, demam, luka lecet
- Nominal rupiah wajar: SPP SMP Rp350.000, MA Rp400.000, syahriyah pondok Rp650.000/bulan
- Minimal 15–20 baris data pada setiap tabel utama agar filter & pagination terasa nyata

### 6. Arah Desain Visual

- Nuansa **pesantren modern**: bersih, profesional, tidak kaku, tidak "template bootstrap".
- Palet: hijau tua kedalaman (#0F5132 / #14532D) sebagai warna utama, aksen emas hangat (#C9A227), latar krem sangat lembut (#FAF8F3), putih untuk kartu, teks abu tua. Warna status: hijau (aman), kuning (perhatian), merah (kritis), biru (informasi).
- Sentuhan **pola geometri islami** yang halus — dipakai tipis sebagai tekstur latar hero atau border kartu, jangan berlebihan.
- Tipografi: heading berkarakter (serif/display) dipadukan body sans-serif yang mudah dibaca. Ukuran teks tabel jangan terlalu kecil.
- Kartu dengan sudut membulat lembut, bayangan tipis, spasi lega. Ikon konsisten satu gaya (outline).
- Sertakan **judul Arab** pada bagian yang relevan (misal اَلْمَعْهَدُ نُوْرُ الْحِكْمَة di header landing page) — kecil dan elegan saja.
- **Responsif penuh**: sidebar jadi bottom nav / drawer di layar kecil, tabel bisa di-scroll horizontal.

### 7. Aturan Teknis

- Prototype **front-end saja**, tanpa backend. Semua data dari state/objek JavaScript di dalam kode.
- Navigasi antar layar harus **benar-benar berfungsi** (state-based routing), bukan sekadar gambar mati. Tombol, tab, filter, pencarian, dan form harus interaktif.
- Gunakan komponen yang aksesibel: label pada input, kontras cukup, fokus terlihat.
- Jangan pakai localStorage/sessionStorage.
- Semua teks antarmuka dalam Bahasa Indonesia (istilah pesantren tetap: santri, ustadz, halaqah, syahriyah, ta'zir, mukim, mahram).
- Tambahkan **catatan kecil "Data contoh"** di footer dashboard agar jelas ini prototype.

### 8. Urutan Pengerjaan

Kerjakan bertahap dan tunjukkan hasil tiap tahap:
1. Kerangka aplikasi + sistem desain (warna, tipografi, komponen dasar) + Landing Page publik
2. Login + Dashboard Yayasan + navigasi/role switcher
3. Modul Data Induk Santri (profil multi-tab) + Akademik SMP/MA
4. Modul Kepesantrenan (asrama, hafalan, absensi jamaah, perizinan)
5. Modul Poskestren + peringatan dini KLB
6. Keuangan + PPDB (publik & admin) + Portal Wali Santri mobile

Mulai dari tahap 1 sekarang. Setelah selesai satu tahap, tanyakan ke saya sebelum lanjut ke tahap berikutnya.

### 9. Kriteria Selesai

- Semua 14 layar bisa diakses dari navigasi
- Setiap peran melihat menu yang berbeda
- Minimal 3 grafik berbeda (tren garis, komposisi donat, batang perbandingan unit)
- Tabel punya pencarian + filter yang benar-benar menyaring data
- Tampilan rapi di desktop dan di layar ponsel
- Tidak ada tombol "mati" tanpa aksi apa pun

## ===== SALIN SAMPAI DI SINI =====

---

## Prompt Lanjutan (pakai setelah hasil pertama muncul)

Kirim satu per satu sesuai kebutuhan:

1. `Lanjut ke tahap 2. Pertahankan sistem desain yang sudah ada, jangan ubah palet warna.`
2. `Tabel santri masih terasa polos. Tambahkan avatar inisial berwarna, badge status (Mukim / Kalong / Alumni), dan aksi cepat di setiap baris (lihat, edit, cetak kartu).`
3. `Buatkan tampilan cetak Kartu Santri dan Kartu Berobat Poskestren, ukuran kartu ID standar, dengan QR code dummy.`
4. `Tambahkan halaman Laporan: rekap bulanan tiap unit yang bisa difilter periode, plus tombol Ekspor (cukup simulasi).`
5. `Poskestren-nya perkuat: tambahkan grafik tren kunjungan 30 hari, peta sebaran kasus per asrama, dan riwayat KLB.`
6. `Buat versi mode gelap dan tombol pengalih tema di header.`
7. `Buat modul tambahan: manajemen ustadz/guru (jadwal mengajar, beban jam, presensi).`
8. `Rapikan responsivitas: cek semua layar di lebar 375px dan perbaiki yang berantakan.`

---

## Tips Singkat

- **Jangan minta semuanya sekaligus** dalam satu perintah — prototype akan jadi dangkal. Prompt di atas sudah dibuat bertahap, ikuti alurnya.
- Kalau hasilnya melenceng, koreksi dengan menyebut layar spesifik: *"Di Dashboard Yayasan, kartu KPI-nya ganti jadi ..."* — lebih efektif daripada meminta ulang dari awal.
- Ganti nama yayasan, lokasi, dan angka di Bagian 1 dengan data asli lembaga Anda sebelum paste, supaya demo langsung terasa relevan.
