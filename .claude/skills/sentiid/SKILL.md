---
name: sentiid
description: >
  Skill untuk bekerja di apps/marketing/senti.id — website holding dan pusat
  ekosistem produk Senti. Aktifkan setiap kali task menyentuh folder tersebut,
  menyebut Senti.id, senti.id, website holding Senti, atau halaman pemasaran
  ekosistem Senti.
trigger: >
  Aktif saat user menyebut "Senti.id", "senti.id", "website Senti",
  "holding Senti", "ekosistem Senti", "marketing Senti", atau mengedit file
  di apps/marketing/senti.id/**.
---

Kamu bekerja di `apps/marketing/senti.id` — website holding dan pusat ekosistem
produk Senti. Website ini adalah pintu utama untuk memperkenalkan dan
menghubungkan produk-produk vertikal Senti, bukan landing page satu produk.

Skill ini berlaku di atas root `CLAUDE.md`. Baca
`apps/marketing/senti.id/README.md` sebelum mengubah positioning, daftar produk,
atau struktur halaman.

## Konteks produk

Produk utama yang ditampilkan saat ini:

- **Senti Klinik** — operasional dan layanan klinik.
- **Senti Edu** — akademik dan administrasi pendidikan.
- **Senti Hotel** — reservasi dan operasional perhotelan.
- **Senti Biz** — ERP terintegrasi untuk Kas & Bank, Pembelian, dan Penjualan;
  tujuan produk saat ini `https://erp.senti.id/`.

Saat menambah atau mengubah produk, selaraskan nama, deskripsi, dan tautannya di
seluruh bagian halaman yang relevan, termasuk kartu produk, menu, FAQ, dan
footer. Perbarui `README.md` jika positioning atau daftar produk berubah.

## Struktur dan runtime

- Halaman utama: `apps/marketing/senti.id/index.html`.
- Implementasi saat ini berupa website HTML statis, bukan aplikasi npm.
- Aset pendukung berada relatif terhadap folder Senti.id; pertahankan URL aset
  relatif agar halaman tetap bisa disajikan dari root domain.
- Untuk preview lokal, sajikan folder pada port **3210**:

  ```bash
  python3 -m http.server 3210 --bind 0.0.0.0 \
    --directory apps/marketing/senti.id
  ```

- URL preview utama wajib `http://localhost:3210/`, bukan URL yang mengekspos
  nama file HTML.
- Jangan mengubah `config/ports.json` hanya untuk menjalankan preview ini,
  kecuali user secara eksplisit meminta registrasi port.

## Aturan perubahan

1. Pertahankan Senti.id sebagai induk ekosistem dan arahkan pengunjung ke produk
   yang sesuai dengan kebutuhan mereka.
2. Gunakan bahasa pemasaran yang mudah dipahami UMKM dan pelaku bisnis;
   jelaskan manfaat konkret sebelum istilah teknis.
3. Untuk Senti Biz, utamakan manfaat seperti penjualan tercatat, stok terjaga,
   pembelian terkendali, kas terpantau, dan keuntungan terlihat. Gunakan istilah
   ERP sebagai descriptor, bukan pesan utama jika audiensnya UMKM.
4. Jangan memperkenalkan nama produk, domain, klaim, atau fitur baru tanpa dasar
   dari permintaan user atau konten proyek yang sudah disetujui.
5. Setelah perubahan halaman, lakukan satu smoke check pada
   `http://127.0.0.1:3210/` dan pastikan respons HTTP 200.
6. Hindari menjadikan file alternatif seperti `Senti Redesign.dc.html` sebagai
   URL publik utama; perubahan produksi harus tercermin di `index.html`.

## Sinkronisasi dokumentasi

- Perubahan daftar produk atau positioning → update `README.md`.
- Perubahan runtime/entrypoint → update bagian Struktur dan runtime di skill ini.
- Jika isi skill berbeda dengan implementasi aktif, verifikasi `index.html`,
  lalu perbarui skill dan README agar kembali konsisten.
