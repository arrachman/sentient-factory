import 'dotenv/config';
import { Client } from 'pg';
import { ensureWorkerTables } from './db';
import { mergeAllCore } from './merge-helpers';

async function main() {
  const db = new Client({ connectionString: mustGetEnv('DATABASE_URL') });
  await db.connect();
  await ensureWorkerTables(db);

  try {
    await db.query('BEGIN');
    const { users, roles, contacts } = await mergeAllCore(db);
    await db.query('COMMIT');
    console.log('[merge-core] done', { users, roles, contacts });
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  } finally {
    await db.end();
  }
}

function mustGetEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

main().catch((error) => {
  console.error('[merge-core] fatal error', error);
  process.exit(1);
});
