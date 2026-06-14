/**
 * fix-transactions-posted-and-partner.mjs
 *
 * Perbaikan data transaksi DUMMY_SEED agar memenuhi 2 syarat:
 *   1. "Terima dari" (partner_id) terisi — acak per arah:
 *        - RECEIPT / giro INCOMING  -> partner customer acak
 *        - DISBURSEMENT / giro OUTGOING -> partner supplier acak
 *        - Journal (tanpa arah) -> partner acak dari semua partner
 *   2. Semua dokumen TERPOSTING (status=POSTED) lewat API state machine
 *      (SUBMIT -> APPROVE -> POST) sehingga GL ledger ikut ter-generate.
 *
 * Urutan: isi partner_id DULU (SQL) baru POST via API, agar ledger entry
 * yang baru mewarisi partner_id. Untuk dokumen yang SUDAH posted, partner_id
 * dipropagasi ke fin_ledger_entries yang sudah ada.
 *
 * HANYA menyentuh baris dengan source LIKE 'DUMMY%'.
 *
 * Usage: node scripts/fix-transactions-posted-and-partner.mjs [--dry-run]
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV = readFileSync(join(__dirname, '../apps/api-gateway/.env'), 'utf8');
const DB_URL = ENV.match(/^DATABASE_URL=(.+)$/m)[1].trim().replace(/^"|"$/g, '');
const PASSWORD = (ENV.match(/^ERP_ADMIN_PASSWORD=(.+)$/m)?.[1]?.trim())
  ?? process.env.ERP_SEED_PASSWORD ?? 'Admin123!';

const API_BASE = 'http://localhost:3203/api';
const DRY_RUN = process.argv.includes('--dry-run');
// fin_giro_entries tidak punya kolom `source`; semua giro = data seed.
const srcClause = (tbl) => (tbl === 'fin_giro_entries' ? 'TRUE' : "source LIKE 'DUMMY%'");

const { Client } = pg;
const db = new Client({ connectionString: DB_URL });

const ENDPOINT = {
  fin_cash_bank_transactions: 'cash-bank-transactions',
  fin_journal_entries: 'journal-entries',
  fin_giro_entries: 'giro-entries',
};
const ACTIONS_BY_STATUS = {
  DRAFT: ['SUBMIT', 'APPROVE', 'POST'],
  NEED_APPROVE: ['APPROVE', 'POST'],
  APPROVED: ['POST'],
};

const log = (...a) => console.log(...a);

async function login() {
  const res = await fetch(`${API_BASE}/erp/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: 'admin', password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const token = json?.data?.accessToken ?? json?.data?.token ?? json?.token;
  if (!token) throw new Error(`No token: ${JSON.stringify(json)}`);
  log(`✅ Login OK (token len=${token.length})`);
  return token;
}

// ── Phase A: isi partner_id (acak per arah) ──────────────────────────────────
async function fillPartners() {
  log('\n── Phase A: isi "terima dari" (partner_id) ──');
  const pool = `(SELECT array_agg(id) arr FROM md_partners WHERE deleted_at IS NULL AND %FILTER%)`;
  const cust = pool.replace('%FILTER%', 'is_customer');
  const supp = pool.replace('%FILTER%', 'is_supplier');
  const all = pool.replace('%FILTER%', 'TRUE');
  const pick = 'p.arr[1 + floor(random()*cardinality(p.arr))::int]';

  const stmts = [
    ['cashbank RECEIPT  -> customer', `UPDATE fin_cash_bank_transactions t SET partner_id=${pick} FROM ${cust} p WHERE t.deleted_at IS NULL AND t.partner_id IS NULL AND t.direction='RECEIPT' AND t.${srcClause('fin_cash_bank_transactions')}`],
    ['cashbank DISBURSE -> supplier', `UPDATE fin_cash_bank_transactions t SET partner_id=${pick} FROM ${supp} p WHERE t.deleted_at IS NULL AND t.partner_id IS NULL AND t.direction='DISBURSEMENT' AND t.${srcClause('fin_cash_bank_transactions')}`],
    ['giro INCOMING     -> customer', `UPDATE fin_giro_entries t SET partner_id=${pick} FROM ${cust} p WHERE t.deleted_at IS NULL AND t.partner_id IS NULL AND t.type='INCOMING' AND ${srcClause('fin_giro_entries')}`],
    ['giro OUTGOING     -> supplier', `UPDATE fin_giro_entries t SET partner_id=${pick} FROM ${supp} p WHERE t.deleted_at IS NULL AND t.partner_id IS NULL AND t.type='OUTGOING' AND ${srcClause('fin_giro_entries')}`],
    ['journal           -> any',      `UPDATE fin_journal_entries t SET partner_id=${pick} FROM ${all} p WHERE t.deleted_at IS NULL AND t.partner_id IS NULL AND t.${srcClause('fin_journal_entries')}`],
  ];
  for (const [label, sql] of stmts) {
    if (DRY_RUN) { log(`  [dry] ${label}`); continue; }
    const r = await db.query(sql);
    log(`  ${label}: ${r.rowCount} doc`);
  }

  // Propagasi ke ledger entries yang SUDAH ada (dokumen sudah posted)
  log('── Phase A2: propagasi partner_id ke fin_ledger_entries existing ──');
  for (const tbl of Object.keys(ENDPOINT)) {
    const sql = `UPDATE fin_ledger_entries le SET partner_id=t.partner_id
      FROM ${tbl} t
      WHERE le.source_doc_type='${tbl}' AND le.source_id=t.id
        AND le.partner_id IS DISTINCT FROM t.partner_id AND t.partner_id IS NOT NULL`;
    if (DRY_RUN) { log(`  [dry] ledger <- ${tbl}`); continue; }
    const r = await db.query(sql);
    log(`  ledger <- ${tbl}: ${r.rowCount} baris`);
  }
}

// ── Phase B: posting via API ─────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function transition(token, endpoint, id, action) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`${API_BASE}/erp/fin/${endpoint}/${id}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    });
    if (res.ok) return;
    if (res.status === 429) { await sleep(1000 * (attempt + 1)); continue; } // backoff on throttle
    throw new Error(`${action} ${res.status}: ${(await res.text()).slice(0, 160)}`);
  }
  throw new Error(`${action} 429: throttled after retries`);
}

async function postDoc(token, endpoint, id, status) {
  for (const action of ACTIONS_BY_STATUS[status] ?? ['POST']) {
    await transition(token, endpoint, id, action);
  }
}

async function postAll(token) {
  log('\n── Phase B: posting dokumen belum terposting ──');
  const summary = {};
  for (const [tbl, endpoint] of Object.entries(ENDPOINT)) {
    const { rows } = await db.query(
      `SELECT id::text, status FROM ${tbl} WHERE deleted_at IS NULL AND status<>'POSTED' AND ${srcClause(tbl)} ORDER BY id`,
    );
    let ok = 0; const fails = [];
    log(`  ${endpoint}: ${rows.length} kandidat`);
    if (DRY_RUN) { summary[endpoint] = { candidates: rows.length, posted: 0, failed: 0 }; continue; }
    const CONC = 2;
    for (let i = 0; i < rows.length; i += CONC) {
      const batch = rows.slice(i, i + CONC);
      const results = await Promise.allSettled(
        batch.map((r) => postDoc(token, endpoint, r.id, r.status)),
      );
      results.forEach((res, j) => {
        if (res.status === 'fulfilled') ok++;
        else fails.push({ id: batch[j].id, err: res.reason.message });
      });
    }
    summary[endpoint] = { candidates: rows.length, posted: ok, failed: fails.length };
    if (fails.length) {
      const sample = fails.slice(0, 3).map((f) => `#${f.id}: ${f.err}`).join(' | ');
      log(`    ⚠️  gagal ${fails.length}. Contoh: ${sample}`);
    }
    log(`    ✅ posted ${ok}/${rows.length}`);
  }
  return summary;
}

async function finalReport() {
  log('\n── Verifikasi akhir (deleted_at IS NULL) ──');
  for (const tbl of Object.keys(ENDPOINT)) {
    const { rows } = await db.query(
      `SELECT count(*) total,
              count(*) FILTER (WHERE status='POSTED') posted,
              count(*) FILTER (WHERE partner_id IS NULL) no_partner
       FROM ${tbl} WHERE deleted_at IS NULL AND ${srcClause(tbl)}`,
    );
    const r = rows[0];
    log(`  ${tbl}: total=${r.total} posted=${r.posted} tanpa_partner=${r.no_partner}`);
  }
}

async function main() {
  log(`Mode: ${DRY_RUN ? 'DRY-RUN' : 'EXECUTE'}`);
  await db.connect();
  try {
    const token = await login();
    await fillPartners();
    const summary = await postAll(token);
    await finalReport();
    log('\n=== RINGKASAN POSTING ===');
    log(JSON.stringify(summary, null, 2));
  } finally {
    await db.end();
  }
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
