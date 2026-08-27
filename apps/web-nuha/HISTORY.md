# Riwayat Perubahan — web-nuha

Catatan perubahan yang di-commit, terbaru di atas. Setiap entri: tanggal,
hash commit, ringkasan, dan dampak operasional bila ada. Diperbarui setiap
kali ada perubahan yang di-commit (lihat CLAUDE.md §Dokumentasi & riwayat).

## 2026-08-27 — Kelola Data: aksi jadi ikon, limit paginasi (439bdcf2)

Tombol aksi tambah/ubah/hapus di `CrudPanel` diganti ikon saja (plus,
pensil, tong sampah — SVG inline, bukan dependensi baru) dengan
`title`/`aria-label` untuk aksesibilitas; hemat ruang di tabel compact.
Halaman `/data/[entity]` sekarang punya dropdown "Baris per halaman"
(10/25/50/100, default 10, sebelumnya hardcode 25) lewat komponen
klien baru `LimitPicker` (`components/molecules/LimitPicker.tsx`) dan
util `bacaLimit`/`OPSI_LIMIT` di `components/utils/pagination.ts`.
`engine.listRows` menerima parameter `ukuranHalaman` (default 10).
Tidak ada perubahan skema atau akses.

## 2026-08-27 — Kelola Data: tabel compact, form jadi modal, vlookup unit/kelas/kamar (dcdb90ad)

Halaman `/data` (Kelola Data): tabel CRUD kini padat (`table-compact`,
padding sel diperkecil) supaya lebih banyak baris terlihat sekaligus.
Form tambah/ubah tidak lagi memanjang di bawah tabel, melainkan modal
overlay (`.modal-overlay`/`.modal` baru di `globals.css`). Field
`unitId`/`kelasId`/`kamarId` (entitas santri, kelas, pegawai) yang
sebelumnya input ID angka manual sekarang dropdown yang menarik nama
dari master data (Unit/Kelas/Kamar) — pakai `Field.ref` di
`lib/crud/registry.ts` yang sudah ada di tipe tapi belum pernah
dipakai; `engine.toClientEntity` kini async dan resolve opsi lewat
Prisma. Tabel juga menampilkan nama, bukan ID mentah, untuk kolom yang
punya `ref`. Tidak ada perubahan skema.

## 2026-08-27 — Tambah siswa dipindah dari Data Induk ke Kelola Data (61eb21d7)

Halaman `/induk` (Data Induk) tidak lagi merender `CrudPanel` santri di
bawah baris filter — form tambah/ubah/hapus itu memecah fokus tampilan
master-detail (penjelajah lembaga → daftar → profil). Diganti tombol
"+ Tambah siswa" di header halaman yang mengarah ke `/data/santri`, tempat
CRUD entitas `santri` sudah tersedia lewat registry (`lib/crud/registry.ts`).
Tidak ada perubahan skema atau akses; hanya penempatan UI. Baris daftar
santri juga dapat hover state (`.baris-santri:hover`) untuk feedback klik.

## 2026-08-27 — Diniyah pondok jadi kelas 1–6

Unit Pondok Pesantren tidak lagi memakai satu rombel `Diniyah Wustha`.
Diganti enam baris `kelas` di tahun ajaran aktif dengan `nama` = `tingkat` =
`1`…`6`, satu rombel per tingkat. `prisma/seed.ts` ikut disesuaikan (loop
1–6, idempoten) supaya seed demo tidak menghidupkan `Diniyah Wustha` lagi.
Pengurutan tingkat di `app/akademik/pohon.ts` sudah numerik, jadi 1–6 tampil
berurutan tanpa perubahan kode.

## 2026-08-27 — `7b35e51e` Penamaan kelas: angka, huruf hanya bila >1 rombel

Struktur rombel disetel sesuai kondisi riil: tiap tingkat hanya satu kelas,
kecuali SMP kelas 9 yang punya dua (9A, 9B). Baris `kelas` di tahun ajaran
aktif kini: SMP `7`, `8`, `9A`, `9B`; MA `10`, `11`, `12` (dulu `X`/`XI`/`XII`);
Pondok `Diniyah Wustha`. Semua baris `kelas` warisan tanpa `tahun_ajaran_id`
(7A–7C, 8A–8D, 9A–9C lama) dihapus — tidak ada santri/jadwal/sesi yang
mereferensinya (DB memang masih kosong pasca seed-dasar).

Importir ikut disesuaikan supaya tidak menghidupkan nama lama:
`import-siswa-smp.ts` kini menurunkan nama kelas dari jumlah rombel per
tingkat (huruf hanya dipakai bila tingkat itu punya >1 identitas kelas),
`import-siswa-ma.ts` dan `import-jadwal-ma.ts` memakai `10`/`11` menggantikan
`X`/`XI`.

**Dampak operator**: jadwal MA yang sudah pernah diimpor dengan `kelas` =
`X`/`XI` (tabel `jadwal_pelajaran`, dicocokkan lewat string, bukan FK) perlu
diimpor ulang agar cocok dengan penamaan baru. Saat ini tabel itu kosong.

## 2026-08-26 — Rapikan kelas MA jadi tingkat saja (perubahan data, bukan kode)

Lanjutan pembersihan dummy: rombel MA contoh (`X-IPA-1`, `XII-Keagamaan`,
`XI-IPA-2`, dst.) dihapus, disisakan tiga baris `kelas` di tahun ajaran aktif
dengan `nama` = `tingkat` = `X`, `XI`, `XII`. Kelas SMP dan Pondok **tidak
disentuh** atas permintaan user.

