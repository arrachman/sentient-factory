# Migrasi URL situs PT Tarik Data Digital

Situs lama memakai satu dokumen dengan anchor. Situs baru memakai route statis.
Fragment URL (`#...`) tidak dikirim ke server dalam permintaan HTTP, sehingga
nginx tidak dapat mengeluarkan redirect berbeda untuk setiap anchor. Mapping ini
menentukan tujuan kampanye/link lama dan perilaku transisi yang harus diterapkan
di halaman root bila redirect berbasis JavaScript dianggap perlu.

## Mapping anchor lama

| URL lama | Tujuan baru | Alasan |
|---|---|---|
| `/#about` | `/perusahaan/` | Profil, legalitas, dan cara kerja perusahaan |
| `/#product` | `/solusi/bisnis/` | Produk lama berfokus pada manufaktur/bisnis |
| `/#why` | `/perusahaan/cara-kerja/` | Alasan memilih vendor dijawab lewat proses implementasi nyata |
| `/#industries` | `/#solusi` | Pemilih sektor tetap tersedia di beranda baru |
| `/#contact` | `/kontak/` | Funnel kontak dan permintaan demo khusus |
| Link demo Sentient Factory lama | `/sumber-daya/demo/` | Tujuan sementara sampai URL demo langsung diverifikasi |

## Strategi implementasi

1. **Perbarui link yang dikelola sendiri** (iklan, profil sosial, dokumen, email,
   dan QR code) langsung ke tujuan baru. Ini lebih andal daripada redirect
   fragment.
2. **Pertahankan ID `solusi`** pada beranda agar `/#industries` dapat dipetakan
   ke `/#solusi` tanpa kehilangan konteks.
3. Bila trafik anchor lama masih material, tambahkan skrip kecil di root yang
   membaca `location.hash` dan memakai `location.replace()` sesuai tabel.
   Fallback tanpa JavaScript tetap menampilkan beranda lengkap.
4. Jangan menambahkan fallback SPA di nginx. Route yang tidak ada harus tetap
   mengembalikan HTTP 404, bukan beranda dengan status 200.
5. Pertahankan canonical unik dan masukkan seluruh route indexable ke sitemap.

## Redirect HTTP yang dapat dilakukan server

Redirect path lama yang memiliki path nyata (bukan fragment) dapat ditambahkan
sebagai `return 301` di konfigurasi nginx setelah daftar dari analytics/log
tersedia. Belum ada bukti route path lama selain `/`, jadi tidak ada redirect
path spekulatif pada fase ini.

## Verifikasi setelah rilis

- Buka setiap URL lama pada browser dan pastikan tujuan/konteksnya benar.
- Periksa response code untuk seluruh route baru dan satu route acak yang salah.
- Pastikan canonical tidak menunjuk halaman lama.
- Kirim ulang `sitemap.xml` pada alat webmaster yang digunakan perusahaan.
- Pantau log 404 dan tambahkan hanya redirect yang didukung trafik nyata.
