# Rencana Arsitektur — Presensi RFID (ESP32) + Notifikasi WA Wali

Status: rencana, belum diimplementasikan. Disusun 2026-08-30.

Alat: ESP32 + modul RFID RC522 + LCD 16x2 (sudah terpasang di MA).
Tujuan: santri tap kartu → presensi tercatat → WA otomatis ke nomor wali.

## 1. Keputusan inti

| Pertanyaan | Keputusan | Alasan |
|---|---|---|
| Transport ESP32 → server | **HTTPS POST langsung** ke `/api/perangkat/tap` | Tidak menambah service baru (MQTT broker). Beban nyata kecil: 30 tap ≈ 30 request dalam ~30 detik — jauh di bawah kapasitas Next.js. MQTT baru layak kalau perangkat >10 unit atau WiFi gerbang sering putus lama. |
| Stabilitas saat burst | **Endpoint tap tidak mengirim WA.** Tap hanya menulis DB lalu balas `200` (<200 ms). Pengiriman WA dilepas ke **outbox + worker** | Gateway Baileys serial dan lambat (~1–3 dtk/pesan). Kalau WA dikirim di dalam request tap, tap ke-30 menunggu ~60 dtk → LCD hang, santri antre, ESP32 timeout. |
| Kehilangan data saat WiFi putus | **Buffer di ESP32** (ring buffer di NVS/SPIFFS, ~200 tap) + kirim ulang dengan `tapId` unik | Presensi tetap valid meski server/WiFi mati; idempotensi mencegah duplikat saat kirim ulang. |
| Auth perangkat | **Token per perangkat** (`Authorization: Bearer <token>`), disimpan ter-hash | Endpoint ini terekspos jaringan; kuki sesi tidak berlaku untuk perangkat. |
| Trigger WA | Setiap tap **masuk** dan **pulang** | Sesuai permintaan; dilindungi dedup + jam tenang agar tidak spam. |

### Kenapa bukan MQTT (untuk sekarang)

MQTT unggul saat perangkat banyak dan koneksi labil, tapi menambah Mosquitto ke
compose, satu proses subscriber yang harus dijaga hidup, dan jalur auth kedua.
Manfaat utamanya — tahan jaringan putus — sudah didapat dari buffer di ESP32.
Kalau nanti ada >10 titik tap, migrasi mudah: worker tap dipindah dari route HTTP
ke subscriber MQTT, sisa alurnya tidak berubah.

## 2. Alur end-to-end

```
[Kartu RFID]
   │ tap
   ▼
[ESP32] ── generate tapId (uid+epoch) ──┐
   │  LCD "Memproses…"                   │ gagal kirim → simpan ke buffer NVS,
   ▼                                     │ retry tiap 10 dtk
POST /api/perangkat/tap  ◄───────────────┘
   Bearer <token perangkat>
   { tapId, uid, waktu }
   │
   ├─ 1. verifikasi token → Perangkat
   ├─ 2. UID → KartuRfid → Santri     (tidak ketemu → 404 "Kartu tidak dikenal")
   ├─ 3. INSERT TapPresensi (unik: tapId)   ← idempotensi; P2002 = sudah pernah
   ├─ 4. UPSERT Presensi (santriId, tgl, sesi='Gerbang')
   ├─ 5. INSERT AntreanWa (status=Menunggu)  ← outbox, TIDAK kirim di sini
   └─ 6. 200 { nama: "Ahmad F.", arah: "Masuk", jam: "06:41" }   (<200 ms)
   │
   ▼
[ESP32] LCD 2 baris: "Ahmad F." / "MASUK 06:41" + buzzer
                                             │
                            (proses terpisah) │
                                             ▼
                                      [Worker WA]
                                 poll AntreanWa tiap 2 dtk
                                 → kirimWa() (lib/wa.ts)
                                 → status Terkirim / Gagal (+retry maks 3, backoff)
```

Kunci kestabilan: langkah 6 terjadi sebelum WA apa pun dikirim. Antrean WA boleh
tertinggal beberapa menit tanpa mengganggu antrean santri di gerbang.

## 3. Perubahan skema Prisma

