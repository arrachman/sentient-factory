# DESIGN-PLAN.md — PT Tarik Data Digital

Rencana desain untuk rebranding `https://tarikdata.digital/` dari situs mono-produk
(Sentient Factory) menjadi situs multi-produk vendor software institusi.

Ditulis sebelum koding, sesuai instruksi brief §6. Berisi keputusan, alasan,
kritik-diri terhadap daftar "yang harus dihindari", dan revisinya.

---

## 0. Ringkasan keputusan

| Aspek | Keputusan |
|---|---|
| Konsep | **"Arsip institusi"** — halaman terasa seperti dokumen resmi yang dirancang baik, bukan brosur SaaS |
| Warna dasar | Hijau-tinta gelap `#0B2E26` di atas kertas `#F6F7F5` |
| Aksen suite | Health `#0F6B5C` · Edu `#1B5E8C` · Biz `#8A5A18` — satu keluarga, beda hue |
| Display | Newsreader (serif, opsz variable) — dipakai hemat |
| Body | IBM Plex Sans — teks panjang bahasa Indonesia |
| Elemen signature | **Rel modul (module rail)** — pita horizontal core platform yang menembus semua halaman |
| Ikon | SVG stroke inline 1.5px, satu set konsisten. Nol emoji |

---

## 1. Titik berangkat: apa yang salah dengan situs sekarang

Sebelum memutuskan arah baru, ini yang saya baca dari
`apps/marketing/tarik-data-digital.html` (1729 baris):

| Masalah | Bukti | Konsekuensi |
|---|---|---|
| Emoji sebagai ikon | 49 emoji (`🚀 Lihat Produk`, `📩 Konsultasi`, `🧠 Senti AI`, `🔔 0`) | Terbaca konsumer/startup, bukan vendor institusi |
| Klaim tim fiktif | "Tim engineer kami menerapkan standar kode tinggi", "Dibangun oleh Tim yang Passionate" (`:1193`) | Runtuh saat due diligence — perusahaan dijalankan satu founder engineer |
| Kalimat pemanis tanpa informasi | "Teknologi Harus Berdampak" (`:1109`), "Passionate terhadap Data" | Nol informasi, biaya kredibilitas |
| Statistik kosong | Hero stats: `1 PRODUK UNGGULAN`, `AI POWERED PLATFORM` (`:693-710`) | Angka yang mengaku angka tapi bukan angka. `1` sebagai "prestasi" justru melemahkan |
| Link mati | `href="#"` di LinkedIn, Instagram, kebijakan privasi, S&K (`:1307,1315,1434,1440,1524,1527`) | Sinyal negatif terkuat untuk pembeli institusi |
| Mono-produk | Seluruh halaman = Sentient Factory, framing manufaktur | Direktur RS tidak menemukan dirinya di halaman ini |
| Dekorasi generik | 3 floating orb + grid lines + mockup gradient warna-warni (`:670-675`) | Default "AI startup 2023" |

Kesimpulan: ini bukan pekerjaan re-skin. Struktur informasi, copy, dan sistem
visualnya harus diganti bersamaan.

---

## 2. Untuk siapa halaman ini dirancang

Tiga pembaca, semuanya konservatif, semuanya membeli dengan uang institusi
dan reputasi pribadi:

1. **Direktur / manajer IT rumah sakit** — takut proyek RME mangkrak dan
   kena temuan saat akreditasi. Membaca dari ponsel di sela rapat.
2. **Kepala yayasan / pengurus pondok** — anggaran ketat, tidak teknis,
   sangat peduli "kalau vendornya hilang bagaimana".
3. **Manajer operasional / owner UMKM-menengah** — paling siap membeli,
   paling ingin lihat produknya jalan sekarang.

Ketiganya punya satu kecemasan sama, dan itu yang harus dijawab desain:
**"apakah vendor ini akan masih ada tiga tahun lagi, dan apakah dia benar-benar
mengerti sektor saya?"**

Implikasi desain langsung:
- Keterbacaan > kejutan visual. Ukuran body tidak boleh di bawah 17px.
- Setiap klaim harus punya jangkar yang bisa diverifikasi di dekatnya.
- Mobile-first bukan formalitas — pembaca (1) memang membaca di ponsel.

---

## 3. Konsep: "arsip institusi"

Metafora yang saya pilih: **berkas resmi yang dirancang dengan baik** — akta,
dokumen akreditasi, laporan tahunan. Bukan brosur SaaS, bukan koran.