Sekalian memperbaiki `tingkat` MA yang rusak: seed lama menurunkannya lewat
`nama.replace(/[^0-9X]/g, '')`, sehingga `X-IPA-1` → `X1` dan `XI-IPA-2` → `X2`,
dan `XII-Keagamaan` ikut tercatat tingkat `X`. Sekarang `tingkat` MA disamakan
dengan nama tingkatnya.

**Catatan**: `tingkat` bukan tabel sendiri melainkan kolom di `kelas`; daftar
tingkat di `/induk` diturunkan dengan mengelompokkan baris `kelas`
(`app/induk/pohon.ts`). Jadi tiap tingkat wajib punya minimal satu baris
`kelas`, kalau tidak tingkatnya hilang dari pohon. Rombel MA yang sebenarnya
ditambahkan lewat impor data nyata.

## 2026-08-26 — Hapus seluruh data dummy; seed dasar menggantikan seed prototype

Basis data masih 100% berisi data contoh dari `prisma/proto-data.json`
(87 santri, 29 pegawai, semua ber-email `@nuha.local`) — impor xlsx nyata
belum pernah dijalankan ke sana.

- **`scripts/purge-dummy.ts`** (baru, `npm run db:purge-dummy -- --yakin`):
  mengosongkan semua tabel operasional lalu menghapus semua `user`/`orang`
  selain superadmin. Dipertahankan: RBAC (`peran`/`menu`/`menu_peran`), master
  (`unit`, `kelas`, `tahun_ajaran`, `asrama`, `kamar`, `mata_pelajaran`,
  `template_wa`) dan akun `superadmin`. Skrip menolak jalan bila superadmin
  tak ditemukan, agar tak menghasilkan DB tanpa admin.
- **`prisma/seed-dasar.ts`** (baru): seed minimum — peran, menu + grant,
  unit, tahun ajaran, template WA, superadmin. **`nuha-migrate` kini memanggil
  ini**, bukan `prisma/seed.ts`; tanpa perubahan itu `docker compose up`
  berikutnya akan mengisi ulang data dummy. Seed prototype tetap ada sebagai
  `npm run db:seed:demo`.
- **`app/login/page.tsx`**: `defaultValue` kredensial demo dan blok "Akun demo"
  dihapus — akunnya sudah tidak ada dan itu membocorkan sandi di halaman publik.

**Dampak operator**: DB kini kosong dari data santri/pegawai. Login memakai
`superadmin` (sandi dari `SUPERADMIN_PASSWORD`, bawaan `Nuha2026!` — ganti).
Akun uji lain di CLAUDE.md sudah tidak berlaku. Backup pra-hapus ada di
`temp/backup-sebelum-purge-2026-08-26.sql` (tidak di-commit).

## 2026-08-26 — Akademik: penjelajah lembaga→tingkat→kelas + penyaring, sembunyikan 9 menu

`/akademik` sebelumnya menaruh semua rombel dua lembaga dalam satu dropdown
datar, dan tiap tab punya penyaringnya sendiri yang tak saling nyambung.

- **Penjelajah bertingkat** (`Penjelajah.tsx` + `pohon.ts`): Semua pesantren →
  SMP/MA/Pondok → tingkat → kelas, berupa chip dengan cacah santri. Cacah
  dihitung dengan penyaring lain tetap berlaku tapi tanpa unit/tingkat/kelas
  itu sendiri, jadi angka di chip = jumlah yang benar-benar didapat kalau
  chip itu diklik. Ada remah roti untuk mundur satu tingkat.
- **Penyaring bersama** (`filter.ts` + `BarisFilter.tsx`): pencarian, status,
  jenis kelamin, program, angkatan, asrama, dan urutan. Pilihan program/
  angkatan/asrama diambil dari data yang benar-benar ada — operator tak bisa
  memilih nilai yang hasilnya nol. Tiap filter aktif tampil sebagai chip yang
  bisa dicopot satu per satu, plus "Bersihkan semua".
- Keadaan filter hidup di URL (bisa di-bookmark & dibagikan) dan **dipakai
  bersama keempat tab** — Siswa, Presensi, Nilai, Rapor. Dropdown rombel di
  tab Nilai & Rapor ikut menyempit mengikuti penjelajah.
- Rombel bernama sama di tahun ajaran berbeda (data warisan punya dua "7A")
  kini diberi keterangan TA supaya dua chip tak lagi kembar tak terbedakan.
- **Menu disembunyikan** dari sidebar atas permintaan client: kurikulum,
  poskestren, keuangan, lms, gaji, ujian, kunjungan, ppdb, laporan. Daftarnya
  di `MENU_DISEMBUNYIKAN` (`components/templates/Shell.tsx`) — hapus kuncinya
  untuk memunculkan lagi. **Ini penyembunyian navigasi saja**: halaman dan
  `requirePage` tidak disentuh, jadi hak akses tak berubah dan URL langsung
  masih bisa dibuka oleh peran yang berhak.
- Gaya chip dipindah ke kelas bersama `.chip`/`.chip-aktif` di `globals.css`;
  `app/induk/BarisFilter.tsx` ikut memakainya (sebelumnya gaya sebaris).

Verifikasi: Playwright login `superadmin` ke `http://202.59.200.26:3226`,
keempat tab dirender tanpa `pageerror`, drill-down SMP→7→7A menyempitkan
hasil 87→60→11→1, sidebar terbukti tinggal 10 menu. `npx tsc --noEmit` bersih.

