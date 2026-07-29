# Prompt: Rebranding Landing Page PT Tarik Data Digital

> Paste isi file ini ke Claude Code (atau agent coding lain) di dalam repo website.
> Bagian `[ISI SENDIRI]` wajib kamu lengkapi dulu sebelum dijalankan.

---

## Peran

Kamu adalah design lead sekaligus frontend engineer untuk sebuah studio kecil yang dikenal memberi setiap klien identitas visual yang tidak bisa tertukar dengan siapa pun. Klien ini sudah menolak proposal yang terasa template. Buat keputusan palette, tipografi, dan layout yang spesifik untuk brief ini, bukan default yang bisa dipakai ke proyek mana pun.

## Tugas

Rebranding total landing page `https://tarikdata.digital/` dari situs **mono-produk** (Sentient Factory, business intelligence untuk manufaktur) menjadi situs **multi-produk** untuk vendor software institusi.

File sumber: `[ISI SENDIRI: path ke index.html / folder project]`
Stack yang dipakai sekarang: `[ISI SENDIRI: static HTML? Astro? Next.js? Tailwind?]`

---

## 1. Konteks bisnis (baca dulu, ini menentukan semua keputusan)

**Kondisi nyata:** perusahaan ini dijalankan oleh satu founder engineer dengan 7+ tahun pengalaman (React, Node.js, Laravel), berbadan hukum PT, berbasis di Malang, melayani seluruh Indonesia. Punya beberapa produk yang sudah jalan (ERP, dashboard BI, sistem klinik) dan beberapa yang masih roadmap.

**Tujuan rebranding:** dipersepsikan sebagai perusahaan software yang mapan dan layak dipercaya oleh pembeli institusi (direktur RS, kepala yayasan, manajer IT), tanpa membuat klaim yang runtuh saat proses due diligence.

**Ini batasan keras, bukan saran:**

- JANGAN mengarang jumlah karyawan, foto tim, nama karyawan, atau struktur organisasi fiktif.
- JANGAN mengarang jumlah klien, testimoni, logo klien, angka pertumbuhan, atau award.
- JANGAN menulis "tim engineer kami", "tim ahli kami", "ratusan klien" tanpa dasar. Situs lama penuh klaim seperti ini — hapus semua.
- Kredibilitas dibangun dari hal yang bisa diverifikasi: legalitas PT, dokumentasi produk, demo yang bisa dicoba, metodologi kerja yang tertulis, SLA, dan studi kasus nyata.
- Untuk placeholder yang butuh data asli (NIB, NPWP, nama klien, angka), tulis token jelas seperti `{{NIB}}` dan kumpulkan semuanya di satu blok `TODO-DATA` di akhir pekerjaan. Jangan diisi tebakan.

---

## 2. Arsitektur brand yang harus tercermin di struktur situs

```
PT Tarik Data Digital  (master brand)
        |
   +----+----+----------------+
   |         |                |
Senti      Senti            Senti
Health      Edu              Biz
RS &      Sekolah,        ERP, POS,
klinik    kampus,           UMKM
          pondok
   +---------+----------------+
                |
        Core platform (dipakai semua suite)
   Senti AI | HR & absensi | Akun & RBAC | Dashboard & alert
```

**Pesan strategis utama:** satu platform modular, dipasang per sektor. Ini yang membuat masuk akal satu perusahaan melayani banyak vertikal — bukan karena banyak orang, tapi karena arsitektur bersama. Narasi ini harus terasa di hero, di halaman produk, dan di halaman "cara kami bekerja".

HR, POS, BI, dan AI **bukan** produk sejajar dengan RS/sekolah. Itu modul horizontal yang dijual lintas sektor. Jangan sejajarkan di navigasi utama.

---

## 3. Struktur halaman

Ganti model one-page-scroll sekarang menjadi multi-halaman.

**Navigasi utama:**

- **Solusi** (dropdown) — Kesehatan, Pendidikan, Bisnis & Retail
- **Produk** (dropdown) — Senti AI, HR & Absensi, ERP, POS
- **Perusahaan** — Profil & legalitas, Cara kami bekerja, Studi kasus, Karier
- **Sumber daya** — Dokumentasi, Demo, Blog, Status sistem
- **Kontak** (tombol CTA: "Jadwalkan demo")

**Halaman yang dibangun di fase ini:**

1. `/` — Beranda (payung, mengarahkan ke sektor)
2. `/solusi/kesehatan` — RS & klinik
3. `/solusi/pendidikan` — sekolah, kampus, pesantren
4. `/solusi/bisnis` — ERP, POS, UMKM
5. `/perusahaan` — profil, legalitas, cara kerja
6. `/kontak`

Sisanya cukup buat placeholder terstruktur, jangan halaman kosong yang link-nya `#`.

---