Tiga model baru; `Presensi` yang ada dipakai apa adanya (sesi diisi `"Gerbang"`).
Struktur `Presensi` (`santriId, tgl, sesi VarChar(32), status, ket`, unik
`[santriId, tgl, sesi]`) sudah generik — tidak perlu diubah. Enum `StatusHadir`
juga sudah punya `Terlambat`. Catatan: daftar sesi sah di
`app/(staf)/kepesantrenan/actions.ts` masih hardcode lima waktu sholat, jadi
`"Gerbang"` harus ditambahkan ke sana (atau alur gerbang dipisah dari
`simpanAbsenJamaah`, yang lebih bersih).

Catatan tipe: sketsa di bawah memakai `String @default(cuid())` agar ringkas,
tetapi skema existing (`Presensi`, `Santri`) memakai `BigInt @default(autoincrement())`.
**Saat implementasi, ikuti konvensi existing `BigInt`** — termasuk `santriId` pada
`KartuRfid` dan `TapPresensi` — supaya FK-nya cocok.

```prisma
model PerangkatPresensi {
  id         String   @id @default(cuid())
  nama       String   @db.VarChar(64)      // "Gerbang MA"
  lokasi     String?  @db.VarChar(64)
  tokenHash  String   @unique              // sha256 token; token asli hanya tampil sekali
  aktif      Boolean  @default(true)
  terakhirAktif DateTime?
  taps       TapPresensi[]
}

model KartuRfid {
  id        String   @id @default(cuid())
  uid       String   @unique @db.VarChar(32)   // UID kartu, hex uppercase
  santriId  String
  santri    Santri   @relation(fields: [santriId], references: [id])
  aktif     Boolean  @default(true)            // kartu hilang → nonaktifkan, terbitkan baru
  diterbitkan DateTime @default(now())
  @@index([santriId])
}

model TapPresensi {
  id          String   @id @default(cuid())
  tapId       String   @unique @db.VarChar(64) // dibuat ESP32 → idempotensi
  perangkatId String
  santriId    String?                          // null = kartu tak dikenal (tetap dicatat)
  uid         String   @db.VarChar(32)
  arah        ArahTap                          // Masuk | Pulang
  waktu       DateTime                         // waktu di perangkat
  diterima    DateTime @default(now())         // waktu sampai server (deteksi tap tertunda)
  @@index([santriId, waktu])
}

enum ArahTap { Masuk Pulang }

// Kenapa model antrean baru, bukan AntreanNotifikasi yang sudah ada:
// kunci uniknya [kodeTemplate, tujuanId, tanggalJadwal] bersifat per-hari —
// cocok untuk notifikasi terjadwal, tapi tidak bisa membedakan dua tap
// (masuk & pulang) pada tanggal yang sama. Antrean tap butuh kunci per-tap.
// Model ini juga menambah retry/backoff, yang belum ada di AntreanNotifikasi.
model AntreanWa {
  id         String   @id @default(cuid())
  tujuan     String   @db.VarChar(24)
  isi        String   @db.Text
  kunci      String   @unique @db.VarChar(96)  // "tap:<tapId>" → anti kirim ganda
  status     StatusAntreanWa @default(Menunggu)
  percobaan  Int      @default(0)
  kirimSetelah DateTime @default(now())        // backoff
  galat      String?  @db.Text
  @@index([status, kirimSetelah])
}

enum StatusAntreanWa { Menunggu Terkirim Gagal DilewatiTanpaHp }
```

Penentuan `arah`: tap pertama santri pada satu hari = `Masuk`, tap berikutnya
berselang >`JEDA_ARAH` (default 30 menit) = kebalikan tap terakhir. Tap ulang
dalam <30 menit dianggap salah-pencet → dicatat di `TapPresensi` tapi tidak
membuat baris antrean WA baru.

## 4. Endpoint & modul baru

