---
name: etl-worker
description: Skill untuk bekerja dengan apps/etl-worker — Node.js Kafka consumer untuk CDC (Change Data Capture) dari MyERPPlus via Debezium, menyimpan events ke PostgreSQL.
---

Kamu sedang bekerja di `apps/etl-worker` — ETL pipeline service Sentient Factory.

## Tech Stack
- **Runtime**: Node.js + TypeScript 5.9.2
- **Message Queue**: KafkaJS 2.2.4
- **Database**: PostgreSQL (pg client 8.18.0)
- **Config**: dotenv

## Struktur File (`src/`)

| File | Fungsi |
|------|--------|
| `index.ts` | Entry point — inisialisasi Kafka consumer, subscribe topics |
| `db.ts` | Setup koneksi PostgreSQL, DDL tabel cdc_events & cdc_current_state |
| `topic-handlers.ts` | Routing CDC message ke handler yang tepat |

## Alur Data

```
MyERPPlus (MySQL)
    ↓ Debezium CDC Connector
Kafka Topics: myerpplus.<table_name>
    ↓ ETL Worker (KafkaJS consumer)
PostgreSQL
├── cdc_events          → Raw CDC events (insert/update/delete history)
└── cdc_current_state   → State terkini per row (upsert)
    ↓
OBT Transformation Scripts (myerpplus-db-mapping)
    ↓
obt_* / dim_* tables (untuk AI Engine)
```

## Database Tables yang Dikelola

### `cdc_events`
Menyimpan semua raw CDC events — append only.
- `id`, `topic`, `source_table`, `operation` (c/u/d/r), `payload`, `created_at`

### `cdc_current_state`
Current state per row per source table — upsert by primary key.
- `source_table`, `row_key`, `data`, `updated_at`

## Perintah Umum

```bash
# Development
npm run dev              # ts-node dengan hot reload

# Build & Production
npm run build            # Compile TypeScript ke dist/
npm run start            # node dist/index.js

# Cek koneksi Kafka
# Pastikan KAFKA_BROKERS bisa diakses
```

## Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@host:5432/sentient_factory
KAFKA_BROKERS=localhost:9092                    # Comma-separated brokers
KAFKA_GROUP_ID=sentient-factory-etl-worker      # Consumer group ID
CDC_TOPIC_PREFIX=myerpplus                       # Prefix Kafka topic
```

## Topic Pattern

ETL Worker subscribe ke semua topic yang match pattern: `^myerpplus\..*`

Contoh topics yang dikonsumsi:
- `myerpplus.m_item` → tabel item MyERPPlus
- `myerpplus.m_contact` → tabel contact
- `myerpplus.t_sales_order` → tabel sales order
- dst.

## Panduan Tugas Umum

### Menambah Domain Upsert Handler
Di `topic-handlers.ts`, ada hook untuk domain-specific upsert (saat ini disabled):
```typescript
// Tambah handler untuk table tertentu
if (sourceTable === 'm_item') {
  await upsertItem(db, payload)
}
```

### Debugging CDC Events
```sql
-- Cek events terbaru
SELECT * FROM cdc_events ORDER BY created_at DESC LIMIT 20;

-- Cek current state tabel tertentu
SELECT * FROM cdc_current_state WHERE source_table = 'm_item' LIMIT 10;

-- Cek jumlah events per tabel
SELECT source_table, operation, COUNT(*) FROM cdc_events
GROUP BY source_table, operation ORDER BY COUNT(*) DESC;
```

### Troubleshooting Kafka Connection
```bash
# Test koneksi dari dalam container
docker exec -it kafka kafka-topics.sh --list --bootstrap-server localhost:9092

# Cek consumer group lag
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group sentient-factory-etl-worker --describe
```

### Re-processing CDC Events
Untuk re-process events, reset consumer group offset:
```bash
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group sentient-factory-etl-worker \
  --topic myerpplus.m_item \
  --reset-offsets --to-earliest --execute
```
