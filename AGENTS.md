# AGENTS.md — Cross-Agent Operating Guide

> File ini dibaca oleh **Codex (OpenAI)**, **GLM / Z.ai**, dan agent lain yang
> mengikuti konvensi `AGENTS.md`. Tujuannya satu: **menyatukan instruksi ke
> satu catatan tunggal** supaya semua AI coding assistant bekerja dengan
> aturan yang sama di repo ini.

## 0. Aturan tertinggi (WAJIB)

**Single source of truth instruksi ada di [`CLAUDE.md`](./CLAUDE.md).**
Sebelum melakukan APA PUN di repo ini (menulis/mengubah kode, menjalankan
perintah, mengedit konfigurasi), kamu **WAJIB membaca `CLAUDE.md` lebih dulu**
secara penuh dan mematuhinya tanpa kecuali.

File ini (AGENTS.md) hanya berfungsi sebagai:
1. **Pointer** — mengarahkan semua agent ke `CLAUDE.md`.
2. **Catatan kompatibilitas** khusus per-tool yang tidak tercakup CLAUDE.md.

Jika ada konflik antara AGENTS.md dan CLAUDE.md → **CLAUDE.md yang menang**.

## 1. Cara kerja

1. Baca [`CLAUDE.md`](./CLAUDE.md) penuh di awal sesi.
2. Patuhi seluruh **§2 Aturan non-negotiable**, **§3 Perintah**, **§5 Konvensi
   kode**, **§6 Testing**, **§8 Hal yang sering bikin kepleset**.
3. Jangan ulangi/menduplikasi isi CLAUDE.md ke sini — cukup rujuk.
4. Jika CLAUDE.md berubah, semua agent otomatis mengikuti karena baca ulang.

## 2. Catatan kompatibilitas per-tool

### Codex (OpenAI)
- Jalankan perintah persis seperti di CLAUDE.md §3 (npm, bukan pnpm).
- Gunakan `npm run typecheck` / `npm run lint` sebelum menganggap selesai.
- Untuk app Next.js produksi → `node <standalone>/server.js`, **bukan**
  `next start` (lihat CLAUDE.md §4.2).

### GLM / Z.ai
- Patuhi batas ukuran file (maks 400 baris, lihat CLAUDE.md §5).
- Jangan gunakan callback; pakai async/await.
- Untuk refactor besar, kerja per-file agar context tidak meledak.

### Gemini
- Lihat juga [`GEMINI.md`](./GEMINI.md) untuk catatan khusus Gemini.

## 3. Singkatnya

> **Baca [`CLAUDE.md`](./CLAUDE.md). Patuhi isinya. Selesai.**
