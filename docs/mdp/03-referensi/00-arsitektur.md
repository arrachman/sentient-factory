---
slug: /referensi/arsitektur
sidebar_position: 1
title: Arsitektur & Konsep
---

# Arsitektur & Konsep

Halaman ini menjelaskan kerangka aplikasi MDP yang **berlaku seragam di seluruh
modul**: posisi sistem, struktur navigasi (shell), dan **model interaksi CRUD**
yang dipakai ulang oleh hampir semua halaman. Pahami ini sekali → Anda paham
cara kerja 40+ halaman.

## 1. Posisi sistem (ISA-95)

MDP adalah lapisan **Level 3 / MOM**. Ia tidak menyimpan saldo bisnis (itu milik
ERP) dan tidak terhubung langsung ke mesin (itu Level 2-0, fase mendatang).
Perannya: **menerima rencana dari ERP, mengeksekusi di lapangan, mengemit hasil
balik ke ERP.**

| Aspek | Senti ERP (L4) | Senti MDP (L3) |
| --- | --- | --- |
| Fokus | Perencanaan bisnis | Eksekusi operasi |
| Kecepatan data | Harian/transaksional | Real-time/per-shift |
| Pengguna | Staf kantor | Operator, QC, teknisi |
| Contoh objek | Work order, invoice, stok | Production log, inspeksi, downtime |
| Saldo stok | **Memiliki & posting** | Hanya mengemit pergerakan |

## 2. Shell aplikasi

Setiap halaman digambar dalam **shell** yang sama:

![Halaman Master Data dengan sidebar modul ter-expand](/img/mdp/master-work-centers.png)

- **Topbar** — brand `Sentient / MDP`, breadcrumb konteks (*Manufacturing
  Digitalization Platform · ISA-95 Level 3*), kotak **Cari semua** global
  (pintasan `K`), serta ikon notifikasi, aktivitas, dan **pengaturan**.
