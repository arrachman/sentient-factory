---
sidebar_position: 1
title: Menambah, Mengubah & Menghapus Data
---

# Menambah, Mengubah & Menghapus Data

Hampir semua pekerjaan di Senti ERP berujung pada tiga tindakan yang sama:
**menambah** data baru, **mengubah** data yang sudah ada, dan sesekali
**menghapus** data yang keliru. Pola ketiganya konsisten di seluruh modul —
entah Anda mengelola master **Item**, **Partner**, **CoA**, atau dokumen
transaksi seperti PO dan Faktur. Jika Anda paham pola ini sekali, Anda paham
cara memakai seluruh aplikasi.

Panduan ini memakai halaman **Master Data → Item** sebagai contoh nyata, karena
Item adalah form paling lengkap di ERP (punya belasan bagian). Semua yang Anda
lihat di sini berlaku sama untuk halaman lain, hanya nama fieldnya yang berbeda.

:::info Contoh diambil dari data sungguhan
Semua tangkapan layar di bawah diambil langsung dari aplikasi produksi
(`erp.fr-labs.my.id`) memakai akun demo `rania`. Angka **601 rows** yang
tampil adalah jumlah item sebenarnya di database.
:::

---

## Titik awal: halaman daftar (grid)

Setiap master data dan dokumen dibuka sebagai **daftar** — tabel besar berisi
seluruh record. Dari sinilah semua tindakan dimulai.

![Daftar Item — grid, filter, toolbar, dan menu aksi per baris](/img/erp/crud/01-daftar-item.png)

Perhatikan empat area penting pada gambar di atas:

- **Toolbar kanan-atas** memuat tombol hijau **+ New** (menambah), **Export**
  (mengunduh), dan tombol **Refresh** (memuat ulang). Kotak **Search
  everything** di sebelahnya menyaring baris secara instan begitu Anda mengetik.
- **Bilah filter** (`Status: Active`, `Tipe: All`) mempersempit tampilan.
  **Reset filter** mengembalikan ke tampilan penuh. Filter tidak mengubah data —
  hanya apa yang Anda lihat.
- **Kolom** `CODE`, `NAME`, `TIPE`, `SATUAN`, `KATEGORI`, `STATUS`. Klik header
  kolom untuk mengurutkan; panah kecil menandakan arah urutan.
- **Ikon titik-tiga (⋮)** di ujung kanan setiap baris adalah **menu aksi** —
  pintu masuk untuk mengubah, menduplikat, melihat riwayat, atau menghapus baris
  itu.

Di kaki halaman ada **paginasi** (`1–25 of 601 rows`, pilihan `Show 25`) dan
daftar **pintasan keyboard**: tekan `N` untuk membuat baru, `J`/`K` untuk naik
turun baris, `X` untuk memilih baris. Pintasan ini mempercepat kerja Anda tanpa
menyentuh mouse.

---

## 1. Menambah data baru

### Contoh kasus

> **Use case.** Bagian pembelian baru saja menerima jenis material baru dari
> pemasok — *aluminium wire* ukuran baru yang belum pernah dibeli. Sebelum PO
> bisa dibuat, material ini harus terdaftar dulu sebagai **Item** di master data,
> lengkap dengan satuan (KG), kategori, dan akun-akun akuntansinya. Tanpa
> pendaftaran ini, transaksi apa pun yang menyebut material tersebut akan
> ditolak sistem karena itemnya belum ada.

### Langkah

Tekan tombol **+ New** di kanan atas (atau cukup ketik `N` di keyboard saat
berada di daftar). Sebuah **dialog form** terbuka di atas daftar:

![Form New Item — mode Cepat, hanya field wajib](/img/erp/crud/02-form-tambah-cepat.png)

Yang perlu Anda pahami dari form ini:

**Mode entri: Cepat vs Lengkap.** Perhatikan sepasang tombol di kanan-atas
form — **Cepat** (aktif, hijau) dan **Lengkap**. Mode **Cepat** sengaja
menyembunyikan kerumitan: ia hanya menampilkan *field yang wajib* (`hanya field
wajib`) supaya Anda bisa mendaftarkan item secepat mungkin. Mode **Lengkap**
membuka *semua* bagian detail (media, lampiran, harga, pajak, akuntansi, dan
seterusnya). Aturan praktisnya: pakai **Cepat** untuk pendaftaran cepat, beralih
ke **Lengkap** ketika Anda memang perlu mengisi detail lanjutan.

**Field dengan tanda bintang merah (`*`) wajib diisi.** Pada mode Cepat, yang
wajib adalah:

- **Kode** — identitas unik item. Tombol **Auto** di sebelahnya akan
  menghasilkan kode otomatis sesuai konfigurasi penomoran, sehingga Anda tak
  perlu memikirkan format sendiri.
- **Nama** — nama item yang akan muncul di semua transaksi.
- **Tipe** — menentukan perilaku item. Contoh `INVENTORY` berarti item ini
  *dilacak stoknya, punya HPP, bisa dijual, dan berwujud* (lihat teks kecil di
  bawah dropdown: `Track stok · HPP · Dijual · Berwujud`). **Tipe menentukan
  field mana yang muncul berikutnya** — mengganti tipe akan mengubah bagian form
  yang wajib diisi.
- **Kategori** dan **Satuan** — pengelompokan dan unit ukur (mis. KG).

Field seperti **Barcode** dan **Jenis Barang** bertanda opsional — boleh
dikosongkan.

Setelah semua terisi, Anda punya tiga pilihan di kaki form:

- **Save** — menyimpan dan menutup form.
- **Simpan & Tambah Baru** — menyimpan lalu langsung membuka form kosong lagi,
  ideal saat Anda mendaftarkan banyak item beruntun.
- **Cancel** — membatalkan; tidak ada yang tersimpan.

Bila penyimpanan berhasil, form tertutup, item baru langsung muncul di daftar,
dan sebuah **notifikasi hijau (toast)** singkat muncul di kanan-bawah layar
sebagai konfirmasi.

---

## Warning yang WAJIB Anda pahami: validasi field

Inilah bagian yang paling sering membingungkan pengguna baru. Jika Anda menekan
**Save** sementara ada field wajib yang kosong, ERP **tidak akan menyimpan**.
Sebaliknya, form otomatis melebar ke mode **Lengkap** dan menampilkan panduan
perbaikan yang sangat rinci:

![Warning validasi — banner merah "12 field perlu diperbaiki" beserta error inline per field](/img/erp/crud/03-validasi-wajib.png)

Ada **tiga lapis peringatan** sekaligus pada gambar di atas — bacalah ketiganya,
bukan hanya yang pertama:

1. **Banner merah di puncak form** — `12 field perlu diperbaiki`, diikuti daftar
   ringkas masalahnya: *Kode wajib diisi*, *Nama wajib diisi*, *Kategori wajib
   diisi*, *Satuan wajib diisi*, *Akun Persediaan wajib diisi untuk item
   Inventory*, dan `… dan 7 lainnya`. Banner ini adalah **ringkasan** semua
   kesalahan di seluruh bagian form, bukan hanya bagian yang sedang tampil.

2. **Navigator bagian di sisi kiri** — daftar bagian (Identitas, Klasifikasi,
   Media, Lampiran, Harga, Pajak, **Akuntansi**, dst.). Bagian yang masih
   bermasalah ditandai **titik merah**. Ini memandu Anda: klik bagian bertanda
   merah untuk melompat langsung ke field yang perlu diperbaiki, tanpa menebak.

3. **Error inline di bawah setiap field** — mis. kotak `Persediaan` berbingkai
   merah dengan teks `Persediaan wajib diisi` tepat di bawahnya. Pesan ini
   spesifik per field, jadi Anda tahu persis apa yang kurang.

Perhatikan juga indikator progres di kaki form: **`Terisi 0/12`** dan `Bagian 10
dari 12 · Akuntansi`. Angka ini memberi tahu berapa banyak dari total bagian
yang sudah lengkap — target Anda adalah membuatnya penuh.

