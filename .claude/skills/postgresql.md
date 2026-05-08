---
name: postgresql
description: Skill koneksi dan penggunaan PostgreSQL di Sentient Factory — credentials, port, cara akses dari luar/dalam Docker, dan query umum.
---

## Koneksi PostgreSQL Sentient Factory

### Credentials

| Parameter | Nilai |
|-----------|-------|
| Host (dari luar Docker) | `localhost` atau `127.0.0.1` |
| Host (antar container) | `postgres` |
| Port (dari luar Docker) | `3208` |
| Port (antar container) | `5432` |
| Database | `sentient_factory` |
| User | `root` |
| Password | lihat `infra/docker-compose.yml` (env `POSTGRES_PASSWORD`) |
| Timezone | `Asia/Bangkok` (WIB UTC+7) |
| Container name | `sentient-postgres-core` |

### Connection String

```bash
# Dari luar Docker (local machine / tools seperti DBeaver, TablePlus)
postgresql://root:<password>@localhost:3208/sentient_factory

# Dari dalam Docker container (antar service)
postgresql://root:<password>@postgres:5432/sentient_factory

# Untuk ai-engine (audit DB — dari host ke Docker)
postgresql://root:<password>@host.docker.internal:3208/sentient_factory
```

---

## Cara Akses

### 1. Via psql (terminal langsung)
```bash
psql -h localhost -p 3208 -U root -d sentient_factory
```

### 2. Via Docker Exec
```bash
docker exec -it sentient-postgres-core psql -U root -d sentient_factory
```

### 3. Via script backup
```bash
bash scripts/backup-postgres.sh
```

---

## Query Umum

```sql
-- Lihat semua schema
\dn

-- Lihat semua tabel
\dt *.*

-- Lihat tabel OBT
\dt obt_*

-- Lihat tabel CDC
SELECT * FROM cdc_events ORDER BY created_at DESC LIMIT 20;
SELECT * FROM cdc_current_state WHERE source_table = 'm_item' LIMIT 10;

-- Cek ukuran database
SELECT pg_size_pretty(pg_database_size('sentient_factory'));

-- Cek ukuran per tabel
SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::text))
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;

-- Cek koneksi aktif
SELECT pid, usename, application_name, state, query
FROM pg_stat_activity WHERE datname = 'sentient_factory';
```

---

## Prisma (api-gateway)

```bash
cd apps/api-gateway

# Generate client
npm run db:generate

# Jalankan migration
npm run db:migrate

# Seed data
npm run db:seed

# Buka Prisma Studio (GUI)
npx prisma studio
```

---

## Env Variables

```bash
# .env (development — password placeholder)
DATABASE_URL=postgresql://root:change_me@postgres:5432/sentient_factory

# docker-compose.yml (password aktual)
DATABASE_URL=postgresql://root:<password_aktual>@postgres:5432/sentient_factory

# ai-engine (akses dari host ke Docker)
AI_AUDIT_DATABASE_URL=postgresql://root:<password_aktual>@host.docker.internal:3208/sentient_factory
```

> **Catatan:** Password di `.env` adalah placeholder `change_me`.
> Password aktual ada di `infra/docker-compose.yml`.
