# web-nuha — SIMTERPADU

Aplikasi nyata (bukan prototype statis) untuk **Sistem Informasi Manajemen
Terpadu** Yayasan Pendidikan Islam Nurul Huda Mergosono.

Berasal dari prototype `apps/marketing/sub/nuha` (export claude.ai/design, satu
file HTML tanpa backend). Di sini alur dan datanya dipindahkan ke stack nyata:
**Next.js (App Router) + Prisma + MySQL**, dijalankan lewat Docker Compose.

## Prinsip data: satu identitas, banyak peran

Konsep inti prototype dipertahankan di skema. Seorang santri pondok yang juga
siswa SMP adalah **satu** record `Orang` dengan beberapa baris peran
(`Santri`, `Pegawai`, `User`, `RelasiWali`) — bukan beberapa record per unit.
Layar **Data Induk** adalah demonstrasi utama konsep ini.

## Menjalankan

Butuh Docker. Semuanya berdiri sendiri — tidak menyentuh `infra/docker-compose.yml`,
MySQL bersama di port 3307, atau `config/ports.json`.

```bash
cd apps/web-nuha
cp .env.example .env       # WAJIB: ganti password & AUTH_SECRET
docker compose up -d --build
```

Compose menjalankan tiga langkah berurutan:

1. `nuha-mysql` — MySQL 8 di host port **3308**, volume `nuha_simterpadu_mysql_data`.
2. `nuha-migrate` — job sekali jalan: `prisma migrate deploy` lalu seed. Idempoten.
3. `nuha-app` — Next.js standalone di host port **3226**, start setelah migrasi sukses.

Verifikasi:

```bash
curl -s http://127.0.0.1:3226/api/health   # {"success":true,...,"database":"connected"}
```

Akun demo hasil seed: `ketua@nuha.pesantren.web.id` / `Nuha2026!`
(8 akun, satu per peran — ganti password sebelum dipakai sungguhan.)

## Pengembangan lokal

Node 20+ (host default masih 18 — pakai nvm). Dependensi di-hoist ke root
monorepo lewat npm workspaces.

```bash
npm install --workspace web-nuha
cd apps/web-nuha
docker compose up -d nuha-mysql
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev            # http://localhost:3226
```

`prisma migrate dev` butuh shadow database. User `nuha` sudah diberi akses ke
`nuha_shadow`; set `SHADOW_DATABASE_URL` di `.env` bila membuat DB dari nol.
Untuk deploy cukup `prisma migrate deploy` (tanpa shadow DB).

## Layar

| Rute | Isi |
| --- | --- |
| `/login` | Masuk; sesi JWT HS256 di cookie httpOnly (8 jam) |
| `/` | Dashboard yayasan: santri aktif, PPDB, tunggakan, agenda, pengumuman |
| `/induk` | Data Induk lintas unit — satu identitas, banyak peran |
| `/kepesantrenan` | Okupansi asrama, setoran hafalan, ta'zir, perizinan |
| `/poskestren` | Rekam kunjungan kesehatan + stok obat |
| `/keuangan` | Tagihan SPP/syahriyah, pembayaran, kas |
| `/ppdb` | Formulir pendaftaran (tulis ke DB) + rekap pendaftar |

Menu sidebar **tidak hardcoded** — dibaca dari tabel `menu`/`menu_peran` sesuai
peran user yang login.

## API

Semua respons memakai envelope `{ success, data, error }`.

| Endpoint | Keterangan |
| --- | --- |
| `GET /api/health` | Cek liveness + koneksi DB |
| `POST /api/auth/login` | Login; validasi zod, bcrypt, waktu respons konstan |
| `POST /api/ppdb` | Pendaftaran PPDB (publik, tervalidasi) |
| `GET /api/ppdb` | Rekap pendaftar (**wajib sesi**) |

## Data seed

Seed mengimpor dataset asli dari prototype (`prisma/proto-data.json`, hasil
ekstraksi 42 array dari `dist/index.html`) menjadi record relasional:
60 orang, 20 santri, 12 pegawai + komponen gaji, 19 pendaftar, 20 tagihan,
16 pembayaran, 12 setoran hafalan, 18 rekam medis, 10 izin, 41 kamar,
38 template WA, dan 14 menu berbasis peran.

Seed adalah importer first-boot: bila user sudah ada, proses langsung berhenti agar data operasional tidak terduplikasi atau tertimpa. Untuk memuat ulang demo data, gunakan database/volume pengembangan baru.

## Catatan

- Port 3226 (app) dan 3308 (MySQL) **belum** didaftarkan di `config/ports.json`
  dan **belum** dibuka di UFW — keduanya sengaja tidak disentuh (lihat CLAUDE.md
  root §2 dan §9). Untuk akses dari LAN, daftarkan port lalu:
  `sudo ufw allow from 192.168.1.0/24 to any port 3226 proto tcp comment 'web-nuha'`
- Prototype lama di `apps/marketing/sub/nuha` **tetap ada** dan masih jalan di
  port 3223 — berguna sebagai rujukan desain layar yang belum diimplementasi
  (LMS, kurikulum, penggajian, portal wali, notifikasi WA). Skema DB-nya sudah
  disiapkan; UI-nya belum dibuat.
- `.env` berisi rahasia dan tidak di-commit (`.gitignore` + `.dockerignore`).