Kenapa ini benar untuk brief ini:
- Pembeli institusi menghabiskan hidupnya membaca dokumen. Bentuk ini
  membangkitkan rasa "resmi dan tertata" tanpa harus mengklaim apa pun.
- Memberi izin untuk jujur: dokumen resmi tidak berteriak, tidak pakai
  testimoni, tidak perlu "10.000+ pengguna". Justru **kekosongan klaim jadi
  konsisten dengan bentuknya**, bukan terasa seperti ada yang kurang.
- Membedakan dari semua kompetitor vendor SIM RS / SIM sekolah lokal, yang
  hampir seragam memakai template biru-korporat dengan stok foto.

Yang **bukan** konsep ini: bukan broadsheet/koran (itu larangan eksplisit di
brief §6.3). Beda kuncinya ada di §7 — saya pakai radius, elevation, dan ruang
napas lebar; koran justru radius nol dan kolom padat.

---

## 4. Palette

Enam warna bernama. Semua sudah diuji kontras (skrip WCAG, hasil di §4.3).

### 4.1 Warna inti

| Token | Hex | Peran |
|---|---|---|
| `--ink` | `#0B2E26` | Master brand. Teks utama, surface gelap, logo |
| `--paper` | `#F6F7F5` | Latar halaman |
| `--surface` | `#FFFFFF` | Kartu, panel yang terangkat |
| `--muted` | `#4A5A55` | Teks sekunder, caption |
| `--line` | `#DDE2DF` | Border, pemisah |

`--ink` adalah **hijau-tinta gelap**, bukan navy. Ini keputusan sadar:
navy (`#0A1628`) adalah warna situs lama dan warna default seluruh kategori
"software korporat Indonesia". Hijau-tinta membaca sama seriusnya, sama
institusionalnya — tapi tidak tertukar. Pada ukuran kecil ia terbaca hampir
hitam; yang tersisa hanya kesan hangat yang tidak bisa ditunjuk. Itu efek
yang saya mau.

### 4.2 Aksen per suite

Satu aksen per suite, satu keluarga (semua desaturated, semua gelap cukup
untuk teks di atas kertas):

| Suite | Token | Hex | Tint permukaan |
|---|---|---|---|
| Senti Health | `--health` | `#0F6B5C` | `#E6F0ED` |
| Senti Edu | `--edu` | `#1B5E8C` | `#E7EEF4` |
| Senti Biz | `--biz` | `#8A5A18` | `#F2EBDD` |

Keluarga dijaga lewat tiga aturan: (a) semua di rentang lightness sempit,
(b) semua saturasi menengah — tidak ada yang neon, (c) semua diturunkan dari
`--ink` dengan pergeseran hue, bukan diambil dari color picker terpisah.
Hasilnya: dipakai berdampingan di beranda tetap terbaca sebagai satu sistem;
dipakai sendiri di halaman sektor, tiap halaman punya identitas.

Pemetaan hue-nya juga bukan acak — hijau untuk kesehatan, biru untuk
pendidikan, dan cokelat-emas untuk bisnis/retail adalah asosiasi yang sudah
dipegang pembaca Indonesia. Desain tidak perlu melawan itu.

### 4.3 Verifikasi kontras (WCAG)

Diukur dengan skrip, bukan dikira-kira. Rasio terhadap `--paper` `#F6F7F5`:

```
--ink       #0B2E26   13.64:1   AA body PASS   AAA PASS
--muted     #4A5A55    6.77:1   AA body PASS   AAA PASS
--health    #0F6B5C    5.96:1   AA body PASS
--edu       #1B5E8C    6.46:1   AA body PASS
--biz       #8A5A18    5.49:1   AA body PASS

Teks putih di atas surface gelap:
  #0B2E26  14.65:1     #0F6B5C   6.41:1
  #1B5E8C   6.94:1     #8A5A18   5.90:1

--ink di atas tint suite:
  health-tint 12.60:1   edu-tint 12.51:1   biz-tint 12.35:1
```

Tidak ada kombinasi teks di sistem ini yang di bawah 5.4:1 — lewat AA (4.5)
dengan margin, dan sebagian besar lewat AAA (7.0). `--line` `#DDE2DF` hanya
untuk border non-teks (1.22:1, tidak berlaku syarat teks); untuk border yang
membawa makna (mis. batas input) dipakai `--muted`.

