# Intent — SIMTERPADU Nuha

## Tujuan

Membangun fondasi aplikasi SIMTERPADU untuk Pesantren Nuha Mergosono yang dapat berkembang dari prototype statis menjadi sistem operasional terintegrasi.

## Batasan saat ini

- Prototype lama tetap disimpan di `dist/` dan tidak diubah oleh scaffold ini.
- API belum terhubung database; endpoint awal hanya `GET /api/health`.
- Web menggunakan data presentasi statis untuk memvalidasi struktur Atomic Design.

## Prinsip arsitektur

1. **API (`apps/api`)**: NestJS + TypeScript dengan modularisasi domain, validasi input di boundary, Helmet, CORS terbatas, dan throttling.
2. **Web (`apps/web`)**: Next.js App Router + TypeScript.
3. **UI**: Atomic Design: `atoms` → `molecules` → `organisms` → `templates` → pages.
4. **Konsep domain**: satu identitas santri dapat memiliki banyak peran lintas unit; jangan menggandakan record per unit.
5. **Konfigurasi**: port melalui environment variable; development default web `3226`, api `3228`.

## Alur development

```bash
npm install
npm run dev
```

- Web: http://localhost:3226
- API health: http://localhost:3228/api/health

## Optimasi baseline

- API memakai compression untuk response di atas 1 KB, Helmet, throttling global, dan logger produksi yang lebih tenang.
- Web memakai compression, ETag, `poweredByHeader` nonaktif, serta cache immutable untuk chunk `/_next/static/*`.
- Jalur pengukuran awal: API langsung median sekitar 1,2 ms, API melalui proxy web sekitar 5,7 ms pada mesin development.
- Setelah domain dan database ditambahkan, ukur ulang query, serialisasi payload, cache response, dan ukuran bundle sebelum menambah optimasi lain.

## Arah berikutnya

- Tambahkan module domain (santri, akademik, kepesantrenan, keuangan, PPDB).
- Tambahkan persistence layer dan migration setelah kebutuhan domain disepakati.
- Tambahkan auth dan authorization sebelum data operasional digunakan.
- Migrasikan layar prototype secara bertahap ke komponen Atomic Design.