## 2026-08-26 — Data Induk: penjelajah lembaga→tingkat→kelas + penyaring

`/induk` sebelumnya hanya punya satu kotak cari nama; 87 santri dari dua
lembaga menumpuk dalam satu daftar datar tanpa cara menyempitkan.

- Kolom baru **Lembaga & kelas**: pohon `unit → tingkat → kelas` memakai
  `<details>` asli browser, jadi buka/tutup jalan tanpa JS klien. Tiap simpul
  menampilkan cacah santri yang **sudah menghormati filter lain**, sehingga
  angka di pohon = angka yang muncul saat simpul diklik (bukan cacah total
  yang menyesatkan).
- Penyaring cepat: status (Mukim/Kalong/Alumni/Keluar), jenis kelamin,
  angkatan (diambil dari `tahunMasuk` yang benar-benar ada di data, bukan
  daftar hardcode). Semua pilihan berupa **tautan**, bukan form — satu klik =
  satu keadaan URL yang bisa di-bookmark, dibagikan, dan di-*back*.
- Pencarian kini mencakup **NIS dan NISN**, bukan cuma nama.
- `whereFilter` disusun sebagai daftar `AND` (`app/induk/filter.ts`) supaya
  OR nama/NIS/NISN tidak bentrok dengan penyaring JK di relasi `orang` yang
  sama — versi awal yang menempel `where.orang` + `where.OR` sekaligus akan
  membuang syarat JK diam-diam.
- Klik kelas mereset `?sel=` karena santri terpilih bisa tersaring keluar.
- Baris daftar kini menampilkan NIS + badge status, tak lagi unit (unit sudah
  jelas dari cabang pohon yang sedang dibuka).

Diverifikasi lewat Chromium ke `http://202.59.200.26:3226` (login riil
superadmin): 6 kombinasi filter dirender tanpa `pageerror`/`console.error`,
dan cacahnya dicocokkan ke DB — MA=27, kelas X=8, Mukim+Putri=14, semua sama.

Catatan operator: kolom `kelas.tingkat` untuk MA tidak konsisten di data hasil
impor (`X`, `X1`, `X2`, `XI` hidup berdampingan), jadi pohon menampilkan
"Tingkat X1"/"Tingkat X2" yang janggal. Ini **data**, bukan kode — perlu
pembersihan di sisi impor/seed.

## 2026-08-26 — Fase 7: penjadwal notifikasi WA + reminder piket & ngajar

Penjadwal yang sebelumnya **tidak pernah ada** akhirnya dibangun. 20 dari 38
template WA bertanda "Terjadwal" (`WA-KEU-02` jatuh tempo H-3 08.00,
`WA-GUR-01` batas nilai 07.00, dst) selama ini **tidak pernah benar-benar
terkirim** — yang jalan hanya kirim manual dan pemicu di server action.

- Service `nuha-cron` terpisah di compose, **bukan** `setInterval` di Next.js:
  `output: 'standalone'` bisa punya lebih dari satu instans sehingga pesan
  akan terkirim ganda.
- `AntreanNotifikasi` berkunci idempoten `[kodeTemplate, tujuanId,
  tanggalJadwal]` — pencegahan ganda lewat kunci unik, bukan cek-lalu-tulis
  yang bisa balapan. Dibuktikan: tiga kali jalan, tetap 10 baris.
- Zona waktu WIB (UTC+7) ditangani eksplisit di `lib/penjadwal/waktu.ts`
  tanpa lib tambahan — container default UTC.
- Template baru `WA-GUR-04` (piket: H-1 19.00 dan H-0 45 menit sebelum shift)
  dan `WA-GUR-05` (rekap ngajar 06.30, satu pesan per guru agar tidak
  membanjiri). Semua pengiriman lewat `kirimWa()` sehingga tercatat di
  `LogWa` + `AuditLog` seperti kirim manual.
- **Ejaan hari beda antar tabel**: `jadwal_piket` memakai `Jum'at` (apostrof,
  ikut foto sumber) sedangkan `jadwal_pelajaran` memakai `Jumat` polos.
  Ditangani dua tabel nama hari terpisah, bukan locale.

**Yang perlu diketahui operator — reminder belum bisa terkirim ke siapa pun:**

- **Nol dari 29 pegawai punya nomor HP.** `DATA GURU.xlsx` tidak memuat kolom
  itu sama sekali. Jadi seluruh 10 baris antrean berstatus
  `DilewatiTanpaHp` — dicatat eksplisit di log, bukan diam-diam dilewati dan
  bukan crash. **Penjadwalnya jalan dan teruji, tapi reminder baru sampai ke
  guru setelah client menyerahkan nomor HP.** Tidak ada nomor palsu yang
  diisikan ke DB untuk membuat ini "berhasil".
- **Koreksi atas angka yang sempat mengkhawatirkan**: 67 dari 115 baris
  `jadwal_pelajaran` memang ber-`pegawai_id` NULL, tetapi itu **bukan**
  tanda pemetaan guru gagal. Rinciannya: 41 baris jadwal fiktif SMP + 5
  Pondok dari seed prototype, 19 baris MA fiktif lain, dan dari data client
  nyata (kelas X & XI) hanya **3**: `TKA` dan `EKSTRA` yang sengaja NULL
  (kegiatan tanpa pengampu tunggal), plus satu baris seed basi
  ("Pak Agus Salim", Sabtu XI jam 8 — punya kolom `ruang` yang tidak pernah
  diisi importir). Pemetaan data client praktis lengkap: 48 dari 50 slot.