> **Mengapa serumit ini?** Karena item bertipe `INVENTORY` ikut membentuk
> **jurnal akuntansi** saat dibeli/dijual. ERP menolak menyimpan item setengah
> jadi supaya tidak ada transaksi yang nanti gagal diposting gara-gara akun
> Persediaan/HPP/Penjualan belum ditentukan. Validasi keras di depan mencegah
> masalah besar di belakang. Bila Anda hanya butuh item sederhana tanpa
> akuntansi, ganti **Tipe** dari `INVENTORY` ke tipe non-stok — jumlah field
> wajib akan menyusut drastis.

**Cara mengatasi:** ikuti navigator kiri dari atas ke bawah, isi setiap bagian
bertanda merah, perhatikan angka `Terisi n/12` naik, lalu tekan **Save** lagi.

---

## 2. Mengubah data yang sudah ada

### Contoh kasus

> **Use case.** Nama material `ALUMINIUM WIRE - 3.50X0.90` ternyata salah ketik,
> atau satuannya perlu dikoreksi, atau item lama ingin dinonaktifkan karena
> pemasoknya berhenti memproduksi. Data sudah telanjur dipakai di banyak
> transaksi, jadi Anda tidak boleh menghapusnya — cukup **mengubah** field yang
> relevan. Perubahan langsung berlaku di seluruh dokumen yang merujuk item ini.

### Langkah

Pada baris yang ingin diubah, klik ikon **⋮** di ujung kanan. Muncul **menu
aksi**:

![Menu aksi baris — Edit, Duplikat, History, Delete](/img/erp/crud/04-menu-aksi-baris.png)

Empat pilihan yang tersedia:

- **Edit** — membuka form berisi data item untuk diubah.
- **Duplikat** — membuat item baru dengan menyalin isi item ini sebagai titik
  awal (hemat waktu untuk item yang mirip).
- **History** — melihat riwayat perubahan: siapa mengubah apa dan kapan.
- **Delete** (berwarna merah) — menghapus item; dibahas di bagian berikutnya.

Pilih **Edit**. Form terbuka mirip form tambah, tetapi kali ini **sudah terisi**
data item tersebut:

![Form Edit Item — field terisi data existing, navigator menunjukkan bagian yang sudah lengkap](/img/erp/crud/05-form-edit.png)

Beberapa hal yang membedakan dari form tambah:

- Judulnya **Edit Item**, dan kepala form menampilkan item yang sedang diedit
  (`ALUMINIUM WIRE - 3.50X0.90` · `AWL90--FL3.5X0.9`).
- **Kode** dan **Nama** sudah terisi nilai lama. Anda tinggal menimpanya.
- Di navigator kiri, bagian yang sudah punya data ditandai **ikon hijau/terisi**
  (mis. Identitas, Inventory & Tracking, Harga), sedangkan yang kosong tetap
  pucat. Progres `Terisi 4/12` menunjukkan item ini sudah cukup lengkap.
- Ubah field seperlunya — misalnya ganti **Status** dari `Aktif` ke `Nonaktif`
  untuk memensiunkan item tanpa menghapusnya — lalu tekan **Save**.

Aturan validasi yang sama berlaku: jika sebuah perubahan membuat field wajib
menjadi kosong/tidak valid, warning merah yang identik akan muncul dan
penyimpanan ditahan sampai diperbaiki.

:::tip Nonaktifkan, jangan hapus
Untuk data yang sudah pernah dipakai bertransaksi, **menonaktifkan** (Status →
Nonaktif) hampir selalu lebih aman daripada menghapus. Item nonaktif tidak lagi
muncul saat membuat transaksi baru, tetapi riwayat lama tetap utuh dan laporan
tetap konsisten.
:::

---

## 3. Menghapus data

### Contoh kasus

> **Use case.** Seseorang keliru mendaftarkan item **dobel** (duplikat), atau
> membuat item uji coba yang belum pernah dipakai di transaksi mana pun. Data
> semacam ini memang layak dibersihkan agar daftar tetap rapi. Menghapus item
> yang *sudah* dipakai bertransaksi sangat tidak disarankan — gunakan
> "Nonaktif" seperti dijelaskan di atas.

