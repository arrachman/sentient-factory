---
name: ref-audit
description: >
  Clean Code Audit untuk repo Sentient Factory. Cari file source > 400 baris,
  buat split plan ke modul < 400 baris, lalu refactor + verifikasi. HANYA
  refactor source code aplikasi/bisnis. JANGAN sentuh file tidak penting:
  Prisma (schema/migrations/generated client), log/logging, dan data
  seed/feed/mock/fixture — itu bukan target clean code.
trigger: >
  Aktif saat user menyebut "ref-audit", "/ref-audit", "clean code audit",
  "audit file > 400 baris", "split file kepanjangan", atau minta refactor
  ukuran file di repo.
---

# Clean Code Audit

## Scope — baca dulu

Audit ini **HANYA** untuk source code aplikasi/bisnis (logic, komponen, service,
util). **JANGAN refactor / split** hal-hal berikut walau > 400 baris — bukan
target clean code dan refactor di sini cuma bikin risiko tanpa nilai:

- **Prisma**: `schema.prisma`, folder `prisma/`, `migrations/`, generated client.
- **Log / logging**: file `*.log`, folder `logs/`, dump log.
- **Data feed/seed**: `seed*`, `*.seed.*`, `data.*`, `*-data.*`, `*.mock.*`,
  folder `seeds/ fixtures/ mocks/ __mocks__/`.
- **Generated / build / vendor**: `dist*`, `build`, `.next`, `.turbo`, `out`,
  `coverage`, `node_modules`, `vendor`, `.tmp`, `.cache`, `*backup*`,
  `*_locked_*`, `*.d.ts`, `*.generated.*`, `*.gen.*`, `*.min.js`,
  `*.bundle.js`, file test (`*.test.* *.spec.*`).

Kalau ragu sebuah app/folder itu vendored/third-party (mis. sub-app yang
bukan kode inti repo), **tanya user** dulu app mana yang mau diaudit sebelum
jalan — jangan refactor kode pihak ketiga.

## Langkah

1. **Scan** file source > 400 baris dengan exclusion di atas sudah dibuang:

   ```bash
   find apps packages \
     -type d \( -name 'node_modules' -o -name 'dist*' -o -name 'build' \
       -o -name '.next' -o -name '.turbo' -o -name '.tmp' -o -name '.cache' \
       -o -name '.git' -o -name 'out' -o -name 'coverage' -o -name 'prisma' \
       -o -name 'migrations' -o -name '.vercel' -o -name 'generated' \
       -o -name '__generated__' -o -name '__mocks__' -o -name 'mocks' \
       -o -name 'fixtures' -o -name 'seeds' -o -name 'logs' -o -name 'vendor' \
       -o -name '*backup*' -o -name '*_locked_*' \) -prune -o \
     -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' \
       -o -name '*.jsx' -o -name '*.py' \) \
     ! -name '*.d.ts' ! -name '*.generated.*' ! -name '*.gen.*' \
     ! -name '*.min.js' ! -name '*.bundle.js' \
     ! -name '*.test.*' ! -name '*.spec.*' \
     ! -iname 'seed*' ! -iname '*.seed.*' ! -iname 'data.*' \
     ! -iname '*-data.*' ! -iname '*.mock.*' \
     -print0 2>/dev/null | xargs -0 wc -l 2>/dev/null \
     | awk '$1>400 && $2!="total"' | sort -rn
   ```

2. **List** tiap file: path, line count, tanggung jawab utama (1 kalimat).
3. **Propose split plan**: pecah ke modul < 400 baris, jaga named exports,
   tidak mengubah behavior (pure restructure). Tunjukkan plan sebelum eksekusi.
4. **Refactor**. Untuk batch besar, spawn satu sub-agent (`Task`) per file biar
   context parent tetap kecil — lihat skill `multi-agents`.
5. **Verifikasi**: `npm run typecheck` lalu `npm run lint`. Wajib hijau sebelum
   lanjut. Kalau ada perubahan Prisma yang tak terhindarkan, jangan diproses di
   sini (lihat Scope).
6. **Commit terpisah per file**, prefix `refactor:`, pesan jelas. Jangan tumpuk
   banyak file dalam satu commit.
