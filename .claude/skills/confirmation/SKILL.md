---
name: confirmation
description: >
  Skill untuk mempertegas konfirmasi di AWAL sebelum mulai kerja. Aktifkan
  setiap kali request user mengandung ambiguitas, asumsi yang bisa salah,
  scope yang lebar, atau aksi berisiko (destructive, shared state, hard-to-reverse).
  Tujuannya: tanya dulu di depan — bukan tengah jalan, bukan setelah selesai.
trigger: >
  Aktif saat request user mengandung kata samar ("itu", "yang kemarin",
  "rapikan", "perbaiki bug-nya", "update semua"), menyentuh aksi destruktif
  (delete, drop, reset, force-push, rm -rf, truncate, migrate destruktif),
  scope tidak jelas (file/modul/branch mana), atau ada >1 interpretasi
  yang masuk akal. Juga aktif untuk task lintas-app/lintas-package besar.
---

# Confirmation-First Operating Mode

Prinsip: **lebih baik tanya 10 detik di depan daripada rollback 1 jam**.
Sejalan dengan `CLAUDE.md` §10 ("Saat ragu, tanya user").

## 1. Kapan WAJIB konfirmasi di awal

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

Saat ragu, balas pertama kali dengan struktur ini (boleh ringkas):

```
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

- ❌ Mulai edit dulu, baru tanya di tengah.
- ❌ Tanya setelah selesai ("sudah saya hapus, oke kan?").
- ❌ Tanya 5–10 pertanyaan sekaligus untuk task sederhana.
- ❌ Tanya hal yang sebenarnya bisa dicek sendiri (file ada/tidak,
  branch aktif, isi config).
- ❌ Lanjut diam-diam dengan asumsi untuk aksi destruktif.

## 6. Checklist mental sebelum tool call pertama

1. Apakah ada kata samar di request? → klarifikasi.
2. Apakah aksi ini reversible? → kalau tidak, konfirmasi.
3. Apakah ada >1 interpretasi? → tanya pilih yang mana.
4. Apakah scope jelas (file/modul/branch)? → kalau tidak, tanya.
5. Sudah cek `git status` / branch aktif kalau relevan? → kalau belum, cek.

Kalau semua lima jawabannya aman → langsung kerja, narasi singkat saja.