- Baris seed fiktif itu masih perlu dibersihkan agar laporan tidak rancu.

## 2026-08-26 — Fase 4: struktur organisasi dari SK

Model baru `JabatanStruktural` (migrasi aditif murni: satu `CREATE TABLE` +
FK, nol perubahan tabel lama) berisi 40 baris dari dua SK: 9 pengurus MA
(008/YKM-NH/SK-MA/VII/2026) dan 31 pengurus Asrama Putra
(006/YKM-NH/SK-APa/VII/2026). Tab "Struktur" baru di `/kepegawaian`.

**Keputusan desain: jabatan struktural BUKAN peran RBAC — nol peran baru
ditambahkan** (tetap 12). `peran` mengatur akses menu; jabatan seperti
"Kepala Laboratorium", "Wakil Ketua Bid. Humas", atau "Div. Keamanan" tidak
butuh menu yang dibedakan — Kepala Madrasah memakai peran `kepma`, Lurah
memakai `pengasuh`. Menjadikan 31 pengurus asrama sebagai peran login akan
meledakkan RBAC tanpa guna. Jadi ini murni data organisasi.

**Yang perlu diketahui operator:**

- **Hanya 8 dari 40 baris tercocokkan ke `Pegawai`**, sisanya `pegawai_id`
  NULL dengan `nama_mentah` terisi. Itu benar, bukan kegagalan impor:
  "Tika Kartika, S.Pd" (Kepala Madrasah) dan "Dra. Nyai Hj. Roudlatul
  Hasanah" memang tidak ada di tabel Pegawai, dan 30 dari 31 pengurus asrama
  adalah santri/pengurus pondok, bukan pegawai.
- **9 pengurus asrama ternyata ADA sebagai `Orang`** (santri) — dicek dengan
  query nama. `JabatanStruktural` hanya punya FK ke `Pegawai`, jadi
  keterkaitan itu **belum terekam**. Kalau nanti perlu, tambahkan `orangId`
  nullable; sengaja tidak dilakukan sekarang agar tidak menebak lingkupnya.
- **Batas divisi 28 pengurus asrama (no 4–31) SENGAJA tidak ditebak.** Di
  ekstraksi PDF, label "Div. Pendidikan" muncul *setelah* nama ke-4 sehingga
  tidak jelas apakah label mengawali atau mengakhiri kelompoknya. Semua
  disimpan `jabatan='Pengurus'`, `divisi=NULL`. **Perlu konfirmasi client.**
  Yang pasti: no 1–3 (Lurah, Sekretaris, Keuangan) memang tidak berdivisi.
- **Satu orang boleh menjabat lebih dari satu kali** — kunci uniknya
  `[skNomor, urutan]`, bukan per orang. Isma Izha Utama memegang 3 baris
  (Waka Sarpras + Kepala Laboratorium di MA, dan no. 26 di asrama).
- "Muhammad Bismar As Sidiq" di SK asrama **tidak** dipautkan ke
  "Muhammmad Bismar As Sidiq, S.H" (guru MA) walau ejaannya mirip —
  konteksnya beda (pengurus pondok vs guru), jadi tidak dipastikan.
- Idempoten lewat upsert `[skNomor, urutan]`; dibuktikan dua kali jalan,
  tetap 40 baris.

## 2026-08-26 — Fase 6: modul Kepegawaian (piket, jurnal, presensi, SK)

Lima model baru (`JadwalPiket`, `JurnalMengajar`, `PresensiPegawai`,
`BebanJam`, `ArsipSk`) lewat migrasi aditif — nol `DROP`/`TRUNCATE`, data
lama utuh (87 santri, 29 pegawai). Menu `kepegawaian` + 5 tab, berkas SK
disajikan lewat route bergerbang `berkas/[nama]/route.ts`, **bukan**
`public/`.

**Jadwal piket terisi 5 dari 17 baris.** Sumbernya foto tabel MPLS, yang
client konfirmasi dipakai sebagai piket reguler. Yang perlu diketahui
operator:

- **12 baris dilewati, tidak membatalkan seluruh impor** (kebijakan sama
  dengan `import-siswa-smp.ts`). Keduabelas nama itu tidak ada di tabel
  `Pegawai` sama sekali — seluruhnya diduga **guru SMP, yang datanya memang
  belum pernah diserahkan client**. Menahan 5 baris yang sudah pasti benar
  berarti reminder piket Fase 7.2 tak bisa diuji sampai data itu tiba.
- **Tiga ejaan diperbaiki lewat pemetaan eksplisit** (`EJAAN_FOTO` di
  `import-piket.ts`), masing-masing hanya punya satu kandidat: "M. Bismar
  As-Shidiq" → `Muhammmad Bismar As Sidiq` (tiga m), "Muchammad Said" →
  `Fitri Muchammad Sa’id` (apostrof U+2019), "Warda Haizatil" →
  `Wardatul Haizatil Husna`. Pencocokan itu sendiri **tidak dilonggarkan**.
- **Jum'at hanya 2 shift**, bukan 3 seperti hari lain → total 17 baris, bukan
  18. Shift kedua Jum'at (09.00-11.05) juga tidak nyambung dari shift pertama
  (07.00-09.35) — kemungkinan salah cetak di sumber, **diimpor apa adanya**.