**Focus ring** `#B8791A` — 3.38:1 terhadap kertas, lewat syarat WCAG 2.1
komponen non-teks (3:1), dan sengaja beda hue dari ketiga aksen suite supaya
ring tetap terlihat di halaman sektor mana pun.

---

## 5. Tipografi

### 5.1 Dua peran

**Display — Newsreader** (Google Fonts, SIL OFL).
Serif dengan sumbu optical-size variable (`opsz 6..72`). Dipakai **hanya**
untuk h1 dan h2, tidak pernah untuk body atau UI.

Alasan memilih ini, bukan serif lain: Newsreader punya `opsz` sungguhan,
jadi pada ukuran hero (56px) kontras stroke-nya mengencang dan terasa tegas,
sementara pada h2 (32px) ia melunak dan tetap nyaman. Serif statis tidak bisa
melakukan ini — ia akan terlihat kurus di ukuran besar atau berat di ukuran
kecil. Dan ia **bukan** serif display kontras-tinggi bergaya editorial
(Playfair, Fraunces) yang jadi bagian dari larangan §6.1.

**Body — IBM Plex Sans** (SIL OFL).
Dipakai untuk semua teks lain: paragraf, navigasi, tombol, tabel, form.

Alasannya spesifik untuk konteks ini: Plex dirancang untuk dokumentasi teknis
panjang, punya tinggi-x besar (nyaman dibaca di ponsel), angka tabular untuk
blok legalitas dan tabel harga, serta bentuk huruf yang netral-tapi-tidak-hambar.
Plex juga **bukan** Inter — Inter adalah default de-facto setiap situs SaaS,
dan brief ini menolak apa pun yang terasa template.

### 5.2 Dukungan diakritik

Diverifikasi langsung ke Google Fonts API, bukan diasumsikan: kedua font
menyediakan subset `latin-ext` (`U+0100-02BA, …, U+20A0-20AB, …`), yang
mencakup seluruh kebutuhan ortografi bahasa Indonesia serta glyph mata uang.
Subset yang dimuat dibatasi ke `latin` + `latin-ext` saja — cyrillic, greek,
dan vietnamese tidak diunduh.

### 5.3 Skala tipe

Modular, rasio 1.25 (major third) — cukup untuk hierarki jelas tanpa lompatan
dramatis yang bikin halaman terasa seperti iklan. Fluid dengan `clamp()`.

| Token | Mobile → Desktop | Font | Pemakaian |
|---|---|---|---|
| `--fs-hero` | 34px → 56px | Newsreader 600 | h1, satu per halaman |
| `--fs-h2` | 26px → 34px | Newsreader 600 | judul seksi |
| `--fs-h3` | 19px → 21px | Plex 600 | judul kartu |
| `--fs-lead` | 18px → 20px | Plex 400 | paragraf pembuka |
| `--fs-body` | 17px → 17px | Plex 400 | teks utama |
| `--fs-sm` | 15px → 15px | Plex 400 | caption, meta |
| `--fs-mono` | 14px → 14px | Plex Mono 500 | nomor legalitas, kode |

Body dikunci 17px di semua ukuran — pembaca target berusia 40+, dan 16px
default terlalu kecil untuk membaca paragraf kepatuhan di ponsel.
Panjang baris dibatasi `65ch` untuk teks mengalir.

### 5.4 Detail

- `line-height`: 1.15 display · 1.6 body · 1.5 UI
- `letter-spacing`: −0.02em pada hero, 0 pada body, +0.08em pada label kecil huruf besar
- Angka legalitas dan tabel pakai `font-variant-numeric: tabular-nums`

---

## 6. Token lain

**Spasi** — skala 4px: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
Ritme vertikal seksi: 96px mobile, 128px desktop.

**Radius** — `--r-sm 4px` (input, tag) · `--r-md 8px` (kartu) · `--r-lg 12px`
(panel besar). Tidak ada `border-radius: 0` menyeluruh (itu tanda broadsheet),
dan tidak ada pill 999px kecuali pada tag status.

**Elevation** — hanya dua tingkat, keduanya berbasis bayangan hijau-tinta
transparan (bukan hitam netral, supaya menyatu dengan palette):
- `--e1: 0 1px 2px rgba(11,46,38,.06), 0 1px 1px rgba(11,46,38,.04)`
- `--e2: 0 4px 16px rgba(11,46,38,.08)`

