# GEMINI.md — Gemini Operating Guide

> File ini dibaca oleh **Gemini (Google)** saat bekerja di repo ini.

## 0. Aturan tertinggi (WAJIB)

**Single source of truth instruksi ada di [`CLAUDE.md`](./CLAUDE.md).**
Sebelum melakukan APA PUN (menulis/mengubah kode, menjalankan perintah,
mengedit konfigurasi), kamu **WAJIB membaca `CLAUDE.md` lebih dulu** secara
penuh dan mematuhinya tanpa kecuali.

File ini (GEMINI.md) hanya berfungsi sebagai:
1. **Pointer** — mengarahkan Gemini ke `CLAUDE.md`.
2. **Catatan kompatibilitas** khusus Gemini yang tidak tercakup CLAUDE.md.

Jika ada konflik antara GEMINI.md dan CLAUDE.md → **CLAUDE.md yang menang**.

## 1. Cara kerja

1. Baca [`CLAUDE.md`](./CLAUDE.md) penuh di awal sesi.
2. Patuhi seluruh aturan non-negotiable (§2), perintah (§3), konvensi kode
   (§5), testing (§6), dan jebakan umum (§8).
3. Jangan duplikasi isi CLAUDE.md ke sini — cukup rujuk.

## 2. Catatan khusus Gemini

- Jalankan perintah persis seperti di CLAUDE.md §3: pakai **npm**, bukan pnpm.
- Untuk app Next.js produksi → `node <standalone>/server.js`, **bukan**
  `next start` (lihat CLAUDE.md §4.2). Cek layout standalone dengan
  `find <app>/.next/standalone -name server.js -not -path '*/node_modules/*'`.
- Gunakan `npm run typecheck` / `npm run lint` sebelum menganggap selesai.
- Patuhi batas 400 baris per file (CLAUDE.md §5); untuk refactor besar kerja
  per-file agar context tetap kecil.
- Patuhi §4.1: setiap port baru yang butuh akses LAN **WAJIB** di-allow di UFW.

## 3. Singkatnya

> **Baca [`CLAUDE.md`](./CLAUDE.md). Patuhi isinya. Selesai.**