- `JadwalPiket` diberi `@@unique([hari, waktuMulai])` supaya importir
  idempoten; dibuktikan dengan jalan dua kali, tetap 5 baris.
- `BebanJam` dan `ArsipSk` sengaja masih kosong (belum ada sumber datanya).

**Bug seed yang ikut ketemu & dibereskan**: `seed.ts` mengasumsikan satu wali
utama per santri, padahal importir data client menandai **ayah dan ibu**
sebagai kontak utama (itu benar — keduanya dihubungi). Akibatnya seed jatuh
dengan P2002 di `user_username_key` karena mencoba membuat dua akun
`wali.<nis>`. Kini pemegang akun dipilih deterministik (`waliId` terkecil);
wali lain tetap ada sebagai relasi, hanya tanpa akun login.

## 2026-08-26 — `43d6745b` — Fase 3: importir XLSX data client nyata

Data client sungguhan masuk ke DB, menggantikan sebagian data fiktif
`proto-data.json`. Semua importir idempoten — dibuktikan dengan menjalankan
dua kali dan menghitung baris, bukan dari status perintah.

| Perintah | Hasil |
|---|---|
| `npm run import:guru-ma` | 17 Pegawai unit MA |
| `npm run import:siswa-ma` | 19 Santri (11 kelas XI TA 2025/2026, 8 kelas X 2026/2027) |
| `npm run import:siswa-smp` | 52 Santri (2 baris cacat dilewati) |
| `npm run import:jadwal-ma` | 50 JadwalPelajaran, `pegawaiId` terisi 48/50 |

**Yang perlu diketahui operator:**

- **Importir SMP melewati baris cacat, tidak membatalkan seluruh berkas.**
  Form pendataan diisi manual oleh banyak orang sehingga selalu ada sel salah
  (ditemukan: NIK 17 digit di KELAS 8 baris 9, NISN kosong di baris 21). Baris
  yang dilewati dicetak lengkap; perbaiki di berkas sumber lalu jalankan ulang.
- **`import:presensi-ma` sengaja tidak menulis apa pun.** CSV client adalah
  rekap agregat per siswa (`Total Hadir/Terlambat/Pulang`) tanpa kolom tanggal,
  sedangkan `Presensi` berkunci `[santriId, tgl, sesi]`. Angka sumbernya juga
  tidak konsisten: `Hari Tercatat` bernilai 1 di semua baris padahal
  Hadir+Terlambat+Pulang mencapai 30. **Perlu ekspor presensi per-tanggal dari
  client.**
- **`alias-guru.ts` jadi 16 entri.** "B. Ifa" dipetakan ke Kholifatun Khasanah
  — satu-satunya guru MA dengan mapel "Fisika, Kimia", dan "B. Ifa" hanya
  muncul mengampu KIM/FIS. **Masih perlu konfirmasi client.**
- **"TKA" dan "EKSTRA" bukan nama guru** → masuk `KODE_BUKAN_GURU`,
  `pegawaiId` dibiarkan NULL. Konsekuensinya dua slot itu tidak akan menerima
  reminder ngajar Fase 7.
- **"P. Bismar" dipetakan ke ejaan `DATA GURU.xlsx`** (`Muhammmad`, tiga m)
  karena berkas itulah sumber baris Pegawai — bukan ejaan SK (`Muh.`).
- Pencocokan nama guru memakai bentuk yang diratakan (gelar dibuang, apostrof
  lengkung U+2019 diseragamkan, huruf berulang dirapatkan) dan **hanya menerima
  kecocokan tunggal**; nol atau ambigu ditolak dan diselesaikan dengan menambah
  entri eksplisit di kamus, bukan dengan melonggarkan pencocokan.
- SMP ternyata 52 siswa, bukan 38 seperti dugaan rencana — sheet
  "KELAS 9 A&B" berisi dua rombel sekaligus. Rekap client menyebut 70;
  selisihnya masih terbuka.

## 2026-08-26 — `72e4967a` — Fase 1, 2 & 5: skema data client + importir keuangan

Skema disiapkan agar data client bisa masuk apa adanya, plus importir CSV
keuangan.

- Model baru `TahunAjaran`; `Kelas` di-scope ke tahun ajaran
  (`@@unique([unitId, nama, tahunAjaranId])`) karena "X" 2025/2026 dan "X"
  2026/2027 berisi orang berbeda.
- `StatusHadir` ditambah `Terlambat` dan `PulangCepat` — dua metrik utama di
  presensi MA yang sebelumnya hilang saat impor.
- `Santri.nis` jadi opsional: seluruh data client hanya punya NISN.
- FK `Kelas.waliKelasId` dan `JadwalPelajaran.pegawaiId` menggantikan
  pencocokan by-nama. Kolom string lama ditandai deprecated, tidak dihapus.
- `Pegawai`, `Orang` (alamat terstruktur), `RelasiWali` diperluas; model baru
  `ProfilKesehatan` dan `JadwalDiniyah` (Madin berbasis kitab, bukan kelas).
- Periode aktif `2026/2027 Gasal` tidak lagi hardcode — kini baris
  `TahunAjaran` yang di-seed.
- Fase 5: importir CSV keuangan di `prisma/import/`. **Validasi seluruh berkas
  lebih dulu; satu galat berarti batal tanpa menulis apa pun ke DB** — bukan
  gagal separuh jalan. `Tagihan.dibayar` dihitung ulang dari `SUM(Pembayaran)`,
  nilai di CSV hanya dipakai sebagai kondisi awal.

