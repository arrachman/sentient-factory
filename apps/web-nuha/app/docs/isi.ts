/**
 * Isi dokumentasi dipisahkan dari penyajinya supaya halaman `/docs` tetap
 * ringkas dan teks bisa disunting tanpa menyentuh markup.
 */

export type Langkah = { judul: string; detail: string };
export type Bagian = {
  id: string;
  judul: string;
  ringkas: string;
  langkah?: Langkah[];
  /** Beberapa bagian menjelaskan lebih dari satu layar, jadi ini daftar. */
  gambar?: { file: string; caption: string }[];
  catatan?: string;
};

export const AKUN: { peran: string; login: string; menu: string; catatan: string }[] = [
  { peran: 'Super Admin', login: 'superadmin', menu: '18', catatan: 'Seluruh menu + pemilih peran untuk debugging.' },
  { peran: 'Ketua Yayasan', login: 'ketua@nuha.pesantren.web.id', menu: '16', catatan: 'Pengawasan lintas unit; termasuk mengelola gelombang ujian.' },
  { peran: 'Kepala SMP', login: 'kepsek.smp@nuha.pesantren.web.id', menu: '11', catatan: 'Terbatas unit SMP; mengelola gelombang ujian unitnya.' },
  { peran: 'Kepala MA', login: 'kepsek.ma@nuha.pesantren.web.id', menu: '11', catatan: 'Terbatas unit MA; mengelola gelombang ujian unitnya.' },
  { peran: 'Pengasuh', login: 'pengasuh@nuha.pesantren.web.id', menu: '9', catatan: 'Kepesantrenan, hafalan, tazir, izin.' },
  { peran: 'Guru / Wali Kelas', login: 'guru.1 … guru.10', menu: '10', catatan: 'Kelas Saya di Kurikulum + input nilai di modul Ujian.' },
  { peran: 'Bendahara', login: 'bendahara@nuha.pesantren.web.id', menu: '8', catatan: 'Tagihan, SPP, kas, penggajian.' },
  { peran: 'Poskestren', login: 'poskestren@nuha.pesantren.web.id', menu: '6', catatan: 'Periksa, rekam medis, stok obat.' },
  { peran: 'Musyrif Asrama', login: 'musyrif.b@nuha.pesantren.web.id', menu: '1', catatan: 'Belum diberi hak menu — atur lewat Pengaturan.' },
  { peran: 'Tata Usaha', login: 'tu.smp@nuha.pesantren.web.id', menu: '1', catatan: 'Akun nonaktif; belum diberi hak menu.' },
  { peran: 'Santri', login: 'santri.<NIS>', menu: '1', catatan: '16 akun; hanya Portal Santri, baca-saja.' },
  { peran: 'Wali Santri', login: 'wali.<NIS>', menu: '1', catatan: '16 akun; hanya Portal Wali.' },
];