### Langkah

Buka menu **⋮** pada baris, lalu pilih **Delete** (opsi berwarna merah). ERP
**tidak langsung menghapus**. Yang muncul adalah **dialog konfirmasi**:

![Dialog konfirmasi hapus — "Delete item? ... will be permanently deleted"](/img/erp/crud/06-konfirmasi-hapus.png)

Baca isi dialog ini baik-baik — inilah warning paling penting di seluruh alur:

- Judul **Delete item?** dengan ikon tempat sampah.
- Baris penjelas menyebut **persis** item mana yang akan dihapus:
  `AWL90--FL3.5X0.9 — ALUMINIUM WIRE - 3.50X0.90 will be permanently deleted.`
  Selalu cocokkan kode & nama ini dengan item yang benar-benar Anda maksud
  sebelum melanjutkan.
- Kata kunci **"permanently deleted"** — penghapusan bersifat **permanen**.
  Berbeda dengan menonaktifkan, tindakan ini tidak menyimpan salinan yang mudah
  dikembalikan.
- Dua tombol: **Cancel** (`ESC`) untuk membatalkan dengan aman, dan **Delete**
  (`⏎`/Enter) berwarna merah untuk mengonfirmasi.

Jika Anda ragu sedikit saja, tekan **Cancel**. Jika yakin, tekan **Delete** —
item hilang dari daftar dan sebuah toast konfirmasi muncul.

:::danger Hapus tidak bisa "undo"
Dialog ini adalah satu-satunya pengaman sebelum data lenyap permanen. Untuk item
yang sudah tertaut ke stok, PO, atau faktur, sistem umumnya akan **menolak**
penghapusan (untuk menjaga integritas data) dan menampilkan pesan error —
itulah sinyal bahwa item tersebut harus dinonaktifkan, bukan dihapus.
:::

---

## Warning lain yang mungkin Anda temui: "Akses ditolak"

Kadang halaman daftar tidak menampilkan data sama sekali, melainkan panel
peringatan seperti ini:

![Akses ditolak — sesi berakhir atau tidak punya izin](/img/erp/crud/07-akses-ditolak.png)

Pesannya berbunyi **"Akses ditolak — Sesi mungkin sudah berakhir atau role Anda
tidak punya izin untuk membuka data ini."** disertai tombol **Coba lagi**. Ini
muncul ketika permintaan data ke server ditolak (status *401 Unauthorized*).
Dua penyebab lazimnya:

1. **Sesi login Anda kedaluwarsa** — cukup klik **Coba lagi**; bila masih gagal,
   keluar (logout) lalu masuk kembali untuk memperbarui sesi.
2. **Role akun Anda tidak memiliki izin** untuk modul tersebut — hubungi
   Administrator agar hak akses (role) Anda ditambahkan.

Toast merah di kanan-bawah mengulang pesan yang sama sebagai pengingat. Selama
panel ini tampil, tombol **+ New** memang ada, tetapi menyimpan data kemungkinan
juga akan ditolak server — jadi pulihkan dulu sesi/izin Anda sebelum
bertransaksi.

---

## Ringkasan pola

| Tindakan | Cara memulai | Pengaman | Hasil |
| --- | --- | --- | --- |
| **Tambah** | Tombol **+ New** / pintasan `N` | Validasi field wajib (banner + inline) | Record baru muncul di daftar |
| **Ubah** | Menu **⋮ → Edit** | Validasi yang sama saat Save | Perubahan berlaku di semua transaksi terkait |
| **Hapus** | Menu **⋮ → Delete** | Dialog konfirmasi "permanently deleted" | Record hilang permanen (bila tak tertaut transaksi) |

Pola yang sama ini berlaku untuk **Partner, CoA, Gudang, Kategori**, hingga
dokumen transaksi. Setelah terbiasa dengan Item, halaman-halaman lain akan
terasa akrab. Detail tiap modul ada di **[Referensi](/referensi/arsitektur)**.