| Berkas | Isi |
|---|---|
| `app/api/perangkat/tap/route.ts` | POST tap. Verifikasi Bearer → `lib/perangkat/auth.ts`. Balas cepat. Terima batch (`{ taps: [...] }`) untuk kiriman ulang dari buffer. |
| `lib/perangkat/auth.ts` | `verifikasiPerangkat(request): Promise<PerangkatPresensi \| null>` — hash token, cari, update `terakhirAktif`. Timing-safe compare. |
| `lib/presensi/tap.ts` | `catatTap({perangkat, tapId, uid, waktu})` — logika langkah 2–5 dalam satu transaksi Prisma. Murni, bisa diuji tanpa HTTP. |
| `lib/presensi/arah.ts` | `tentukanArah(tapTerakhir, waktu)` — helper murni + konstanta `JEDA_ARAH_MENIT`. |
| `lib/wa/antrean.ts` | `antreWa({tujuan, isi, kunci})` (tangkap P2002 = sudah antre) + `prosesAntrean(batas)` untuk worker. |
| `scripts/cron.ts` (ubah, bukan berkas baru) | Sudah ada proses cron eksternal (`scripts/cron.ts` + `lib/penjadwal/cron.ts`). Tambahkan tick 2 detik yang memanggil `prosesAntrean()` di sana, alih-alih menambah proses/service baru yang harus dijaga hidup sendiri. Backoff 1/5/15 menit, maks 3 percobaan. |
| `app/(staf)/kepesantrenan/TabGerbang.tsx` | Tab baru: daftar tap hari ini (auto-refresh), status antrean WA, kartu tak dikenal. |
| `app/(staf)/pengaturan/TabPerangkat.tsx` | CRUD perangkat + terbitkan/cabut token, dan pemetaan UID kartu → santri. |

Menu baru wajib: baris `menu` + `menu_peran` di seed **dan** entri `HREF_BY_KEY`
di `components/templates/Shell.tsx`.

## 5. Pesan WA & pengendalian spam

Template baru di `TemplateWa` (`prisma/schema.prisma:1166`), kode `PRESENSI_MASUK`
dan `PRESENSI_PULANG`. Placeholder `{{kunci}}` diisi oleh `renderTemplate()`
(`lib/wa.ts:32`). Pengiriman lewat
`kirimWa({ nomor, tujuan, isi, templateId?, actor?, ip? })` (`lib/wa.ts:46`),
yang sudah menulis `LogWa` + `recordAudit('KIRIM_WA')` sendiri — worker tidak
perlu menduplikasi audit.

> Assalamu'alaikum. Ananda *{{nama}}* tercatat *{{arah}}* di {{lokasi}} pukul {{jam}}, {{tanggal}}. — PP Nurul Huda Mergosono

Pengaman:
- **Dedup**: `AntreanWa.kunci = "tap:<tapId>"` unik → kiriman ulang dari buffer
  ESP32 tidak menghasilkan WA kedua.
- **Jeda arah 30 menit** → tap beruntun tidak jadi dua pesan.
- **Tanpa HP wali** → status `DilewatiTanpaHp`, bukan `Gagal`; pakai pola
  `pisahkanBerdasarkanHp()` yang sudah ada di `lib/penjadwal/kontak.ts`.
- Nomor wali diambil lewat `Santri → orang → sebagaiAnak[] → wali.hp`, ambil
  wali `utama` dulu, jatuh ke wali pertama yang punya `hp`.
- `WA_DRY_RUN=true` tetap default (`lib/wa.ts:49`) → seluruh blok fetch dilewati,
  `LogWa.status = 'Dry-run'`, dan `ok: true`. **Uji seluruh alur dalam dry-run dulu.**
  Untuk uji kirim nyata: `WA_DRY_RUN=false` **plus** `WA_DEBUG_REDIRECT=<hp sendiri>`.
  Perhatikan `WA_DEBUG_REDIRECT` berlaku terlepas dari `WA_DRY_RUN`
  (`lib/wa.ts:24`), jadi ia bukan pengganti dry-run — ia hanya mengalihkan tujuan.

**Penting untuk logika retry**: gateway bergaya Fonnte — kegagalan tetap balas
HTTP 200 dengan body `status:false` (`lib/wa-gateway.ts:37`). Jadi worker
**tidak boleh** menilai sukses dari status HTTP; pakai nilai `ok` dari
`kirimWa()`, yang sudah menangani hal ini. Tandai `Gagal` + backoff hanya
berdasarkan `ok === false`.

## 5b. Kontrak existing yang dipakai ulang (jangan tulis ulang)

```ts
requirePage(menuKey: string): Promise<SessionPayload>   // lib/access.ts:9
recordAudit({ aksi, entitas, entitasId?, ringkasan,
              perubahan?, aktor?, ip? }): Promise<void> // lib/audit.ts:24
requestIp(request: Request): string | null              // lib/audit.ts:55
pisahkanBerdasarkanHp<T extends { hp: string | null }>  // lib/penjadwal/kontak.ts:6
```

- `recordAudit()` **tidak pernah throw** — kegagalan audit tidak membatalkan tap.
  Jadi aman dipanggil di dalam alur tap tanpa try/catch tambahan.