export const BAGIAN: Bagian[] = [
  {
    id: 'masuk',
    judul: 'Masuk ke sistem',
    ringkas:
      'Satu pintu untuk semua peran. Staf memakai alamat surel, santri dan wali memakai nama pengguna berbasis NIS. Peran tidak dipilih saat masuk — sistem membacanya dari basis data.',
    langkah: [
      { judul: 'Buka halaman masuk', detail: 'Alamat /login. Segmented Staf / Wali / Santri hanya mengubah label dan contoh, bukan cara autentikasinya.' },
      { judul: 'Isi identitas dan kata sandi', detail: 'Identitas boleh surel maupun nama pengguna; keduanya diperiksa ke kolom yang sama.' },
      { judul: 'Sistem menyusun sesi', detail: 'Berhasil masuk menaruh JWT di kuki httpOnly berumur 8 jam, lalu mengarahkan ke beranda sesuai peran.' },
    ],
    gambar: [{ file: 'login.png', caption: 'Formulir masuk — satu jalur untuk staf, wali, dan santri.' }],
    catatan: 'Sandi seluruh akun contoh: Nuha2026! — ganti sebelum dipakai sungguhan.',
  },
  {
    id: 'peran',
    judul: 'Peran dan hak akses',
    ringkas:
      'Menu yang tampil bukan daftar tetap di dalam kode, melainkan hasil pemetaan peran → menu di basis data. Menambah hak akses cukup lewat Pengaturan, tanpa membangun ulang aplikasi.',
    langkah: [
      { judul: 'Pengguna memegang satu peran atau lebih', detail: 'Tabel user_peran menghubungkan akun dengan peran.' },
      { judul: 'Peran memegang menu', detail: 'Tabel menu_peran menentukan menu apa saja yang boleh dibuka.' },
      { judul: 'Setiap halaman memeriksa sendiri', detail: 'requirePage(<menu>) berjalan di server: tanpa sesi dilempar ke /login, tanpa hak dilempar ke beranda. Menyembunyikan menu saja tidak dianggap cukup.' },
    ],
    gambar: [{ file: 'dashboard-superadmin.png', caption: 'Dasbor super admin dengan seluruh 17 menu.' }],
  },
  {
    id: 'samaran',
    judul: 'Melihat aplikasi sebagai peran lain',
    ringkas:
      'Super admin dapat menyamar untuk menelusuri keluhan pengguna tanpa meminta kata sandi siapa pun. Peran asli disimpan terpisah sehingga penyamaran selalu bisa dibatalkan.',
    langkah: [
      { judul: 'Pilih peran di kanan atas', detail: 'Dropdown "Lihat sebagai" hanya muncul untuk super admin.' },
      { judul: 'Tekan Terapkan', detail: 'Sesi ditulis ulang: peran efektif berganti, peran asli disimpan di kolom terpisah, dan halaman kembali ke beranda karena menu ikut berubah.' },
      { judul: 'Kembali ke peran asli', detail: 'Pilih "Super admin (peran asli)". Selama menyamar, banner kuning selalu terlihat agar tidak ada yang salah membaca layar.' },
    ],
    gambar: [{ file: 'pemilih-peran.png', caption: 'Pemilih peran di bilah atas.' }],
    catatan:
      'Server menolak permintaan ganti peran dari siapa pun yang peran aslinya bukan super admin — dropdown yang tersembunyi bukan pengaman. Setiap pergantian tercatat di audit sebagai GANTI_PERAN.',
  },
  {
    id: 'guru',
    judul: 'Alur guru',
    ringkas:
      'Guru melihat kelas yang benar-benar diampunya, dikelompokkan per unit — seorang guru lazim mengajar di SMP dan MA sekaligus, bahkan merangkap ustadz diniyah di pondok. Yang menentukan bukan jabatan di kepegawaian, melainkan kecocokan namanya pada jadwal pelajaran.',
    langkah: [
      { judul: 'Masuk sebagai guru', detail: 'Akun guru.1 sampai guru.10, satu untuk tiap pengajar di jadwal.' },
      { judul: 'Buka Kurikulum → Kelas Saya', detail: 'Kartu muncul per kombinasi kelas dan mata pelajaran, dikelompokkan per unit (SMP, MA, Pondok Pesantren).' },
      { judul: 'Badge peran', detail: 'Wali Kelas bila namanya terdaftar sebagai wali kelas itu; Ustadz Diniyah bila jam mengajarnya berada di unit pondok.' },
      { judul: 'Isi tiap kartu', detail: 'Jumlah siswa, JP per pekan, hari mengajar, KKM, kelengkapan input nilai beserta rerata, rincian presensi hari ini, dan sesi ujian terdekat yang belum selesai dinilai.' },
      { judul: 'Tombol aksi', detail: 'Input nilai dan Presensi menuju Akademik; Nilai ujian menuju modul Ujian.' },
    ],
    gambar: [{ file: 'guru-kelas-saya.png', caption: 'Kelas Saya untuk Bu Dwi Astuti — mengampu di MA, SMP, dan merangkap ustadzah diniyah di pondok.' }],
    catatan:
      'Kelas yang belum berisi santri ditandai jelas pada kartunya; presensi dan nilai baru bisa diisi setelah santri dimasukkan lewat Kelola Data.',
  },
  {
    id: 'ujian',
    judul: 'Manajemen ujian',
    ringkas:
      'Gelombang ujian (UTS/UAS) disusun per unit oleh kepala unit, sementara guru mengisi nilai sesi mata pelajaran yang diampunya. Nilai ujian per sesi disimpan terpisah dari rekap rapor.',
    langkah: [
      { judul: 'Gelombang Ujian', detail: 'Kepala unit dan ketua memindahkan status Draf → Berjalan → Selesai. Kemajuan penilaian dihitung dari nilai yang masuk dibanding jumlah peserta seluruh sesi.' },
      { judul: 'Kartu Ujian', detail: 'Seluruh sesi satu gelombang: tanggal, waktu, durasi, ruang, pengawas, dan jumlah yang sudah dinilai. Guru hanya melihat sesi mapel yang diampunya.' },
      { judul: 'Input Nilai', detail: 'Guru memilih sesi lalu mengisi nilai 0–100 per santri. Santri yang tidak hadir tetap tersimpan barisnya dengan nilai 0 — ketidakhadiran adalah fakta yang perlu tercatat.' },
      { judul: 'Penguncian', detail: 'Gelombang berstatus Selesai mengunci formulir nilainya karena angkanya sudah dipakai rapor. Membukanya kembali harus lewat kepala unit.' },
    ],
    gambar: [{ file: 'ujian-input-nilai.png', caption: 'Input nilai sesi ujian oleh guru pengampu.' }],
    catatan:
      'Setiap perubahan status gelombang dan penyimpanan nilai digerbangi menu ujian di server serta dicatat ke audit log (UBAH_STATUS_UJIAN, SIMPAN_NILAI_UJIAN).',
  },
  {
    id: 'wa-perangkat',
    judul: 'Menautkan nomor WhatsApp',
    ringkas:
      'Pesan dikirim dari nomor WhatsApp sungguhan milik pondok. Nomor ditautkan sekali lewat pemindaian QR; kredensialnya disimpan gateway sehingga bertahan melewati mulai ulang.',
    langkah: [
      { judul: 'Buka Notifikasi WA → Perangkat', detail: 'Hanya peran yang memegang menu wa yang bisa membukanya.' },
      { judul: 'Daftarkan nomor', detail: 'Isi nama perangkat dan nomor, lalu tekan Daftarkan. Nomor dinormalkan ke format 62.' },
      { judul: 'Tampilkan QR dan pindai', detail: 'Di ponsel: WhatsApp → Perangkat Tertaut → Tautkan perangkat. QR hanya berlaku beberapa detik; muat ulang halaman bila kedaluwarsa.' },
      { judul: 'Status berubah jadi Terhubung', detail: 'Sejak itu pesan dikirim melalui nomor tersebut. Tombol Putuskan mengakhiri sesi tanpa menghapus perangkat.' },
    ],
    gambar: [{ file: 'wa-perangkat.png', caption: 'Tab Perangkat dengan satu nomor menunggu ditautkan.' }],
    catatan:
      'Selama WA_DRY_RUN bernilai true, pesan hanya dicatat ke log dan tidak benar-benar terkirim. Setel ke false hanya setelah nomor tertaut dan penerimanya sudah pasti benar.',
  },
  {
    id: 'wa-pesan',
    judul: 'Template dan pemicu pesan',
    ringkas:
      'Isi pesan tinggal di basis data, bukan di kode. Setiap template punya kode, kelompok penerima, dan peubah dalam kurung ganda yang diisi saat pengiriman.',
    langkah: [
      { judul: 'Template', detail: 'Aktif atau nonaktifkan per skenario tanpa menyentuh kode.' },
      { judul: 'Pemicu otomatis', detail: 'Baris pemicu dihitung dari keadaan nyata — tagihan jatuh tempo, izin, penggajian.' },
      { judul: 'Log pengiriman', detail: 'Setiap upaya tercatat lengkap dengan status, id pesan, dan alasan gagal, serta masuk audit log.' },
    ],
    gambar: [{ file: 'wa-template.png', caption: 'Daftar template beserta kelompok penerimanya.' }],
  },
  {
    id: 'keuangan',
    judul: 'Keuangan dan penggajian',
    ringkas:
      'Tagihan, pembayaran, dan kas berada di satu modul. Slip gaji yang sudah dibayar tidak dapat disunting diam-diam: revisinya menghasilkan jejak audit tersendiri.',
    langkah: [
      { judul: 'Tagihan dan SPP', detail: 'Status Lunas, Cicil, dan Menunggak dibedakan warna badge.' },
      { judul: 'Rekap dan tunggakan', detail: 'Agregat dihitung dari transaksi, bukan angka tetap.' },
      { judul: 'Penggajian', detail: 'Slip diterbitkan, dibayar, lalu bila perlu direvisi — tiap tahap tercatat.' },
    ],
    gambar: [{ file: 'keuangan-tagihan.png', caption: 'Modul keuangan dilihat oleh bendahara.' }],
  },
  {
    id: 'portal',
    judul: 'Portal santri dan wali',
    ringkas:
      'Dua portal terpisah dengan hak baca-saja yang ditegakkan di server. Santri tidak dapat mengubah nilai atau presensinya sendiri.',
    langkah: [
      { judul: 'Portal Wali', detail: 'Mobile-first: ringkasan, hafalan, kesehatan, tagihan, pembayaran, riwayat SPP, kunjungan, izin.' },
      { judul: 'Portal Santri', detail: 'Beranda, pengumuman, jadwal, diniyah, LMS, tugas, hafalan, izin, pembayaran, kartu santri.' },
    ],
    gambar: [
      { file: 'portal-wali.png', caption: 'Portal wali pada lebar ponsel.' },
      { file: 'portal-santri.png', caption: 'Portal santri dengan dock navigasi di bawah.' },
    ],
    catatan:
      'Ke-16 santri sudah punya akun wali, tetapi baru 12 di antaranya memiliki baris relasi wali utama — empat portal wali sisanya masih menampilkan data wali kosong sampai relasinya dilengkapi lewat Kelola Data.',
  },
  {
    id: 'publik',
    judul: 'Halaman publik dan PPDB',
    ringkas:
      'Tamu tanpa sesi masuk ke halaman publik, bukan dinding masuk. Pendaftaran berjalan penuh di dalam aplikasi, tidak lagi menumpang formulir luar.',
    langkah: [
      { judul: 'Beranda dan profil pondok', detail: 'Angka pada beranda diambil dari agregat basis data.' },
      { judul: 'Wizard PPDB lima langkah', detail: 'Validasi NISN sepuluh digit, nomor ponsel, minimal satu unit, dan tiga berkas wajib.' },
      { judul: 'Nomor registrasi terbit', detail: 'Berformat PPDB-<tahun>-<urut>, berurutan, bukan acak.' },
      { judul: 'Cek status', detail: 'Nomor registrasi dilacak lewat linimasa empat tahap.' },
    ],
    gambar: [
      { file: 'publik-beranda.png', caption: 'Beranda publik dengan angka dari agregat basis data.' },
      { file: 'publik-ppdb.png', caption: 'Langkah pertama wizard PPDB.' },
      { file: 'publik-cek-status.png', caption: 'Cek status pendaftaran lewat nomor registrasi.' },
    ],
  },
  {
    id: 'audit',
    judul: 'Jejak audit',
    ringkas:
      'Tindakan yang mengubah keadaan dicatat dengan pelaku, ringkasan, dan isi perubahannya — termasuk pergantian peran, pengiriman WhatsApp, dan perubahan perangkat.',
    langkah: [
      { judul: 'Apa yang dicatat', detail: 'Aksi, entitas, id entitas, ringkasan terbaca manusia, perubahan sebelum dan sesudah, pelaku, dan waktu.' },
      { judul: 'Di mana dilihat', detail: 'Menu Kelola Data untuk peran yang berwenang.' },
    ],
  },
];

