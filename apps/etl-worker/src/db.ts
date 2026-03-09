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

  await db.query(`
    CREATE TABLE IF NOT EXISTS cdc_myerpplus_users (
      source_user_id BIGINT PRIMARY KEY,
      email TEXT NOT NULL,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_by BIGINT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_by BIGINT,
      deleted_at TIMESTAMPTZ
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS cdc_myerpplus_roles (
      source_role_id BIGINT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      is_system BOOLEAN NOT NULL DEFAULT FALSE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS cdc_myerpplus_contacts (
      source_contact_id BIGINT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      contact_first_name TEXT,
      contact_email TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS cdc_myerpplus_user_core_map (
      source_user_id BIGINT PRIMARY KEY,
      core_user_id INTEGER NOT NULL UNIQUE,
      matched_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS cdc_myerpplus_role_core_map (
      source_role_id BIGINT PRIMARY KEY,
      core_role_id INTEGER NOT NULL UNIQUE,
      matched_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS cdc_myerpplus_contact_core_map (
      source_contact_id BIGINT PRIMARY KEY,
      core_contact_id INTEGER NOT NULL UNIQUE,
      matched_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}
