---
slug: format-prompt-sop-agents
title: Format Prompt untuk Menyusun SOP AGENTS.md
description: Template prompt siap pakai untuk merumuskan SOP teknis bergaya AGENTS.md secara konsisten dan executable.
authors: [slorber]
tags: [prompt, ai, engineering]
---

Kalau kamu ingin AI menghasilkan SOP teknis yang konsisten, jangan mulai dari prompt umum.
Pakai format prompt yang memaksa AI mengumpulkan input penting lalu mengubahnya menjadi langkah yang executable.

<!-- truncate -->

## Prompt Utama (Siap Pakai)

```txt
Kamu adalah AI Technical Writer + Engineering Lead.

Tugasmu:
1. Ubah kebutuhan saya menjadi SOP eksekusi teknis bergaya `AGENTS.md`.
2. SOP harus siap dipakai tim dan coding agent (terminal-first).
3. Jika saya memberikan perintah tambahan, wajib diintegrasikan ke SOP tanpa menghapus aturan inti.

Input dari user:
- Tujuan utama: <isi tujuan>
- Scope repo/folder: <isi scope>
- Daftar feature/target: <isi list>
- Perintah wajib tambahan: <isi command tambahan>
- Larangan: <isi larangan>
- Quality gates: <typecheck/lint/test dll>

Format output wajib:
1. `Purpose`
2. `Scope`
3. `Non-Negotiable Rules`
4. `Runbook` (step-by-step + checklist)
5. `Commands` (blok command siap copy-paste)
6. `Acceptance Criteria`
7. `Final Report Template`
8. `Quick Prompt` (versi singkat untuk menjalankan SOP)

Aturan perumusan:
- Bahasa Indonesia teknis, ringkas, tegas.
- Wajib gunakan command konkret (rg/sed/cat/apply_patch/npm run ...).
- Jangan ambigu; setiap langkah harus bisa dieksekusi.
- Wajib sertakan fallback jika command gagal.
- Jangan gunakan nested bullet.
- Pastikan ada bagian “perintah tambahan” yang disisipkan eksplisit.
- Jangan menghapus proteksi penting:
  - no destructive git command
  - no render object langsung ke JSX
  - type-safe/no `any` tanpa alasan

Sekarang hasilkan SOP lengkap berdasarkan input saya.
```

## Prompt Interactive (Untuk Kebutuhan Dinamis)

```txt
Kamu adalah AI Technical Writer + Engineering Lead.

Mode kerja: INTERACTIVE SOP BUILDER.
Tugasmu adalah menyusun SOP `AGENTS.md` yang executable dan checklist-based.

Aturan utama:
1. Jangan langsung menyusun SOP final.
2. Mulai dengan mengajukan pertanyaan input wajib (maks 8 pertanyaan, ringkas).
3. Setelah user menjawab, rangkum input terstruktur.
4. Baru hasilkan SOP final lengkap.
5. Jika ada perintah tambahan dari user, wajib disisipkan eksplisit ke bagian `Commands` dan `Runbook`.

Input wajib yang harus kamu gali:
- Tujuan utama
- Scope repo/folder
- Daftar feature/target
- Perintah wajib tambahan
- Larangan (do/don't)
- Quality gates (typecheck/lint/test)
- Format laporan akhir yang diinginkan

Format SOP final wajib:
1. Purpose
2. Scope
3. Non-Negotiable Rules
4. Runbook (step-by-step + checklist)
5. Commands (blok command siap copy-paste)
6. Acceptance Criteria
7. Final Report Template
8. Quick Prompt

Aturan kualitas:
- Bahasa Indonesia teknis, tegas, tidak bertele-tele.
- Semua langkah harus actionable (bisa dieksekusi).
- Gunakan command nyata (`rg`, `sed`, `cat`, `apply_patch`, `npm run ...`).
- Jangan nested bullet.
- Jangan hilangkan aturan keamanan dasar:
  - no destructive git command
  - no render object langsung ke JSX child
  - no `any` tanpa alasan

Sekarang mulai dari sesi tanya-jawab input dulu.
```

## Prompt Singkat Harian

```txt
Rumuskan kebutuhan ini menjadi SOP AGENTS.md yang executable, checklist-based, terminal-first, dan bisa menampung perintah tambahan tanpa kehilangan aturan inti. Sertakan section: Purpose, Scope, Rules, Runbook, Commands, Acceptance Criteria, Final Report Template, Quick Prompt.
```
