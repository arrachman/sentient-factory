import { Client } from 'pg';

export async function ensureWorkerTables(db: Client) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS cdc_events (
      id BIGSERIAL PRIMARY KEY,
      topic TEXT NOT NULL,
      partition INTEGER NOT NULL,
      message_offset BIGINT NOT NULL,
      record_key TEXT NOT NULL,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (topic, partition, message_offset)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS cdc_current_state (
      id BIGSERIAL PRIMARY KEY,
      topic TEXT NOT NULL,
      record_key TEXT NOT NULL,
      source_table TEXT NOT NULL,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (topic, record_key)
    )
  `);
}