**Jebakan migrasi yang sudah dibereskan** (catat untuk migrasi berikutnya):
migrasi awal men-drop index unik `kelas(unit_id, nama)` sebelum penggantinya
ada, padahal FK `kelas.unit_id` bersandar pada index itu → MySQL galat 1553.
Urutannya dibalik dan ditambah index penopang `kelas_unit_id_idx`. Selain itu
image `nuha-migrate` **harus di-build ulang** sebelum dijalankan (`docker
compose build nuha-migrate`), dan setiap migrasi yang gagal separuh jalan
meninggalkan DDL parsial yang harus diperiksa serta dibersihkan sebelum
mencoba lagi.

**Dampak operasional**: `vitest.config.mts` diperluas agar `include` mencakup
`prisma/**/*.test.ts` — tanpa itu test importir tidak pernah dijalankan
`npm test`.

## 2026-08-26 — `4ee19a5d` — Fase 7: notifikasi WA reminder piket & ngajar

- **Temuan operasional penting**: dari 38 template WA di
  `prisma/proto-data.json`, **20 bertanda "Terjadwal"** (mis. `WA-KEU-02`
  jatuh tempo H-3 pukul 08.00, `WA-GUR-01` batas input nilai 07.00), tetapi
  pencarian `cron|setInterval|scheduler|node-cron` di seluruh `app/` dan
  `lib/` **tidak menemukan penjadwal apa pun**. Artinya seluruh notifikasi
  terjadwal selama ini **tidak pernah benar-benar terkirim** — yang jalan
  hanya kirim manual dan pemicu di dalam server action.
- Fase 7.1: service `nuha-cron` terpisah di compose, bukan `setInterval` di
  Next.js — `output: 'standalone'` bisa punya lebih dari satu instans
  sehingga pesan akan terkirim ganda. `AntreanNotifikasi` diberi kunci
  idempoten `[kodeTemplate, tujuanId, tanggalJadwal]`.
- Fase 7.2 `WA-GUR-04` reminder piket — butuh model `JadwalPiket` baru
  (`piket` di proto-data hanya array JSON tanpa model, tak bisa di-query).
  Sumbernya foto jadwal piket MPLS; **perlu konfirmasi client** apakah
  berlaku juga sebagai piket reguler.
- Fase 7.3 `WA-GUR-05` reminder ngajar — rekap pagi 06.30, satu pesan per
  guru. Bergantung pada `JadwalPelajaran.pegawaiId` (Fase 1 butir 5): tanpa
  FK itu sistem tidak bisa menemukan nomor HP guru, karena jadwal hanya
  menyimpan nama panggilan ("B. Hasni") yang tak cocok dengan `Orang`.
- **Dampak operasional — pengalihan nomor saat debugging**: seluruh
  notifikasi WA dialihkan ke `085607550989` (`6285607550989`), dikirim dari
  perangkat `085735248244` (`6285735248244`). Diterapkan lewat env
  `WA_DEBUG_REDIRECT` dan `WA_SENDER_NUMBER`, **tidak di-hardcode**.
  Pengalihan aktif terlepas dari `WA_DRY_RUN` supaya aman menguji pengiriman
  sungguhan; nomor tujuan asli tetap dicatat agar log tetap berguna.
  **`WA_DEBUG_REDIRECT` wajib dikosongkan sebelum produksi** — selama masih
  terisi, tidak ada wali santri yang menerima notifikasi apa pun.

## 2026-08-26 — `7d188296` — Rencana import data client + template keuangan

- Audit 14 dokumen client di `docs/` (XLSX/PDF/DOCX/CSV) dibandingkan dengan
  `prisma/schema.prisma` dan `prisma/proto-data.json`. Hasilnya
  `docs/RENCANA-IMPORT.md`: 6 fase, dari perubahan skema sampai fitur baru.
- **MA dikonfirmasi baru berjalan 2 tahun** — hanya kelas X (8 siswa,
  TA 2026/2027) dan XI (11 siswa, TA 2025/2026), total 19. Kelas XII belum
  ada dan **bukan** data yang hilang; jadwal client pun hanya X & XI.
- Temuan skema yang menghalangi impor: enum `StatusHadir` tidak punya
  `Terlambat`/`PulangCepat` padahal itu metrik utama di presensi MA;
  `Kelas` belum di-scope tahun ajaran sehingga "X" dua angkatan bertabrakan;
  `Santri.nis` wajib tapi kolom NIS di seluruh data client kosong (hanya
  NISN); jadwal memakai nama panggilan guru ("B. Hasni", "Miss Via") yang
  tidak sama dengan nama resmi sehingga pencocokan by-nama pasti pecah.
- Madrasah Diniyah diusulkan jadi `Unit` sendiri (7 jenjang I'dad–Enam,
  22 asatidz) dengan model `JadwalDiniyah` terpisah — `JadwalPelajaran`
  tidak cocok karena kuncinya `@@unique([hari, jamKe, kelas])` sedangkan
  Madin berbasis kitab dan tempat non-kelas.
- **Dampak operasional**: `prisma/proto-data.json` masih 100% fiktif; tidak
  ada satu pun nama nyata dari client yang sudah masuk sistem.
- Template keuangan di `docs/templates/` (tagihan, pembayaran, gaji, kas)
  karena client belum menyerahkan data keuangan sama sekali. Kolomnya
  mengikuti persis field model Prisma; NISN dipakai sebagai kunci santri
  karena NIS belum ditetapkan.