- Route tap pakai `requestIp(request)` untuk mengisi `ip` pada audit; **bukan**
  `requirePage()` (itu untuk halaman berkuki, dan ia `redirect()` — perilaku yang
  salah untuk perangkat, yang butuh balasan JSON 401).
- `StatusHadir` (`schema:645`) sudah punya `Terlambat` **dan `PulangCepat`** —
  keduanya pas untuk gerbang: tap masuk lewat jam batas → `Terlambat`, tap pulang
  sebelum jam batas → `PulangCepat`. Tidak perlu menambah nilai enum.
- `SantriKelas` (`schema:362`) adalah sumber kebenaran "santri di kelas mana";
  pakai ini kalau rekap gerbang perlu difilter per rombel.
- **Risiko operasional**: `tokenPengirim()` (`lib/wa-gateway.ts:95`) jatuh ke
  "perangkat terhubung pertama" bila `WA_GATEWAY_TOKEN` kosong. Untuk notifikasi
  otomatis sebaiknya `WA_GATEWAY_TOKEN` **diisi eksplisit**, supaya pesan tidak
  berpindah nomor pengirim saat daftar perangkat gateway berubah.

## 6. Firmware ESP32 (garis besar)

- WiFi + `HTTPClient`, `Authorization: Bearer <token>` disimpan di NVS.
- `tapId = <deviceId>-<uid>-<epoch>` → stabil lintas retry.
- Timeout HTTP 5 dtk. Gagal/timeout → antrekan ke ring buffer NVS, LCD
  "Tersimpan offline", tetap bunyikan buzzer (santri tidak perlu mengulang tap).
- Tiap 10 dtk: kirim isi buffer sebagai batch (maks 20/permintaan).
- Waktu: sinkron NTP saat boot + tiap jam. Kalau NTP gagal, kirim `waktu` apa
  adanya; server menyimpan `diterima` sehingga selisih terdeteksi.
- Debounce kartu yang sama 5 detik di sisi perangkat.

## 7. Keamanan

- Token perangkat 32 byte acak, ditampilkan **sekali** saat diterbitkan, di DB
  hanya sha256-nya. Bisa dicabut per perangkat.
- Rate limit per perangkat (mis. 120 tap/menit) di route tap → perangkat rusak
  atau token bocor tidak bisa membanjiri antrean WA.
- Route tap **tidak** mengembalikan data santri selain nama pendek + jam.
  UID yang tidak dikenal dijawab 404 tanpa membocorkan apakah UID pernah ada.
- Jangan taruh endpoint ini di balik kuki sesi; auth-nya eksplisit dan terpisah.
- Buka port hanya untuk subnet yang perlu (aturan UFW repo), bukan global.
- Semua mutasi tetap memanggil `recordAudit()`.

## 8. Urutan pengerjaan

1. Skema Prisma + migrasi + `prisma migrate deploy` (wajib sebelum lanjut).
2. `lib/presensi/arah.ts` & `lib/presensi/tap.ts` + unit test (murni, tanpa HTTP).
3. `lib/perangkat/auth.ts` + `app/api/perangkat/tap/route.ts`; uji dengan `curl`.
4. `lib/wa/antrean.ts` + `scripts/worker-wa.ts`, jalankan dengan `WA_DRY_RUN=true`.
5. UI: TabPerangkat (terbitkan token, petakan kartu) → TabGerbang (pantau tap).
6. Seed: menu + menu_peran + template WA + satu perangkat contoh.
7. Firmware ESP32, uji satu kartu, lalu uji burst 30 tap.
8. Uji terima: 30 tap berturut-turut ≤ 200 ms/tap; cabut WiFi saat tap, sambung
   lagi → tidak ada presensi hilang, tidak ada WA ganda.
9. `npx tsc --noEmit`, verifikasi Playwright ke `http://202.59.200.26:3226`.
10. Dokumentasi: bagian baru di `app/docs/isi.ts` + catatan di `HISTORY.md`.

## 9. Yang masih perlu diputuskan

- Jam operasional gerbang (di luar jam itu, tap dianggap apa?).
- Apakah wali boleh menonaktifkan notifikasi per santri.
- Perlukah presensi gerbang ini memengaruhi rekap presensi akademik, atau
  berdiri sendiri sebagai catatan kehadiran di pesantren.
