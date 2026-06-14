---
name: confirmation
description: >
  Skill untuk mempertegas konfirmasi di AWAL sebelum mulai kerja. Aktifkan
  setiap kali request user mengandung ambiguitas, asumsi yang bisa salah,
  scope yang lebar, atau aksi berisiko (destructive, shared state, hard-to-reverse).
  Tujuannya: tanya dulu di depan — bukan tengah jalan, bukan setelah selesai.
trigger: >
  WAJIB AKTIF untuk setiap request non-trivial. Selalu konfirmasi dan
  selaraskan pemahaman SEBELUM tool call pertama yang mengubah state.
  Minimal: restate pemahaman + tanya kalau ada yang ambigu. Tidak perlu
  menunggu kondisi khusus — ini default mode, bukan mode darurat.
---

# Confirmation-First Operating Mode

Prinsip: **lebih baik tanya 10 detik di depan daripada rollback 1 jam**.
Sejalan dengan `CLAUDE.md` §10 ("Saat ragu, tanya user").

> **Mode ini WAJIB aktif.** Sebelum aksi apapun, Claude HARUS restating
> pemahaman dan mengonfirmasi ke user — terutama untuk task yang menyentuh
> kode, DB, file, atau shared state.

## 0. Langkah WAJIB sebelum tool call pertama

Untuk setiap request non-trivial, sebelum membuka file atau menjalankan
command apapun:

1. **Restate** — parafrase singkat apa yang kamu pahami dari request.
2. **Identifikasi gap** — hal apa yang masih ambigu atau perlu keputusan user.
3. **Konfirmasi atau asumsi** — kalau ada cabang keputusan nyata → tanya.
   Kalau gap kecil dan reversible → nyatakan asumsi lalu lanjut.
4. **STOP** sampai user confirm (untuk kasus ambigu/destruktif).

Format ringkas:

```
Pemahaman saya: <parafrase singkat>
Perlu konfirmasi: <pertanyaan konkret, pakai AskUserQuestion jika ≥2 opsi>
```

## 1. Kapan WAJIB konfirmasi (bukan hanya restate)

Sebelum tool call pertama yang mengubah state, tanya dulu jika menemui:

1. **Ambiguitas referensi** — "itu", "yang tadi", "file kemarin", "bug-nya",
   tanpa path/identifier jelas.
2. **Scope tidak jelas** — "rapikan kode", "refactor", "perbaiki semua",
   tanpa target file/modul/baris.
3. **>1 interpretasi masuk akal** — request bisa dibaca dengan ≥2 cara yang
   menghasilkan diff berbeda secara material.
4. **Aksi destruktif / hard-to-reverse** — `rm -rf`, `git reset --hard`,
   `force push`, `drop table`, `truncate`, `prisma migrate reset`,
   delete branch, overwrite uncommitted changes.
5. **Shared state / visible to others** — push ke remote, buat/close PR,
   kirim message, ubah CI/infra/permission.
6. **Cross-app / cross-package besar** — menyentuh >3 app atau
   `packages/shared-types` (ingat: TS + Pydantic harus sinkron).
7. **Branch/worktree mismatch** — sebelum fix UI, konfirmasi branch mana
   yang ditonton dev server (lihat `CLAUDE.md` §8 & §11).
8. **Schema/migrasi DB** — sebelum `prisma migrate dev/deploy/reset`
   atau edit `prisma/schema.prisma`.

## 2. Cara konfirmasi yang benar

- **Pakai `AskUserQuestion`** untuk pilihan diskrit (2–4 opsi). Jangan
  prose panjang — user pilih cepat dengan klik.
- **Pakai pertanyaan teks pendek** kalau jawabannya bebas (path, nama,
  angka). Maks 1–2 kalimat.
- **JANGAN tanya hal sepele** yang bisa dijawab dari context (cek file,
  `git status`, `git log`, baca CLAUDE.md). Tanya hanya yang benar-benar
  butuh keputusan user.
- **JANGAN tanya "boleh saya lanjut?"** setelah sudah jelas — itu noise.
  Tanya hanya saat ada cabang keputusan nyata.

## 3. Format konfirmasi di awal

Saat ada ambiguitas, balas pertama dengan struktur ini (ringkas):

```
Pemahaman saya: <parafrase singkat task>
Sebelum mulai, perlu konfirmasi:
1. <hal ambigu 1> → opsi A / opsi B
2. <hal ambigu 2> → ?
Asumsi sementara: <kalau user diam, ini default-ku>
```

Lalu STOP — tunggu jawaban. Jangan mulai edit/run command.

## 4. Konfirmasi vs asumsi-dengan-catatan

Jika ambiguitasnya **kecil** dan **mudah reversible** (mis. nama variabel,
gaya komentar), boleh lanjut dengan asumsi eksplisit:

> "Saya pakai nama `xxx`, kalau kurang pas tinggal ganti."

Tapi untuk aksi destruktif / shared-state / scope besar, **JANGAN** pakai
pola asumsi — selalu tanya.

## 5. Anti-pola yang harus dihindari

- ❌ Langsung kerja tanpa restate pemahaman sama sekali.
- ❌ Mulai edit dulu, baru tanya di tengah.
- ❌ Tanya setelah selesai ("sudah saya hapus, oke kan?").
- ❌ Tanya 5–10 pertanyaan sekaligus untuk task sederhana.
- ❌ Tanya hal yang sebenarnya bisa dicek sendiri (file ada/tidak,
  branch aktif, isi config).
- ❌ Lanjut diam-diam dengan asumsi untuk aksi destruktif.

## 6. Checklist mental sebelum tool call pertama

1. Sudah restate pemahaman ke user? → kalau belum, lakukan.
2. Apakah ada kata samar di request? → klarifikasi.
3. Apakah aksi ini reversible? → kalau tidak, konfirmasi.
4. Apakah ada >1 interpretasi? → tanya pilih yang mana.
5. Apakah scope jelas (file/modul/branch)? → kalau tidak, tanya.
6. Sudah cek `git status` / branch aktif kalau relevan? → kalau belum, cek.

Kalau semua jawabannya aman → langsung kerja, narasi singkat saja.
