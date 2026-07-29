# Kebijakan klaim dan struktur output

Appendix dari [DESIGN-PLAN.md](DESIGN-PLAN.md). Dokumen ini mengikat copy dan
status produk pada seluruh halaman PT Tarik Data Digital.

## Status produk

| Status | Arti publik | Produk |
|---|---|---|
| **Berjalan** | Implementasi produk tersedia untuk dibahas/didemonstrasikan sesuai kesiapan | Senti ERP, Senti HR, dashboard & alerting, Senti AI |
| **Pengembangan** | Sedang dibangun bersama mitra desain awal | Senti Health, Senti Edu |
| **Rencana** | Kebutuhan/arah produk ada, belum tersedia untuk produksi | POS, Aset Tetap |

Status MDP harus dijelaskan per ruang lingkup dan tidak boleh diposisikan siap
implementasi sebelum kesiapan aktual diverifikasi. Label yang jujur membuat
status “Berjalan” dapat dipercaya; bila semua diklaim jadi, tidak ada yang dapat
dipercaya.

## Yang boleh diklaim

Hanya kemampuan yang terverifikasi di repo:

- **Senti ERP:** akuntansi dan buku besar, persediaan multi-gudang, penjualan,
  pembelian, master data, BOM/work order, multi-mata-uang, RBAC/audit log,
  penomoran dokumen, dan report studio. Ketersediaan demo atau deployment
  pelanggan tidak boleh disimpulkan hanya dari desain/implementasi di repo.
- **Senti HR:** absensi wajah, geofence GPS, mode kios, antrean review, shift,
  cuti, lembur, dan timesheet. Produk ini bukan HRIS penuh dan tidak mencakup
  payroll atau rekrutmen.
- **Senti AI:** pertanyaan/kueri baca-saja terhadap data sesuai ruang akses yang
  ditetapkan. Tidak diposisikan untuk menulis transaksi atau mengambil keputusan
  otomatis.
- **Health dan Edu:** pemahaman domain dan regulasi dapat ditunjukkan, tetapi
  produk harus disebut program pengembangan dan integrasi eksternal sebagai
  kebutuhan/target implementasi, bukan konektor yang sudah tersedia.

## Yang dilarang muncul

- Testimoni, logo klien, jumlah klien, angka pertumbuhan, atau hasil tanpa bukti
  serta izin publikasi.
- Klaim jumlah/tim engineer, pengalaman kolektif, kantor nasional, atau
  implementasi nasional tanpa sumber yang dapat diperiksa.
- Health/Edu ditulis seolah sudah jadi atau tersertifikasi.
- POS ditulis seolah sudah tersedia untuk produksi.
- HR disebut HRIS atau diklaim memiliki payroll/rekrutmen.
- SLA, uptime, harga, deployment, keamanan, atau sertifikasi sebagai janji umum
  sebelum dituangkan dalam data/perjanjian yang terverifikasi.

## Terminologi regulasi terverifikasi

- **Permenkes No. 24 Tahun 2022 tentang Rekam Medis**—bukan berjudul “Rekam
  Medis Elektronik”. RME wajib sejak 31 Desember 2023.
- **SATUSEHAT Platform** adalah HIE dengan standar HL7 FHIR, bukan nama lama
  PeduliLindungi. SATUSEHAT Mobile adalah aplikasi warga yang berbeda.
- **SIRS Revisi 6.3** melalui SIRS Online v3 wajib sejak Januari 2025 dan tidak
  digantikan SATUSEHAT.
- **STARKES** memakai KMK HK.01.07/MENKES/1596/2024; bab MRMIK menyentuh SIM RS.
- **ICD-10** masih digunakan; prosedur memakai ICD-9-CM. ICD-11 belum diadopsi
  di Indonesia. Transisi iDRG tidak diberi tanggal go-live spekulatif.
- Layanan **BPJS Kesehatan** seperti VClaim, Antrean Online, Aplicares, PCare,
  iCare, dan Apotek memerlukan mekanisme resmi/kredensial per fasyankes.
- **SPMB** menggantikan PPDB melalui Permendikdasmen No. 3 Tahun 2025, dengan
  jalur domisili, afirmasi, prestasi, dan mutasi. Kuota berbeda per daerah.
- **Dapodik** di bawah Kemendikdasmen tidak memiliki API publik pihak ketiga.
- **PDDikti** di bawah Kemdiktisaintek memakai Neo Feeder.
- **EMIS 4.0** Kemenag tidak mempunyai portal API publik pihak ketiga.
- Gunakan ejaan **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi** dan
  frasa “dirancang selaras/mengacu”, bukan klaim sertifikasi atau kepatuhan umum.

Klaim integrasi harus ditulis sebagai kebutuhan teknis atau target implementasi
sampai kredensial, pemetaan data, dan hasil pengujian tersedia. Data yang masih
memerlukan konfirmasi dicatat di [TODO-DATA.md](TODO-DATA.md).

## Struktur source dan output

Source hidup di `src/` dan disusun oleh `tools/site_builder.py` menggunakan
registry tunggal `src/data/routes.py`. Output `dist/` bersifat generated dan
tidak diedit manual.

```text
src/data/routes.py          metadata dan inventaris route
src/fragments/              shell, header, footer
src/components/             fragment reusable form
src/pages/                  body halaman
src/assets/                 CSS/JS sumber terpisah
assets/                     gambar, ikon, dan favicon statis
tools/site_builder.py       composer dan validator
public output: dist/        HTML route, assets, robots, sitemap
```

Halaman di luar enam halaman inti tetap menjadi destination page yang jujur,
bukan `href="#"` atau halaman kosong. Route yang belum substantif memakai
`noindex, follow` dan tidak dimasukkan ke sitemap.

Deployment memakai mount direktori `dist/` read-only serta konfigurasi
`nginx.conf` dengan `try_files $uri $uri/ =404`; tidak ada fallback SPA.
Output publik harus bebas pola token internal `{{...}}`.
