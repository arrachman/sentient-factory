# Rencana Implementasi dari Data Client (Agustus 2026)

Disusun dari audit 14 dokumen di `docs/`. Prinsipnya: **pakai data yang ada
sekarang**, tidak menunggu data yang belum tersedia. Yang belum ada dibuatkan
template agar client tinggal mengisi.

## 0. Fakta yang menjadi dasar rencana

- **MA baru berjalan 2 tahun** → hanya ada **kelas X dan XI**. Kelas XII belum
  ada dan **bukan** kekurangan data. Jadwal `JADWAL KELAS X XI.xlsx` sudah lengkap.
- **Jumlah murid MA memang sedikit** — bukan data yang hilang:

  | Tahun ajaran | Jumlah | Posisi per 2026/2027 |
  |---|---|---|
  | 2025/2026 (angkatan 1) | 11 siswa | Kelas **XI** |
  | 2026/2027 (angkatan 2) | 8 siswa | Kelas **X** |
  | **Total MA** | **19 siswa** | |

  9 dari 11 nama angkatan 1 muncul di `Presensi MA - DashboardSiswa.csv`
  bertanda `XI IPS` — cocok.
- **SMP**: rekap Form Pendataan menyebut 70 siswa (L 43 / P 27), detail terisi
  38 (kelas 7 = 8, kelas 8 = 17, kelas 9 = 13). Selisih 32 → perlu dikonfirmasi.
- **Guru MA**: 17 orang, lengkap. **Guru SMP belum ada datanya.**
- **Keuangan**: tidak ada satu pun file → dibuatkan template (§5).

---

## Fase 1 — Skema: perubahan yang wajib lebih dulu

Tanpa ini data client tidak bisa masuk apa adanya.

1. **`TahunAjaran`** (model baru) — `kode` (`2025/2026`), `semester`, `aktif`.
   Menggantikan periode hardcode `2026/2027 Gasal` di
   `app/kurikulum/kelas-guru.ts`. Wajib karena satu siswa punya dua TA.
2. **`Kelas` di-scope ke tahun ajaran** — ubah `@@unique([unitId, nama])`
   menjadi `@@unique([unitId, nama, tahunAjaranId])`. Tanpa ini "X" 2025/2026
   dan "X" 2026/2027 bertabrakan, padahal isinya orang berbeda.
3. **`StatusHadir` diperluas** — tambah `Terlambat` dan `PulangCepat`. CSV
   presensi MA menjadikan keduanya metrik utama; enum sekarang hanya
   `Hadir/Sakit/Izin/Alpa` sehingga data client hilang saat diimpor.
4. **`Santri.nis` tidak lagi wajib diisi manual** — semua data client hanya
   punya NISN, kolom NIS kosong. Buat generator NIS deterministik
   (`<tahunMasuk><unit><urut>`) di importir, NISN tetap sumber kebenaran.
5. **Guru dirujuk lewat FK, bukan nama** — tambah `Kelas.waliKelasId` dan
   `JadwalPelajaran.pegawaiId` (`guru` string dipertahankan sementara untuk
   kompatibilitas). Jadwal client memakai nama panggilan ("B. Hasni",
   "P. Izha", "Miss Via") yang **tidak** sama dengan nama resmi
   ("Ilmi Nurhasni Addin") — pencocokan by-nama pasti pecah.
6. **`Pegawai` diperluas** — `pendidikanTerakhir`, `mapelDiampu`,
   `tugasTambahan`, `jamMengajar`. Diambil langsung dari `DATA GURU.xlsx`
   dan SK Pembagian Tugas.
7. **Profil kesehatan awal** (`ProfilKesehatan`: BB, TB, riwayat penyakit,
   kebutuhan khusus) — sheet DATA KESEHATAN adalah profil sekali-isi, bukan
   `RekamMedis` yang per-kunjungan.
8. **Alamat terstruktur** di `Orang` — `rt`, `rw`, `kelurahan`, `kecamatan`,
   `kabupaten`. Form Pendataan SMP sudah memecahnya per kolom.