Kartu diam pakai `--e1` + border `--line`. `--e2` hanya untuk dropdown navigasi
dan hover kartu sektor. Tidak ada bayangan besar-lembut ala "floating card".

**Motion** — transisi 160ms `ease-out`, hanya untuk `opacity`, `transform`,
`background-color`, `border-color`. Seluruh animasi dibungkus
`@media (prefers-reduced-motion: reduce)` yang menihilkan durasi.

---

## 7. Layout

Grid 12 kolom, `max-width: 1200px`, gutter 24px mobile / 32px desktop.

Aturan yang membuat ini **bukan** broadsheet meski sama-sama disiplin:
- Ruang putih lebar antar seksi (96–128px), koran justru padat
- Radius 4–12px, koran radius nol
- Maksimal dua kolom teks berdampingan, koran empat-lima
- Blok bisa lebih pendek dari kolomnya; tidak ada usaha meratakan bawah

**Header** — sticky, tinggi 64px, latar `--paper` dengan border bawah tipis.
Navigasi utama: Solusi (dropdown 3 sektor) · Produk (dropdown 4 modul) ·
Perusahaan · Sumber daya · tombol "Jadwalkan demo".
Dropdown dibuka klik (bukan hover) supaya bisa dipakai keyboard dan sentuh;
`aria-expanded` dan `Escape` untuk menutup.

**Beranda** — urutan sesuai brief §4:
hero → pemilih sektor → arsitektur platform → modul lintas sektor →
bukti kredibilitas → cara kami bekerja → studi kasus → CTA + kontak.

**Halaman sektor** — hero sektor → masalah yang dikenali → modul relevan →
kepatuhan & integrasi → model implementasi & timeline → FAQ pengadaan → CTA.
Setiap halaman sektor mewarisi seluruh sistem, hanya menukar `--accent`
lewat satu class di `<html>` (`data-suite="health|edu|biz"`).

**Catatan CSS (brief §7):** padding antar-seksi dikendalikan **satu** class
utilitas (`.section`), tidak pernah lewat selector tipe (`section > div`) yang
bisa saling membatalkan. Semua warna suite lewat satu variabel `--accent`
yang di-set di satu tempat — tidak ada override per-komponen.

---

## 8. Elemen signature: rel modul

Satu hal yang membuat halaman ini diingat, dan hanya satu.

**Bentuknya.** Pita horizontal setinggi ±120px berisi empat modul core
(Senti AI · HR & absensi · Akun & RBAC · Dashboard & alert) yang digambar
sebagai segmen bersambung. Di atas pita, tiga kolom suite (Health / Edu / Biz)
turun dan **menancap** ke segmen yang mereka pakai — garis penghubungnya
digambar, bukan disiratkan.

**Kenapa ini, bukan dekorasi lain.** Ini satu-satunya elemen di halaman yang
memikul beban argumen: ia menjelaskan secara visual kenapa satu perusahaan
kecil masuk akal melayani rumah sakit, sekolah, dan toko sekaligus — bukan
karena banyak orang, tapi karena **satu arsitektur dipakai ulang**. Itu tesis
komersial perusahaan ini. Kalau pengunjung hanya mengingat satu gambar dari
situs ini, ini gambar yang benar untuk diingat.

**Di mana ia muncul.** Versi penuh dan interaktif di beranda. Versi mini
(pita saja, segmen yang dipakai sektor tersebut disorot) sebagai penanda di
puncak tiap halaman sektor. Pengulangan inilah yang menjadikannya identitas,
bukan ilustrasi sekali pakai.

**Bagaimana ia dibuat.** SVG inline, digambar tangan, tanpa library. Hover /
fokus pada kolom suite menyorot segmen terkait; tanpa JS ia tetap terbaca
penuh sebagai diagram statis. Di mobile ia berputar jadi susunan vertikal.
Disertai `<title>`/`<desc>` dan padanan teks untuk pembaca layar — diagram
yang memikul argumen tidak boleh hilang bagi pengguna screen reader.

---

## 9. Ikonografi

Satu set SVG stroke inline, `stroke-width: 1.5`, ujung `round`, kotak 24px,
`currentColor`. Digambar seperlunya — sekitar 20 ikon, tidak menarik library
ikon utuh (brief §7: tanpa library berat).

Nol emoji. Situs lama punya 49; semuanya diganti atau dihapus. Ini bukan
selera — emoji dirender berbeda di tiap OS, tidak mewarisi warna brand, dan
dibaca screen reader dengan nama resmi Unicode yang sering konyol dalam konteks
kalimat Indonesia.