- **Berkas sumber client sengaja tidak di-commit** — memuat NIK, no. KK,
  dan nomor HP siswa serta orang tua yang nyata.

## 2026-08-24 — `749ad0a4` — Pagination di pengguna, PPDB, tunggakan, kurikulum, CRUD generik

- Molecule `components/molecules/Pagination.tsx` + util
  `components/utils/pagination.ts` (`UKURAN_HALAMAN`, `satu`, `bacaHalaman`)
  diekstrak dari pola yang sudah ada di `TabSiswa.tsx`, lalu dipakai ulang.
- Ditambahkan ke: `TabPengguna` (akun `User` termasuk santri+wali),
  `TabPendaftar`/`TabSeleksi`/`TabKelulusan` (PPDB), `TabTunggakan`
  (tagihan lintas santri, pakai `$queryRaw` karena Prisma tak bisa
  bandingkan dua kolom di `where`), `TabSoal`/`TabPerangkat` (bank soal &
  perangkat ajar).
- **Dampak operasional**: `lib/crud/engine.ts` (`listRows`) sebelumnya
  diam-diam memotong hasil ke 100 baris tanpa indikasi apa pun ke user
  (tidak ada total count, tidak ada halaman berikutnya) — kini
  `app/data/[entity]/page.tsx` menampilkan pagination sungguhan untuk
  semua entitas registry. Halaman lain (referensi kecil, agregasi,
  entity-scoped) sengaja tidak disentuh — lihat plan pagination audit.

## 2026-08-23 — `d7bc8fdc` — Restrukturisasi `components/` ke atomic design

- `components/ui/primitives.tsx`, `charts.tsx`, `Tabs.tsx`, dan
  `components/Shell.tsx` dipecah ke `components/atoms/`, `molecules/`,
  `organisms/`, `templates/`, dan `utils/` — pure restructure, tidak ada
  perubahan behavior atau styling.
- `components/index.ts` jadi barrel export sehingga seluruh import di
  `app/**` (104 file) cukup diarahkan ke satu path (`@/components`) tanpa
  perlu memecah tiap import statement per simbol per file baru.
- `app/**/Tab*.tsx` dan `page.tsx` tetap di lokasi masing-masing (constraint
  Next.js file-based routing) — hanya path import yang berubah.

**Dampak operasional**

- Tidak ada perubahan Prisma, query, atau route — verifikasi cukup lewat
  `npx tsc --noEmit` (hijau) dan smoke test setelah rebuild image
  (`docker compose build nuha-app && docker compose up -d nuha-app`):
  login superadmin, `/`, `/akademik`, `/keuangan`, `/kepesantrenan`,
  `/poskestren` semuanya render 200 tanpa error server.
- `npm run lint` tidak bisa dijalankan di host ini (Node 18.19, Next 16
  butuh ≥20.9) — pre-existing, bukan akibat perubahan ini.
- Kontributor baru: komponen UI generik ditambah di level yang sesuai
  (`atoms/` untuk elemen tunggal, `molecules/` untuk komposit kecil,
  `organisms/` untuk chart/komponen besar) lalu diekspor lewat
  `components/index.ts` — jangan tambah lagi file flat di `components/ui/`
  (folder itu sudah dihapus).

## 2026-08-23 — `376820e2` — Ujian berbasis komputer (CBT) dengan IRT dan anti-curang

- Delapan model baru (`soal`, `opsi_soal`, `paket_soal`, `butir_paket`,
  `sesi_cbt`, `peserta_cbt`, `jawaban_peserta`, `log_kecurangan`) lewat migrasi
  aditif `20260823210000_cbt_ujian_online` — tidak ada tabel lama yang diubah.
  `BankSoal` yang sudah ada tetap metadata kurikulum; butir sungguhan hidup di
  `soal`.
- `lib/cbt.ts`: koreksi otomatis enam tipe soal, pengacakan deterministik
  per peserta, analisis butir (p dan D dari kelompok 27% atas/bawah), IRT tiga
  parameter, dan penaksiran theta lewat pencarian kemungkinan maksimum.
  32 tes unit di `tests/cbt.test.ts`.
- Modul `/ujian` bertambah empat tab: Bank Soal, Sesi CBT, Pengawasan
  (termasuk panel penilaian esai), dan Kartu Ujian siap cetak.
- Portal santri bertambah tab **Ujian CBT** dan layar pengerjaan
  `/portal/santri/ujian/<id>` dengan autosave, penanda ragu-ragu, hitung waktu,
  dan pengawasan sisi klien.

**Dampak operasional**

- Token sesi hanya tampil saat sesi berstatus Berjalan; kartu ujian sengaja
  tidak memuat token karena dibagikan jauh sebelum ujian.
- Pembekuan peserta setelah batas pelanggaran dilakukan server dan tidak
  pernah dibatalkan otomatis — pengawas yang membuka kembali, tercatat di audit.
- Kunci zona jaringan (`sesi_cbt.ip_prefix`) memakai awalan IP pemanggil.
  Sesi contoh pertama sengaja dibiarkan terbuka agar bisa diuji dari luar lab.
- Analisis butir menolak berjalan di bawah empat responden.
- Peran pengelola ujian kini termasuk `superadmin` (sebelumnya hanya ketua dan
  kepala unit), supaya akun debug bisa menjalankan aksi pengelolaan.
- Seed CBT (`prisma/seed-cbt.ts`) idempoten; sesi berstatus Berjalan diberi
  jendela waktu relatif terhadap saat seed dijalankan agar benar-benar bisa
  dicoba.