9. **`RelasiWali` diperluas** — `nik`, `ttl`, `pendidikan`, `pendapatan`,
   dan pemisahan peran ayah/ibu/wali. Sheet DATA WALI MURID punya 3 blok NIK.

**Setelah tiap perubahan**: `prisma migrate dev` →
`docker compose build nuha-migrate && docker compose run --rm nuha-migrate`
(sesuai CLAUDE.md, image migrate suka basi).

---

## Fase 2 — Madrasah Diniyah jadi unit sendiri

Data Madin lengkap (jadwal 7 jenjang + 22 asatidz), tapi sistem hanya punya
satu baris kelas `Diniyah Wustha`.

1. Tambah `Unit` key `Madin` — sejajar SMP/MA/Pondok/Poskestren, sesuai
   Struktur PPSSNH yang menempatkan Madrasah Diniyah sebagai lembaga sendiri.
2. Seed 7 jenjang sebagai `Kelas`: `I'dad`, `Satu`…`Enam`, dengan wali kelas
   dari baris terakhir jadwal (Ust. Akmal, Ning Anna, Gus Shihab, Ust. Ismail,
   Ust. Nur Robbi, Gus Shampton, Gus Faruq).
3. **Model `JadwalDiniyah` terpisah** — `hari`, `jenjang`, `kitab`, `ustadz`,
   `tempat`. `JadwalPelajaran` tidak dipakai karena kuncinya
   `@@unique([hari, jamKe, kelas])` sedangkan Madin berbasis kitab dan tempat
   non-kelas (Ndalem Abuya, Nuhamart Lt2, Aula Maqbaroh 1/3, Mushola).
4. Impor 22 asatidz dari `SK Asatidz Madin_063129.docx` sebagai `Pegawai`
   unit Madin.

---

## Fase 3 — Importir XLSX → Prisma

Ganti `prisma/proto-data.json` (seluruhnya fiktif: "Drs. Sulaiman Hadi",
"Bu Rina Kusuma", 20 santri karangan) dengan data nyata. Skrip idempoten di
`prisma/import/`, satu modul per sumber:

| Modul | Sumber | Target |
|---|---|---|
| `import-guru-ma.ts` | `DATA GURU.xlsx` | 17 `Pegawai` unit MA |
| `import-siswa-ma.ts` | `DATA SISWA TA 2025_2026.xlsx` → kelas XI, `2026_2027` → kelas X | 19 `Santri` + `RelasiWali` + `ProfilKesehatan` |
| `import-siswa-smp.ts` | `2. Form Pendataan SMP.xlsx` (3 sheet kelas) | 38 `Santri` (sisanya menyusul) |
| `import-jadwal-ma.ts` | `JADWAL KELAS X XI.xlsx` — sheet 1 kode mapel, sheet 2 nama guru, digabung per sel | `JadwalPelajaran` X & XI |
| `import-jadwal-madin.ts` | `Jadwal Madin 2026-2027.pdf` (transkrip manual → JSON) | `JadwalDiniyah` |
| `import-presensi-ma.ts` | `Presensi MA - DashboardSiswa.csv` | `Presensi` XI IPS |
| `import-struktur.ts` | 3 PDF SK + Struktur PPSSNH | `Jabatan` / struktur organisasi |

**Kamus nama panggilan wajib** (`prisma/import/alias-guru.ts`) — jadwal memakai
panggilan, SK memakai nama resmi:

```
B. Hasni  → Ilmi Nurhasni Addin        P. Izha  → Isma Izha Utama
B. Nina   → Nisrina Nada Aulia         P. Alfan → Alfan Jamil
B. Rona   → Rona Nadhiroh              P. Said  → Fitri Muchammad Sa'id
B. Murida → Murida Azkia               P. Bismar→ Muh. Bismar As Sidiq
B. Ulil   → Aulan Nisa' Ulil Kamaliah  B. Khal  → Khalimatus Sa'diyah
B. Putri  → Putri Laksmi Marwa Kamila  B. Eka   → Eka Meilina Wulandari
Miss Via  → Rofiatul Mukarromah        B. Fida  → Umi Mufidatul Musyarofah
B. Ais    → Wardatul Haizatil Husna
```

