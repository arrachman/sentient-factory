---
inclusion: fileMatch
fileMatchPattern: "apps/etl-worker/**"
---

# ETL Worker — Kafka CDC Consumer

`apps/etl-worker` — ETL pipeline service. Kafka consumer untuk CDC dari MyERPPlus via Debezium.

## Tech Stack

- Node.js + TypeScript 5.9.2
- KafkaJS 2.2.4
- PostgreSQL (pg client 8.18.0)

## Alur Data

```
MyERPPlus (MySQL)
    ↓ Debezium CDC
Kafka Topics: myerpplus.<table_name>
    ↓ ETL Worker
PostgreSQL sentient_factory
├── cdc_events          → Raw events (append only)
└── cdc_current_state   → State terkini per row (upsert)
    ↓
OBT Transformation (apps/myerpplus-db-mapping)
    ↓
obt_* / dim_* tables → AI Engine
```

## Struktur File (`src/`)

| File | Fungsi |
|------|--------|
| `index.ts` | Entry point — init Kafka consumer, subscribe topics |
| `db.ts` | Setup PostgreSQL, DDL `cdc_events` & `cdc_current_state` |
| `topic-handlers.ts` | Routing CDC message ke handler |

## Topic Pattern

Subscribe semua: `^myerpplus\..*` (mis. `myerpplus.m_item`, `myerpplus.t_sales_order`)

## Environment Variables

```bash
DATABASE_URL=postgresql://...
KAFKA_BROKERS=localhost:9092
KAFKA_GROUP_ID=sentient-factory-etl-worker
CDC_TOPIC_PREFIX=myerpplus
```

## Perintah

```bash
npm run dev          # ts-node hot reload
npm run build && npm run start
```

## Debugging

```sql
-- Events terbaru
SELECT * FROM cdc_events ORDER BY created_at DESC LIMIT 20;
-- Per tabel
SELECT source_table, operation, COUNT(*) FROM cdc_events
GROUP BY source_table, operation ORDER BY COUNT(*) DESC;
```

```bash
# Reset consumer group (re-process)
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group sentient-factory-etl-worker \
  --topic myerpplus.m_item \
  --reset-offsets --to-earliest --execute
```