## 2026-08-23 — `a770bdca` — Bagian onboarding proyek di /docs

- Lima bagian baru di paling atas /docs untuk orang yang baru mengenal
  proyek: "Proyek ini untuk apa" (4 unit + prinsip satu identitas), peta
  seluruh modul per kelompok urusan, lima alur data inti (PPDB → santri,
  nilai, uang masuk, santri sakit, WhatsApp), cara sistem dibangun, dan
  glosarium istilah pesantren.
- Data di `app/docs/onboarding.ts` + komponen `Onboarding.tsx` terpisah
  agar tiap file tetap < 400 baris. Sidebar bertambah 5 item (total 19).
- Diverifikasi Chromium via IP publik: 5 section render, 7/7 klik sidebar
  menandai item benar, nol pageerror.

## 2026-08-23 — `72dec77c` — Smooth scroll + fix scroll-spy /docs

- Lompatan dari sidebar kini meluncur halus (`scroll-behavior: smooth`,
  dimatikan bila pengguna menyetel prefers-reduced-motion).
- Bug "klik item, yang menyala malah di atasnya" diperbaiki. Akar masalahnya
  `loading="lazy"` pada screenshot: gambar termuat di tengah luncuran
  menggeser tata letak sehingga anchor mendarat di bagian sebelumnya. Lazy
  dilepas, scroll-spy dihitung dari posisi scroll (bagian terakhir yang
  melewati garis baca), dan klik mengoreksi posisi hingga tepat sasaran.
- Diverifikasi Chromium: 14/14 klik menandai item yang benar; scroll manual
  bergerak maju berurutan.

## 2026-08-23 — `4c569a35` — Sidebar navigasi di /docs

- Daftar isi berpindah dari kartu di atas konten menjadi sidebar kiri yang
  sticky, dengan scroll-spy (item bagian yang sedang dibaca ditandai) dan
  tombol kembali ke aplikasi. Layar ≤860px: berubah jadi pill daftar isi di
  atas konten; saat print disembunyikan.
- Komponen baru `app/docs/NavSamping.tsx` (client, IntersectionObserver);
  lebar halaman docs 880 → 1180px dua kolom.

## 2026-08-23 — `bda183df` — Manajemen ujian + kartu guru lintas unit

- Model baru `Ujian`, `JadwalUjian`, `NilaiUjian`; kolom `unit_id` pada
  `jadwal_pelajaran` (backfill dari nama kelas). Migrasi
  `20260823190000_ujian_dan_unit_jadwal`.
- Modul `/ujian` (menu `ujian`, peran: ketua, kepsmp, kepma, guru): tab
  Gelombang (status Draf→Berjalan→Selesai oleh kepala unit; gelombang Selesai
  mengunci nilai), Kartu Ujian, dan Input Nilai per sesi oleh guru pengampu.
  Santri absen disimpan barisnya dengan nilai 0. Semua aksi diaudit.
- Kartu "Kelas Saya" ditulis ulang: dikelompokkan per unit (SMP + MA + pondok),
  badge Wali Kelas / Ustadz Diniyah, KKM, kelengkapan nilai + rerata, rincian
  presensi hari ini, sesi ujian terdekat.
- Seed: jadwal lintas unit per guru + kelas Diniyah Wustha; ujian hanya untuk
  mapel yang benar-benar diajarkan (sesi basi dari mapel data-uji dibersihkan).
- Dampak: jumlah menu berubah (superadmin 18, ketua 16, kepala unit 11,
  guru 10); `nuha-migrate` perlu build ulang sebelum run.

## 2026-08-23 — `54dccc56` — Peran guru, pairing WhatsApp QR, halaman /docs

- Tab Perangkat di /notifikasi: daftarkan nomor, tampilkan QR (scan dari WA
  mobile), status terhubung/putus; kredensial Baileys di volume
  `nuha_simterpadu_wa_data`.
- Compose mewajibkan `WA_GATEWAY_ACCOUNT_TOKEN` (sandi buatan sendiri untuk
  endpoint kelola perangkat gateway) — tanpa itu compose menolak start.
- Halaman `/docs` bergerbang sesi: alur per modul + screenshot dari
  `docs-assets/` lewat route ber-auth (bukan `public/`).
- Peran ketua yang salah dicabut dari akun musyrif.b@ dan tu.smp@.

## 2026-08-22 — `2c7de099` — Super admin + pemilih peran

- Akun `superadmin` dengan seluruh menu; dropdown "Lihat sebagai" untuk
  menyamar sebagai peran lain (server menolak bila peran asli bukan super
  admin; tercatat sebagai GANTI_PERAN).

## 2026-08-22 — `95afd81a` — Port seluruh modul, portal, dan halaman publik

- 14 modul staf bertab, portal santri & wali (baca-saja ditegakkan server),
  halaman publik + wizard PPDB 5 langkah + cek status.

## 2026-08-21 — `f693d3f6` — Design system, shell, dashboard

- Token warna, primitif UI, Shell (sidebar gradient + ticker agenda), dan
  dashboard diport dari prototype `apps/marketing/sub/nuha`.

## Sebelumnya

- `8daa40b1` prototype → aplikasi nyata (Next.js + Prisma + MySQL, Docker).
- `07a208ac`, `e07367ee`, `34507351` modul akademik–laporan, portal, WA,
  payroll, audit, CRUD generik.
- `8fb6f31c` fix kuki login di atas http (kenapa verifikasi wajib lewat IP
  publik, bukan localhost).
