# Data yang perlu dikonfirmasi sebelum dipublikasikan

Dokumen ini menyimpan fakta perusahaan dan bukti komersial yang belum terverifikasi.
Nilai di bawah **tidak boleh** ditebak, ditampilkan sebagai token pada halaman publik,
atau dimasukkan ke JSON-LD sebelum ada sumber internal yang dapat diperiksa.

## Legalitas dan identitas

- Nama legal persis, termasuk penggunaan titik pada singkatan PT.
- Nomor Induk Berusaha (NIB), NPWP, dan KBLI yang relevan.
- Nomor dan tanggal akta pendirian, nama notaris, serta SK Kemenkumham.
- Alamat domisili terdaftar lengkap dan kode pos.
- Tahun berdiri dan tahun mulai beroperasi.
- Status serta nomor pendaftaran merek Senti, bila ada.

## Kontak publik

WhatsApp dan email telah dipilih sebagai fallback form untuk fase ini. Sebelum
rilis, lakukan uji kirim operasional pada kanal yang dipakai situs:

- `halo@tarikdata.digital` sebagai email penjualan.
- `+62 856-0755-0989` sebagai WhatsApp penjualan.

Data publik lain yang masih perlu dikonfirmasi:

- Alamat domisili terdaftar lengkap; copy situs saat ini hanya menyebut Malang.
- Email khusus permintaan hak subjek data atau pengaduan privasi.
- Kanal dukungan/tiket resmi.
- Tautan LinkedIn, Instagram, dan kanal sosial lain yang benar-benar dikelola.

## Operasional dan pengadaan

- Hari, jam, dan zona waktu dukungan.
- SLA respons awal per tingkat dampak.
- Model deployment yang telah dikonfirmasi: cloud, on-premise, atau keduanya.
- Lokasi hosting default dan daftar subprosesor.
- Kebijakan backup, RPO, RTO, ekspor/pengembalian data, dan migrasi data.
- Jalur eskalasi insiden serta prosedur pemberitahuan insiden.
- Daftar integrasi yang sudah diuji dan tersedia per produk.
- Produk/modul yang siap didemonstrasikan pada environment aktif.
- Harga, skema lisensi, biaya implementasi, dan syarat pembayaran.

## Privasi dan ketentuan

Minta review hukum sebelum menetapkan:

- Identitas dan alamat pengendali data pribadi.
- Tujuan, dasar pemrosesan, dan periode retensi data calon pelanggan.
- Daftar penerima/subprosesor dan lokasi pemrosesan data.
- Mekanisme permintaan akses, koreksi, penghapusan, atau keberatan.
- Tanggal berlaku kebijakan privasi dan syarat penggunaan situs.
- Hukum yang berlaku serta forum penyelesaian sengketa.
- Batas tanggung jawab, jaminan, SLA, dan hak kekayaan intelektual layanan.

## Bukti produk dan komersial

- Maksimal tiga studi kasus dengan izin publikasi tertulis.
- Untuk setiap studi kasus: konteks, masalah, ruang lingkup, hasil terukur,
  metode pengukuran, periode pengukuran, dan izin menyebut nama/logo.
- Screenshot ERP, HR, dan Senti AI yang aktual serta aman dipublikasikan.
- Referensi implementasi yang bersedia dihubungi calon pelanggan.
- Bukti deployment cloud/on-premise yang boleh ditunjukkan saat due diligence.
- Konfirmasi kemampuan dan batas demo untuk setiap modul.

## Regulasi dan integrasi yang perlu pemilik data proyek

Istilah regulasi pada halaman sektor telah diperiksa, tetapi konektor eksternal
harus tetap diposisikan sebagai kebutuhan implementasi sampai tersedia bukti:

- Kredensial dan hasil uji SATUSEHAT Platform/HL7 FHIR.
- Kredensial dan hasil uji layanan BPJS Kesehatan yang relevan.
- Alur SIRS Online yang benar-benar diterapkan.
- Mekanisme pertukaran data Dapodik, Neo Feeder/PDDikti, dan EMIS yang sah.
- Assessment kepatuhan atau keamanan yang telah dilakukan dan boleh disebut.

## Aturan publikasi

1. Simpan sumber bukti atau penanggung jawab internal untuk setiap nilai.
2. Perbarui copy, JSON-LD, kebijakan, dan ketentuan secara bersamaan.
3. Jalankan build dan validator; output publik harus bebas pola `{{...}}`.
4. Jangan mengubah label status produk tanpa verifikasi implementasi terbaru.