Alias yang tidak terpetakan **harus menggagalkan impor**, bukan diam-diam
membuat guru baru.

---

## Fase 4 — Peran & struktur organisasi

Peran di seed (8 peran generik) tidak mencerminkan SK. Tambahkan dari
`008…SK MA.pdf`, `006…SK Asrama Putra.pdf`, dan Struktur PPSSNH:

- MA: Pengawas Internal, Kepala Madrasah, Waka Kurikulum / Kesiswaan /
  Sarpras / Humas, Kepala Laboratorium, Koordinator TU, BK.
- Asrama: Lurah + 6 divisi (Pendidikan, Peribadatan, Keamanan, Kebersihan &
  Kesehatan, Sarpras, Keuangan) — 31 pengurus putra.
- Yayasan: Dewan Pengasuh, Pengasuh, PH Umum, PH Diniyah.

Setiap peran baru = baris `menu_peran` di seed **dan** entri `HREF_BY_KEY`
di `components/templates/Shell.tsx`, sesuai aturan RBAC dinamis.

---

## Fase 5 — Template keuangan (data belum ada)

Client belum menyerahkan data keuangan apa pun. Dibuatkan template CSV di
`docs/templates/` agar bisa langsung diisi dan diimpor:

| Template | Untuk | Model tujuan |
|---|---|---|
| `template-tagihan-spp.csv` | SPP & biaya per santri per periode | `Tagihan` |
| `template-pembayaran.csv` | Setoran atas tagihan | `Pembayaran` |
| `template-gaji-pegawai.csv` | Komponen gaji per pegawai | `KomponenGaji` |
| `template-kas.csv` | Kas masuk/keluar yayasan | `TransaksiKas` |

Kolomnya mengikuti persis field model yang sudah ada, jadi importirnya tipis.

---

## Fase 6 — Fitur yang belum ada sama sekali

Diurutkan dari yang datanya sudah tersedia:

1. **Jurnal mengajar** — sumber `PRESENSI DAN JURNAL JULI-AGUSTUS…xlsx` sudah ada.
2. **Presensi pegawai** — `Presensi` sekarang hanya untuk santri.
3. **Beban jam mengajar** — struktur ada di SK Pembagian Tugas, **angkanya kosong**;
   siapkan modelnya, minta client mengisi.
4. **Guru piket** — data ada di foto WhatsApp (jadwal piket MPLS Senin–Sabtu).
5. **Arsip SK kepegawaian** — 5 file SK belum punya tempat penyimpanan.

---

## Yang masih perlu dari client

Bukan blocker untuk Fase 1–3, tapi perlu sebelum produksi:

1. **Data guru SMP** — belum ada sama sekali.
2. **Jadwal pelajaran SMP** — belum ada.
3. **Konfirmasi jumlah siswa SMP**: rekap 70, detail terisi 38 — mana yang benar?
4. **Penetapan NIS** — semua data hanya punya NISN.
5. **Jumlah jam mengajar** di SK Pembagian Tugas (kolomnya kosong).
6. **SK Asrama Putri** — hanya Putra yang diserahkan.
7. **Data keuangan** — isi template di `docs/templates/`.
8. **Data santri pondok / penghuni asrama** — selain 31 pengurus putra.

---

## Urutan eksekusi

```
Fase 1 (skema + migrasi)  →  Fase 3 (importir MA & guru)  →  verifikasi
     ↓                              ↓
Fase 2 (Madin)            →  Fase 3 (importir Madin)
     ↓
Fase 4 (peran)  →  Fase 5 (template keuangan)  →  Fase 6 (fitur baru)
```

Verifikasi tiap fase sesuai aturan keras: `npx tsc --noEmit`, lalu Playwright
ke `http://202.59.200.26:3226` — login riil, sidebar sesuai `menu_peran`, tiap
tab tanpa `pageerror`, dan mutasi dicek sampai baris DB-nya.