- **Sidebar kiri** — daftar modul MOM (MES, WMS, QMS, CMMS, PRTS, DMS, IMS, LMS),
  **OEE**, dan **Master Data**. Grup yang aktif ter-*expand* menampilkan
  sub-halaman. Sidebar ini **role-aware**: isinya difilter dari peta
  `role → menu` (lihat [Akses Menu per Role](/mdp/referensi/master-data#7-akses-menu-per-role)).
  Bila user belum punya pemetaan, ditampilkan pohon menu penuh sebagai fallback.
- **Area konten** — judul halaman + tag modul, sub-judul (domain · deskripsi),
  toolbar, dan tabel/konten.

## 3. Model interaksi CRUD (penting)

Mayoritas halaman MDP adalah **halaman CRUD seragam** (organism
`MasterCrudPage`). Mengenali polanya berarti Anda bisa mengoperasikan modul
apa pun tanpa pelatihan ulang. Bagian ini membedah **tambah, edit, dan hapus**
langkah-demi-langkah, lengkap dengan tangkapan layar dan **semua pesan
info/peringatan** yang mungkin muncul.

### 3.1 Anatomi halaman daftar

![Halaman daftar Shift — toolbar, filter bar, tabel, footer pintasan](/img/mdp/crud-01-list-shifts.png)

Setiap halaman daftar punya empat zona tetap:

1. **Toolbar (kanan-atas)** — kotak **Cari semua**, **Export**, **Refresh**
   (⟳), dan tombol biru **+ Tambah**.

   | Kontrol | Fungsi | Pintasan |
   | --- | --- | --- |
   | **Cari semua** | Filter baris berdasarkan teks (debounce ±280 ms, dikirim ke server) | `/` |
   | **Export** | Unduh data tampilan | — |
   | **Refresh** (⟳) | Muat ulang dari server (ikon berputar saat memuat) | — |
   | **+ Tambah** | Buka form pembuatan record baru | `N` |

2. **Filter bar** — ikon filter, sub-judul `domain · deskripsi`, dan **penghitung
   baris** di kanan (mis. `59 shift`).
3. **Tabel** — kolom **bisa diurutkan** (klik header; indikator `↑/↓`, kolom
   angka rata-kanan). Kolom **Status** memakai *badge* berwarna (mis. `Aktif`,
   `RELEASED`, `IN_PROGRESS`, `COMPLETED`). **Kolom kiri = checkbox** untuk
   seleksi (basis aksi massal/hapus). **Sel kode** adalah tautan yang membuka
   form Edit. **Sel paling kanan = tombol ⋯ (Aksi)**.
4. **Footer** — pintasan keyboard: `/` cari · `N` tambah · `J/K` navigasi baris ·
   `X` pilih · `Enter` buka (Edit baris fokus).

:::info Form berupa *drawer*, bukan modal tengah
Form Tambah/Edit muncul sebagai **panel geser (drawer)** dari sisi kanan, bukan
dialog di tengah layar. Tutup panel lewat tombol **✕**, **Batal**, tombol
`Escape`, atau klik area gelap (*backdrop*) di luar panel.
:::

### 3.2 Menambah record (Tambah / `N`)

Klik **+ Tambah** (atau tekan `N`). Drawer **Tambah _«Nama»_** terbuka dengan
form kosong.

![Drawer Tambah Shift — field wajib bertanda * dan tombol Simpan masih nonaktif](/img/mdp/crud-02-add-modal-empty.png)

**Yang perlu diperhatikan pada form kosong:**

- **Field wajib bertanda bintang `*`** (mis. `*Kode`, `*Nama`, `*Mulai`,
  `*Selesai`). Field tanpa `*` bersifat opsional.
- **Tombol _Simpan_ dan _Simpan & Tambah Baru_ NONAKTIF (pudar)** selama masih
  ada field wajib yang kosong. Ini adalah **validasi utama**: sistem mencegah
  simpan, bukan menampilkan pesan error merah per-field. Tombol baru aktif
  setelah **semua** field wajib (bertipe teks/angka/waktu) terisi.
- Setiap *placeholder* memberi contoh format (mis. `SHIFT-1`, `Shift Pagi`).

Isi seluruh field wajib:

![Drawer Tambah Shift terisi — tombol Simpan kini aktif (biru)](/img/mdp/crud-04-add-filled.png)

Setelah valid, pilih salah satu aksi di footer:

| Tombol | Perilaku |
| --- | --- |
| **Simpan** | Simpan record, **tutup** drawer, daftar dimuat ulang. |
| **Simpan & Tambah Baru** | Simpan record lalu **kosongkan form** untuk entri berikutnya (drawer tetap terbuka). Hanya muncul saat **Tambah**, tidak saat Edit. |
| **Batal** | Tutup tanpa menyimpan. |

Saat proses simpan berjalan, tombol berubah menjadi **“Menyimpan…”**. Bila
berhasil, baris baru langsung tampak di daftar (di sini `SHIFT-DOC127`):

![Daftar setelah simpan — record baru muncul di tabel](/img/mdp/crud-05-add-success.png)

:::caution Bila simpan gagal
Jika server menolak (mis. kode duplikat atau sesi kedaluwarsa), drawer **tidak
tertutup** dan muncul **pesan error merah di atas form** berisi keterangan dari
server (atau teks cadangan *“Gagal menyimpan”*). Perbaiki input lalu simpan
ulang.
:::

### 3.3 Mengedit record

Tidak ada menu *dropdown* terpisah — **ada empat cara** membuka form Edit untuk
sebuah baris:

1. **Klik sel Kode** (teks biru) pada baris.
2. **Klik dua kali** di mana saja pada baris.
3. **Klik tombol ⋯ (Aksi)** di ujung kanan baris.
4. **Tekan `Enter`** saat baris sedang difokus (navigasi `J/K`).

Drawer terbuka dengan judul **Edit _«Nama»_** dan field **terisi nilai saat
ini**. Perhatikan footernya hanya berisi **Batal** dan **Simpan** — opsi
*Simpan & Tambah Baru* tidak ada di mode Edit.

![Drawer Edit Shift — field terisi nilai existing, footer Batal/Simpan](/img/mdp/crud-edit-drawer.png)

Ubah nilai → **Simpan**. Aturan validasi sama dengan Tambah (field wajib tak
boleh dikosongkan, jika tidak tombol Simpan nonaktif).

### 3.4 Menghapus record (soft-delete, lewat seleksi)

:::warning Tidak ada tombol “Hapus” per baris
Penghapusan **hanya** dilakukan lewat **seleksi massal**, bukan dari tombol ⋯
(yang justru membuka Edit). Ini sengaja agar penghapusan tidak terjadi karena
salah klik.
:::

**Langkah:**

1. **Centang checkbox** di kolom kiri pada satu/lebih baris (atau tekan `X` pada
   baris yang difokus). Centang header memilih **semua** baris.
2. Muncul **bilah aksi massal** mengambang di bawah layar: penghitung
   **“_N_ dipilih”**, tombol **🗑 Hapus**, dan **Batal**.

   ![Bilah aksi massal — “1 dipilih · Hapus · Batal”](/img/mdp/crud-selection-bulkbar.png)

3. Klik **Hapus**. Muncul **dialog konfirmasi bawaan peramban**:

   > **Hapus _N_ «noun» yang dipilih?** — mis. *“Hapus 1 shift yang dipilih?”*

   Tekan **OK** untuk menghapus, atau **Cancel** untuk batal. (Bila tetap ingin
   batal, tombol **Batal** pada bilah membersihkan seleksi.)
4. Setelah konfirmasi, baris hilang dari daftar dan daftar dimuat ulang:

   ![Daftar setelah hapus — record terpilih sudah tidak tampak](/img/mdp/crud-after-delete.png)

:::note Soft-delete — data tidak benar-benar hilang
“Hapus” adalah **soft-delete**: record hanya ditandai `deletedAt` di basis data
dan disembunyikan dari daftar — **tidak** dihapus permanen. Pemulihan masih
mungkin di tingkat DB. Field audit (`createdAt`/`updatedAt` + pembuat) tetap
tersimpan.
:::

### 3.5 Field form menurut tipe

Field di-render menurut tipe data:

| Tipe | Tampilan & catatan |
| --- | --- |
| **text** | Kotak teks biasa (mis. Kode, Nama). |
| **number** | Input angka; kuantitas/durasi diisi manual. |
| **time** | Pemilih jam `HH:mm` (mis. Mulai/Selesai shift). |
| **datetime** | Pemilih tanggal-waktu **lokal**, dikonversi ke **ISO UTC** saat simpan. |
| **select** | Daftar pilihan enum (mis. status/tipe). |
| **checkbox** | Sakelar boolean (mis. **Aktif**). |

:::warning Referensi antar-record (FK) masih berupa ID mentah
Pada *functional slice* saat ini, **field relasi (FK) diisi sebagai ID numerik
mentah**, bukan pemilih *lookup* visual. *Placeholder*-nya menyebut **tabel
sumber** yang dirujuk — perhatikan contoh form *Material Consumptions* berikut:
`*Production Order ID` (`mes_production_orders id`), `*Item ID (ERP)`
(`md_items id`), `Source Bin ID` (`md_storage_bins id`).

![Form FK ID mentah — placeholder menyebut tabel sumber, plus sub-judul postingStatus PENDING](/img/mdp/crud-11-mes-consumption-add-fk.png)

**Risiko:** mengisi ID yang salah akan membuat rujukan menggantung — referensi
lintas-app bersifat *scalar* dan **tidak** ditegakkan FK basis data. Pastikan ID
benar (salin dari daftar entitas terkait). Pemilih *lookup* visual adalah
peningkatan yang direncanakan.
:::

:::note Manual-entry-first
Semua angka (kuantitas, durasi, hasil ukur) diisi **manual** oleh operator.
Desain sudah menyediakan titik ekstensi untuk integrasi mesin/SCADA, tetapi itu
**bukan bagian MVP**.
:::

### 3.6 Daftar pesan info & peringatan

Ringkasan **semua pesan** yang bisa Anda temui di halaman CRUD dan artinya:

| Pesan / kondisi | Kapan muncul | Arti & tindakan |
| --- | --- | --- |
| **Bintang `*`** pada label + **Simpan nonaktif** | Form Tambah/Edit dengan field wajib kosong | Validasi: isi semua field wajib agar tombol Simpan aktif. |
| **Pesan error merah di atas form** (mis. *“Gagal menyimpan”*) | Server menolak saat simpan (kode duplikat, sesi habis, dll.) | Baca keterangan, perbaiki input, simpan ulang. Drawer tetap terbuka. |
| **“Gagal memuat data: …”** (merah, di area tabel) | Gagal mengambil daftar dari server | Cek koneksi/sesi, klik **Refresh**. |
| **“Memuat…”** | Sedang mengambil data | Tunggu; tabel terisi setelah selesai. |
| **“Menyimpan…”** pada tombol | Proses simpan berjalan | Tunggu hingga selesai. |
| **“Hapus _N_ «noun» yang dipilih?”** (dialog peramban) | Setelah klik **Hapus** pada bilah massal | **OK** = soft-delete; **Cancel** = batal. |
| **Sub-judul `postingStatus PENDING s/d emit`** | Halaman MES *Consumptions* & WMS *Movements* | Record menunggu **emit ke ERP** lewat *outbox* (masih di-stub). Stok ERP belum terposting hingga emit. |
| **Placeholder `… id` pada field FK** | Form dengan relasi (mis. `mes_production_orders id`) | Isi **ID mentah** dari tabel sumber; belum ada *lookup*. Salah ID = rujukan menggantung. |
| **Sidebar menampilkan menu penuh** | Role pengguna belum dipetakan di [Akses Menu per Role](/mdp/referensi/master-data#7-akses-menu-per-role) | *Fallback* pohon menu penuh; petakan role untuk membatasi navigasi. |
| **Diarahkan ke `/login`** | Tidak ada cookie `erp_token` atau respons API `401` | Sesi belum/sudah tidak valid — login ulang dengan akun ERP. |

## 4. Konvensi data & integrasi

- **Penamaan tabel**: `<domain>_<plural>` (mis. `mes_production_orders`,
  `qms_inspections`). Domain MDP: `mdp`, `eam`, `mes`, `qms`, `mnt`, `wms`,
  `prt`, `dms`, `ehs`, `lms`.
- **Field standar**: setiap record punya `code`/`name`, status `isActive`,
  *soft-delete* `deletedAt`, dan audit (`createdAt`/`updatedAt` + pembuat).
  Uang/kuantitas `Decimal(19,4)`; semua waktu UTC.
- **Kontrak L4↔L3** (lihat tiap modul):
  - **WMS** mengemit pergerakan → **ERP `inv_`** yang memposting stok.
  - **MES** mengeksekusi `mfg_work_orders` ERP → mengemit log produksi balik.
  - **OEE** = metrik **turunan** (dihitung dari MES/CMMS/QMS), tanpa tabel
    sumber sendiri.
  - Emit ke ERP berjalan lewat **outbox** (sedang di-stub); record yang
    menunggu emit bertanda `postingStatus = PENDING`.
- **Backend**: NestJS di `api-gateway`, endpoint `/api/mdp/...`, dijaga JWT
  (cookie `erp_token`, autentikasi memakai akun ERP yang sama).

## 5. Login

Akses MDP memakai akun ERP yang sama (Single Sign-On lewat cookie `erp_token`).

![Halaman login Senti MDP](/img/mdp/login.png)

Masukkan **username/email** dan **password**. Sesi yang berhasil mengarahkan ke
**Beranda** (`/app`).
