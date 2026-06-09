---
inclusion: always
---

# PostgreSQL — Koneksi & Query

## Credentials

| Parameter | Nilai |
|-----------|-------|
| Host (luar Docker) | `localhost` / `127.0.0.1` |
| Host (antar container) | `postgres` |
| Port (luar Docker) | `3208` |
| Port (antar container) | `5432` |
| Database | `sentient_factory` |
| User | `root` |
| Container name | `sentient-postgres-core` |
| Timezone | `Asia/Bangkok` (WIB UTC+7) |

> Password: lihat `infra/docker-compose.yml` env `POSTGRES_PASSWORD`. Jangan hardcode.

## Connection Strings

```bash
# Dari luar Docker
postgresql://root:<password>@localhost:3208/sentient_factory

# Antar container
postgresql://root:<password>@postgres:5432/sentient_factory

# ai-engine dari host ke Docker
postgresql://root:<password>@host.docker.internal:3208/sentient_factory
```

## Akses

```bash
# psql langsung
psql -h localhost -p 3208 -U root -d sentient_factory

# Via Docker exec
docker exec -it sentient-postgres-core psql -U root -d sentient_factory

# Backup
bash scripts/backup-postgres.sh
```

## Query Umum

```sql
-- Lihat semua tabel
\dt *.*

-- CDC events terbaru
SELECT * FROM cdc_events ORDER BY created_at DESC LIMIT 20;
SELECT * FROM cdc_current_state WHERE source_table = 'm_item' LIMIT 10;

-- Ukuran database
SELECT pg_size_pretty(pg_database_size('sentient_factory'));

-- Ukuran per tabel
SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::text))
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;

-- Koneksi aktif
SELECT pid, usename, application_name, state, query
FROM pg_stat_activity WHERE datname = 'sentient_factory';
```

## Prisma (api-gateway)

```bash
cd apps/api-gateway
npm run db:generate   # Generate client
npm run db:migrate    # Jalankan migration
npm run db:seed       # Seed data
npx prisma studio     # GUI
```
