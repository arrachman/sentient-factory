# etl-worker — Agent Guide

Worker ETL: konsumsi event CDC (Debezium → Kafka) → tulis ke Postgres.

## Stack
- TypeScript + ts-node (dev), Node 20+.
- **kafkajs** — consumer Kafka.
- **pg** — Postgres client (jangan pakai ORM di sini, latency-sensitive).
- **dotenv** — loading config dev.

## Perintah
```bash
npm run dev          # ts-node src/index.ts
npm run build && npm start
npm run typecheck
```

## Tanggung jawab
- Consume topik Debezium dari MySQL MyERP+ (lihat `infra/debezium/connectors/mysql-myerpplus.json.tpl`).
- Transform payload Debezium (op: c/u/d, before/after) → upsert/delete ke Postgres.
- **Idempoten** — pakai PK + version/LSN untuk dedup; consumer offset di-commit setelah berhasil tulis.

## Konvensi
- Satu file = satu handler topic. Map `topic → handler` di `src/index.ts`.
- **Selalu** transaksi per-batch; rollback = jangan commit offset Kafka.
- Logging structured (JSON). Pakai `@sentient-factory/logger`.
- Skema DB target ada di `apps/api-gateway/prisma/schema.prisma`. **Jangan** bikin tabel sendiri di sini.

## Konfigurasi
Env via Vault: `npm run vault:render:etl-worker` (di root). Output → `apps/etl-worker/.env.vault`.
Variabel kunci:
- `KAFKA_BROKERS`
- `KAFKA_GROUP_ID` (jangan share dengan worker lain → duplikasi consume)
- `POSTGRES_URL`
- Topic prefix dari Debezium config

## Hal yang sering bikin masalah
- Reset consumer group di prod tanpa snapshot ulang → data loss.
- Tidak handle `tombstone` event (value=null) → row tidak terhapus.
- Long-running transaction blocking Postgres autovacuum.
- Lupa idempotency key → duplikasi row saat consumer rebalance.

## Testing
- Unit untuk transform pure function.
- Integrasi: pakai testcontainers (Kafka + Postgres). Belum ada — tambahkan saat menyentuh logic kritis.

## Jangan disentuh tanpa diminta
- `KAFKA_GROUP_ID` produksi.
- Connector Debezium — render via `npm run cdc:connector:render:myerp` di root, jangan edit JSON manual.