---

## 10. Kritik-diri terhadap larangan brief §6

Saya uji rencana ini terhadap tiga default terlarang, dan menemukan dua
pelanggaran nyata yang sudah saya revisi.

### Larangan 1 — cream `#F4F1EA` + serif kontras tinggi + terracotta `#D97757`

Draf awal nyaris melanggar karena memakai cream hangat, serif, dan aksen Biz
cokelat-oranye. Revisi akhirnya menggeser kertas ke abu-hijau `#F6F7F5`,
menjaga aksen Biz sebagai cokelat-emas gelap `#8A5A18`, dan membatasi Newsreader
(yang berkontras sedang) hanya pada h1/h2. Warna master tetap hijau-tinta,
bukan pasangan cream-terracotta.

### Larangan 2 — hitam pekat + satu aksen acid

**Tidak melanggar.** Halaman ini berbasis terang. Permukaan gelap
(`--ink #0B2E26`) hanya dipakai di footer dan satu CTA band, dan warnanya
hijau-tinta bukan hitam. Tidak ada satu pun warna acid/neon di sistem;
aksen paling terang adalah `#0F6B5C` yang justru gelap. Dan aksennya tiga,
masing-masing punya tugas semantik — bukan satu aksen dekoratif.

### Larangan 3 — broadsheet: garis rambut, radius nol, kolom padat

Konsep arsip + serif sempat terlalu dekat dengan koran. Revisi memindahkan
struktur ke permukaan dan ruang, memakai radius 4–12px, jarak seksi 96–128px,
maksimal dua kolom teks, dan diagram rel modul sebagai elemen signature.
Garis hanya dipakai untuk pemisah sejati seperti header dan baris tabel.

### Larangan lain

- **Emoji sebagai ikon** — dihapus semuanya (49 → 0), diganti set SVG. §9.
- **Gradient mesh & glassmorphism** — tidak ada di sistem. Tidak ada
  `backdrop-filter`, tidak ada gradient dekoratif. Latar rata.
- **Tiga kolom fitur generik dengan ikon lingkaran** — pemilih sektor memang
  tiga kartu, tapi bukan pola itu: kartunya besar dan bisa diklik seluruhnya,
  masing-masing punya warna suite sendiri, isinya nama sektor + modul konkret,
  dan tidak ada ikon dalam lingkaran. Ia elemen navigasi, bukan daftar fitur.

### Risiko estetis yang saya ambil

Brief meminta satu risiko yang bisa dipertanggungjawabkan, di satu tempat saja.
**Risiko itu adalah rel modul (§8)** — diagram digambar tangan yang memikul
argumen komersial, sesuatu yang tidak dilakukan situs vendor sejenis. Ia
ditempatkan di satu tempat (beranda, dengan gema mini di halaman sektor).

Seluruh sisa halaman sengaja disiplin dan tidak mengambil risiko: hierarki
konvensional, warna terkendali, tidak ada animasi masuk, tidak ada layout
eksperimental. Audiensnya konservatif — satu ide kuat lebih baik dilindungi
oleh ketenangan di sekelilingnya daripada bersaing dengan lima ide lain.

---

## 11. Kebijakan klaim dan struktur output

Audit repo menunjukkan jarak besar antara copy marketing lama dan kemampuan
yang benar-benar dapat diverifikasi. Kebijakan status produk, batas klaim,
terminologi regulasi, serta struktur source/output dipisahkan ke
[CLAIM-POLICY.md](CLAIM-POLICY.md) agar dokumen desain tetap fokus dan setiap
file terjaga di bawah batas ukuran repo.

Prinsip yang tetap mengikat:

- Senti Health dan Senti Edu adalah program pengembangan untuk mitra desain awal.
- Senti HR adalah produk absensi, bukan HRIS penuh dan tidak mencakup payroll.
- POS berstatus rencana dan belum tersedia untuk produksi.
- Integrasi eksternal disebut sebagai kebutuhan/target sampai kredensial dan
  hasil pengujian tersedia.
- Tidak ada testimoni, logo klien, angka, atau klaim tim tanpa bukti dan izin.
- Output publik dibangun dari registry route dan harus bebas token internal.

Data yang belum tersedia dikumpulkan di [TODO-DATA.md](TODO-DATA.md), sedangkan
mapping URL lama hidup di [MIGRASI.md](MIGRASI.md).