## 4. Spesifikasi beranda

**Hero.** Ini tesis halaman. Jangan pakai formula default (angka besar + label kecil + gradient accent) kecuali kamu bisa membenarkannya. Isi pesan: sistem informasi terintegrasi untuk rumah sakit, sekolah, dan bisnis Indonesia; satu platform modular; siap cloud maupun on-premise. Dua CTA: "Lihat solusi per sektor" (primer) dan "Jadwalkan demo" (sekunder).

**Pemilih sektor.** Tiga kartu besar (Kesehatan / Pendidikan / Bisnis) sebagai jalur navigasi utama. Ini elemen terpenting kedua setelah hero — pengunjung harus bisa keluar dari beranda ke halaman sektornya dalam satu klik.

**Penjelasan arsitektur platform.** Visualisasikan core platform + modul vertikal. Ini yang menjelaskan kenapa satu vendor bisa lintas sektor. Boleh diagram, boleh interaktif.

**Modul lintas sektor.** Senti AI, HR & absensi, akun & RBAC, dashboard & alerting. Ringkas, satu baris per modul.

**Bukti kredibilitas.** Blok berisi: badan hukum PT dengan nomor legalitas, tahun beroperasi, model deployment (cloud & on-premise), bahasa dukungan, jam operasional, SLA respons. Bukan testimoni palsu.

**Cara kami bekerja.** Empat sampai lima langkah nyata: konsultasi kebutuhan, proof of concept, implementasi bertahap, pelatihan & handover, dukungan berkelanjutan. Ini menjawab kecemasan asli pembeli institusi.

**Studi kasus.** Maksimal tiga, dari data asli yang akan disediakan. Format: konteks klien, masalah, solusi, hasil terukur. Kalau data belum ada, buat komponennya lalu isi dengan `{{CASE_1}}` dan catat di TODO-DATA.

**CTA penutup + kontak.**

---

## 5. Spesifikasi halaman sektor

Setiap halaman sektor harus berbicara dalam bahasa sektornya. Pembeli RS tidak peduli manufaktur.

**Kesehatan:** rekam medis elektronik sesuai regulasi Kemenkes, integrasi SatuSehat, bridging BPJS, coding ICD-10, modul rawat jalan/rawat inap/farmasi/kasir, antrean, laporan RL. Bedakan paket klinik (ringan, cepat) dan RS (kompleks, bertahap).

**Pendidikan:** akademik, PPDB, keuangan/SPP, e-learning, perpustakaan, sinkronisasi Dapodik untuk sekolah, PDDikti untuk kampus, EMIS untuk madrasah/pesantren. Untuk pesantren tambahkan: asrama, halaqah/hafalan, perizinan santri, tabungan santri, portal wali santri.

> Verifikasi nama dan status regulasi yang kamu sebut sebelum menuliskannya. Menyebut regulasi dengan benar adalah sinyal kompetensi terkuat di halaman ini; menyebutnya salah langsung menghancurkan kredibilitas. Kalau ragu, tandai untuk dikonfirmasi.

**Bisnis & Retail:** ERP (inventory, akuntansi, penjualan, pembelian, produksi), POS multi-outlet, paket ringan untuk UMKM, dashboard BI. Ini vertikal yang produknya paling matang — tampilkan paling konkret, dengan screenshot asli.

Struktur tiap halaman sektor: hero spesifik sektor → masalah yang dikenali pembaca → modul yang relevan → kepatuhan & integrasi → model implementasi & timeline → FAQ pengadaan (harga, on-premise, migrasi data, pelatihan, kelanjutan dukungan) → CTA demo.

---

## 6. Arah desain

**Yang harus dihindari** — tiga tampilan ini adalah default AI yang terbaca sebagai "dibuat mesin", bukan pilihan desain:

1. Latar cream hangat (~#F4F1EA) + serif display kontras tinggi + aksen terracotta (~#D97757)
2. Latar hitam pekat + satu aksen acid green atau vermilion
3. Layout broadsheet: garis rambut, border-radius nol, kolom padat ala koran

Juga hindari: emoji sebagai ikon (situs lama penuh emoji — ganti dengan icon set yang konsisten), gradient mesh, glassmorphism, kartu fitur tiga kolom generik dengan ikon lingkaran.

**Yang harus dicapai:** nada institusional yang tenang dan dapat dipercaya, tapi tidak membosankan. Audiensnya konservatif — direktur RS dan pengurus yayasan — jadi keterbacaan dan kejelasan menang atas kejutan visual. Ambil satu risiko estetis yang bisa kamu pertanggungjawabkan, taruh di satu tempat saja, dan buat sisanya disiplin.

**Sistem yang harus kamu putuskan dan dokumentasikan sebelum menulis kode:**

- Palette: 4–6 warna bernama dengan hex. Satu warna dasar untuk master brand, satu aksen per suite (Health / Edu / Biz) yang tetap satu keluarga.
- Tipografi: minimal dua peran (display berkarakter yang dipakai dengan hemat + body face yang nyaman untuk teks panjang berbahasa Indonesia). Pastikan font-nya punya dukungan diakritik dan tersedia via self-host atau Google Fonts.
- Skala tipe, skala spasi, radius, dan elevation sebagai design token.
- Elemen signature: satu hal yang membuat halaman ini diingat.

Tulis rencana ini dulu sebagai `DESIGN-PLAN.md`, kritik sendiri terhadap daftar "yang harus dihindari" di atas, revisi, baru mulai coding. Ikuti rencana yang sudah direvisi secara konsisten.

---

## 7. Ketentuan teknis

- Responsif penuh, mobile-first. Mayoritas trafik B2B Indonesia dari mobile.
- Aksesibilitas: kontras minimal WCAG AA, fokus keyboard terlihat, landmark semantik, alt text bermakna, `prefers-reduced-motion` dihormati.
- Performa: target Lighthouse 90+ di keempat kategori. Font di-preload, gambar pakai format modern + `width`/`height` eksplisit, tanpa library berat yang tidak perlu.
- SEO: title dan meta description unik per halaman, Open Graph + Twitter card, canonical, `sitemap.xml`, `robots.txt`, JSON-LD `Organization` dan `SoftwareApplication` per produk. Bahasa `id-ID`.
- Form kontak: field sesuai sektor (pilihan sektor mengubah pilihan kebutuhan). Validasi jelas, pesan error menjelaskan cara memperbaiki, bukan sekadar "invalid". Kirim ke `[ISI SENDIRI: WhatsApp / endpoint / email service]`.
- Semua link harus mengarah ke tujuan nyata. Situs lama punya banyak `href="#"` termasuk LinkedIn, Instagram, kebijakan privasi, dan syarat & ketentuan — link mati adalah sinyal negatif terkuat untuk pembeli institusi. Kalau halamannya belum ada, buat halamannya.
- Kebijakan privasi dan syarat & ketentuan harus berisi teks nyata yang relevan dengan pemrosesan data institusi, bukan lorem ipsum.
- CSS: hati-hati dengan specificity. Jangan bikin selector berbasis tipe dan berbasis elemen yang saling membatalkan, terutama untuk padding antar-section.

---

## 8. Aturan penulisan copy

- Bahasa Indonesia, kalimat aktif, sentence case, tanpa Title Case dan tanpa huruf kapital semua.
- Spesifik mengalahkan pintar. "Sinkronisasi data siswa ke Dapodik" lebih baik daripada "solusi terintegrasi berbasis kecerdasan buatan".
- Sebut sesuatu dari sisi pengguna, bukan dari sisi sistem. Orang mengelola "jadwal dokter", bukan "resource scheduling engine".
- Buang kalimat pemanis yang tidak menambah informasi. Situs lama penuh ini: "kami bukan sekadar vendor, kami mitra teknologi", "teknologi harus berdampak", "rasa ingin tahu". Hapus, kecuali bisa diganti dengan fakta.
- Setiap tombol menyebut persis apa yang terjadi saat diklik, dan namanya konsisten sepanjang alur.

---

## 9. Output yang diharapkan

1. `DESIGN-PLAN.md` — palette, tipografi, layout, elemen signature, plus catatan kritik-diri dan revisinya.
2. Kode halaman sesuai daftar di bagian 3, siap deploy.
3. `TODO-DATA.md` — daftar semua data asli yang masih perlu diisi (legalitas, studi kasus, screenshot, kontak sosial, konfirmasi regulasi).
4. `MIGRASI.md` — daftar redirect dari anchor lama (`#about`, `#product`, `#why`, `#industries`, `#contact`) ke URL baru, supaya SEO yang sudah ada tidak hilang.

## 10. Kriteria selesai

- Pengunjung bisa sampai ke halaman sektornya dalam satu klik dari beranda.
- Tidak ada satu pun klaim tentang tim, klien, atau angka yang tidak bisa diverifikasi.
- Tidak ada `href="#"` yang tersisa.
- Tiga halaman sektor terbaca ditulis oleh orang yang paham sektornya, bukan hasil salin-tempel dengan ganti kata.
- Desainnya tidak menyerupai salah satu dari tiga default di bagian 6, dan kamu bisa menjelaskan alasan setiap keputusan warna dan tipografi dari `DESIGN-PLAN.md`.

---

## Cara kerja

Kerjakan bertahap dan berhenti untuk konfirmasi di dua titik: setelah `DESIGN-PLAN.md` selesai, dan setelah beranda jadi. Jangan bangun keenam halaman sekaligus sebelum arah desainnya disetujui.
