# Deploy Althea — Production Stack (Ramping)

Stack minimal untuk menjalankan **Althea Psychology** di VPS: hanya
`web-althea` + `api-gateway` + `PostgreSQL` + `Redis`. Tanpa MySQL/MyERP,
Vault, Debezium, Kafka, atau ai-engine (itu jalur ERP, tidak dibutuhkan klinik).

WA notification lewat **Fonnte** (3rd-party HTTP), jadi tidak ada WhatsApp engine
di server. Redis dipakai untuk **BullMQ retry queue** (`WA_QUEUE_ENABLED=true`) —
kalau Fonnte sempat down, job WA di-retry 3× (tidak hilang).

## Prasyarat VPS

- **OS**: Ubuntu 22.04/24.04 LTS (rekomendasi — sesuai asumsi UFW & script repo).
- **Spec**: minimal **2 GB RAM / 1–2 vCPU** (lega di 4 GB).
- **Docker + Docker Compose plugin** terpasang.
- **Reverse proxy** (NPM / nginx) + domain + SSL (Let's Encrypt) di depan stack.

## Langkah deploy

```bash
cd infra

# 1. Siapkan env (JANGAN commit file terisi — sudah di-gitignore)
cp .env.althea-prod.example .env.althea-prod
#    edit .env.althea-prod → isi POSTGRES_PASSWORD, JWT_SECRET, FONNTE_*, domain
#    JWT_SECRET: openssl rand -hex 32

# 2. Build + jalankan (migrasi Prisma auto-run saat api-gateway start)
docker compose --env-file .env.althea-prod -f docker-compose.althea-prod.yml up -d --build

# 3. (Sekali, opsional) seed data awal — role, service catalog, WA template:
docker compose --env-file .env.althea-prod -f docker-compose.althea-prod.yml \
  exec api-gateway sh -c "npm run db:seed"

# 4. Cek status & log
docker compose -f docker-compose.althea-prod.yml ps
docker compose -f docker-compose.althea-prod.yml logs -f api-gateway
```

`prisma migrate deploy` dijalankan otomatis di entrypoint api-gateway (lihat
`apps/api-gateway/Dockerfile`) — apply migrasi yang sudah ada, non-interaktif,
aman untuk prod (tidak generate migrasi baru).

## Reverse proxy (NPM / nginx)

Port app hanya di-bind ke `127.0.0.1` (tidak diekspos ke LAN/internet). Arahkan:

| Public URL            | Proxy ke              |
| --------------------- | --------------------- |
| `althea.domain/`      | `127.0.0.1:3202`      |
| `althea.domain/api`   | `127.0.0.1:3203`      |

Strategi same-origin → `NEXT_PUBLIC_API_URL=/api`. api-gateway pakai prefix `/api`
(global prefix), jadi `althea.domain/api/clinic/...` mengarah ke endpoint klinik.

### UFW
Buka **80/443 saja** ke publik. Jangan expose 3202/3203/5432/6379.

```bash
sudo ufw allow 80/tcp  && sudo ufw allow 443/tcp && sudo ufw reload
```

## Env penting (lihat `.env.althea-prod.example`)

| Var                     | Fungsi                                              |
| ----------------------- | --------------------------------------------------- |
| `POSTGRES_*`            | Kredensial DB (dipakai service postgres + api)      |
| `JWT_SECRET`            | Wajib — auth login                                  |
| `CORS_ORIGIN`           | Origin frontend yang boleh akses api-gateway        |
| `NEXT_PUBLIC_API_URL`   | URL API utk browser (default `/api`, di-bake build) |
| `FONNTE_ACCOUNT_TOKEN`  | Token account Fonnte (pairing device in-app)        |
| `FONNTE_API_TOKEN`      | Per-device token (opsional bila pair via UI)        |
| `WEB_ALTHEA_URL`        | URL app (template WA `login_url`)                   |

`WA_QUEUE_ENABLED=true`, `REDIS_URL`, `VAULT_ENABLED=false`, `DATABASE_URL`,
`API_URL_INTERNAL` sudah di-set di compose (tidak perlu diubah).

## Catatan / caveat

- **api-gateway = monolit** (melayani ERP + klinik dalam satu Nest app). Stack ini
  hanya menyalakan dependensi klinik (Postgres + Redis). Modul ERP yang butuh
  MySQL/MyERP **tidak** punya koneksi di sini — endpoint `/api/clinic/*` tetap jalan,
  tapi log mungkin menampilkan warning dari modul ERP. Itu wajar untuk deploy
  klinik-only. Bila ingin benar-benar bersih, perlu memisahkan modul (di luar scope).
- **Mode sync (tanpa Redis)** masih mungkin: set `WA_QUEUE_ENABLED` ≠ `true` dan
  hapus service `redis` — tapi kehilangan retry otomatis bila Fonnte gagal.
- **Backup DB**: volume `althea_pgdata`. Jadwalkan `pg_dump` rutin.
  ```bash
  docker compose -f docker-compose.althea-prod.yml exec postgres \
    pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > althea-$(date +%F).sql
  ```
</content>