export const OPERASIONAL: { judul: string; isi: string }[] = [
  {
    judul: 'Menjalankan',
    isi: 'docker compose up -d --build dari apps/web-nuha. Layanan: nuha-mysql, wa-gateway, nuha-migrate (sekali jalan: migrasi + seed), dan nuha-app.',
  },
  {
    judul: 'Variabel wajib',
    isi: 'AUTH_SECRET minimal 32 karakter, dan WA_GATEWAY_ACCOUNT_TOKEN untuk mengelola perangkat WhatsApp — bangkitkan dengan openssl rand -hex 24. Tanpa keduanya, compose menolak berjalan.',
  },
  {
    judul: 'Variabel WhatsApp lain',
    isi: 'WA_DRY_RUN (bawaan true) menahan pengiriman sungguhan. WA_GATEWAY_TOKEN boleh dikosongkan: pengirim akan memakai perangkat pertama yang berstatus terhubung, sehingga menautkan nomor lewat QR langsung membuat pengiriman jalan tanpa mengubah env.',
  },
  {
    judul: 'Ketahanan data',
    isi: 'Kredensial WhatsApp tinggal di volume nuha_simterpadu_wa_data. Menghapus volume itu berarti semua nomor harus dipindai ulang.',
  },
  {
    judul: 'Jaringan',
    isi: 'Gateway tidak dipetakan ke port host — hanya aplikasi yang memanggilnya lewat jaringan compose, jadi tidak perlu aturan firewall baru.',
  },
];
