import 'dotenv/config';
import { Kafka } from 'kafkajs';
import { Client } from 'pg';
import { ensureWorkerTables } from './db';
import { buildDomainUpserts } from './topic-handlers';

type JsonObject = Record<string, unknown>;

const databaseUrl = mustGetEnv('DATABASE_URL');
const brokers = mustGetEnv('KAFKA_BROKERS').split(',').map((item) => item.trim()).filter(Boolean);
const groupId = process.env.KAFKA_GROUP_ID?.trim() || 'sentient-factory-etl-worker';
const topicPrefix = process.env.CDC_TOPIC_PREFIX?.trim() || 'myerpplus';

async function main() {
  const db = new Client({ connectionString: databaseUrl });
  await db.connect();
  await ensureWorkerTables(db);

  const kafka = new Kafka({ clientId: 'sentient-factory-etl-worker', brokers });
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic: new RegExp(`^${escapeRegex(topicPrefix)}\\..*`), fromBeginning: true });

  console.log(`[etl-worker] subscribed to topics with prefix ${topicPrefix}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) {
        return;
      }

      const payload = unwrapEnvelope(parseJson(message.value.toString()));
      const key = message.key ? JSON.stringify(unwrapEnvelope(parseJson(message.key.toString()))) : buildFallbackKey(topic, partition, message.offset);

      await db.query('BEGIN');

      try {
        await db.query(
          `INSERT INTO cdc_events (
            topic,
            partition,
            message_offset,
            record_key,
            payload
          ) VALUES ($1, $2, $3, $4, $5::jsonb)
          ON CONFLICT (topic, partition, message_offset) DO NOTHING`,
          [topic, partition, message.offset, key, JSON.stringify(payload)],
        );

        await db.query(
          `INSERT INTO cdc_current_state (
            topic,
            record_key,
            payload,
            source_table,
            updated_at
          ) VALUES ($1, $2, $3::jsonb, $4, NOW())
          ON CONFLICT (topic, record_key)
          DO UPDATE SET payload = EXCLUDED.payload, source_table = EXCLUDED.source_table, updated_at = NOW()`,
          [topic, key, JSON.stringify(payload), topicToSourceTable(topic)],
        );

        const domainUpserts = buildDomainUpserts({ topic, key, payload });
        for (const upsert of domainUpserts) {
          await upsertDomainRow(db, upsert.tableName, upsert.primaryKey, upsert.row);
        }

        await db.query('COMMIT');
      } catch (error) {
        await db.query('ROLLBACK');
        throw error;
      }
    },
  });
}

function mustGetEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function parseJson(raw: string): JsonObject {
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { value: parsed };
  }
  return parsed as JsonObject;
}

function unwrapEnvelope(value: JsonObject): JsonObject {
  const payload = value.payload;
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload as JsonObject;
  }

  return value;
}

function buildFallbackKey(topic: string, partition: number, offset: string): string {
  return `${topic}:${partition}:${offset}`;
}

function topicToSourceTable(topic: string): string {
  const parts = topic.split('.');
  return parts.length >= 2 ? parts.slice(1).join('.') : topic;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function upsertDomainRow(
  db: Client,
  tableName: string,
  primaryKey: string,
  row: Record<string, unknown>,
) {
  const entries = Object.entries(row).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return;
  }

  const primaryKeyValue = row[primaryKey];
  if (primaryKeyValue === undefined || primaryKeyValue === null) {
    throw new Error(`Missing primary key ${primaryKey} for domain upsert into ${tableName}`);
  }

  const columns = entries.map(([column]) => column);
  const values = entries.map(([, value]) => value);
  const placeholders = values.map((_, index) => `$${index + 1}`);
  const updates = columns
    .filter((column) => column !== primaryKey)
    .map((column) => `${quoteIdentifier(column)} = EXCLUDED.${quoteIdentifier(column)}`);

  await db.query(
    `INSERT INTO ${quoteIdentifier(tableName)} (${columns.map(quoteIdentifier).join(', ')})
     VALUES (${placeholders.join(', ')})
     ON CONFLICT (${quoteIdentifier(primaryKey)})
     DO ${updates.length > 0 ? `UPDATE SET ${updates.join(', ')}` : 'NOTHING'}`,
    values,
  );
}

function quoteIdentifier(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

main().catch((error) => {
  console.error('[etl-worker] fatal error', error);
  process.exit(1);
});
