const fs = require('fs');
const path = require('path');

const DB_DIR = path.resolve(__dirname, '../db');
const MANIFEST_PATH = path.join(DB_DIR, 'semantic-schema-manifest.json');
const SCHEMA_KEY_ALIASES = {
  sales: 'obt',
  sales_account_receivable: 'obt',
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadManifest() {
  return readJson(MANIFEST_PATH);
}

function resolveSchemaFile(fileName) {
  return path.join(DB_DIR, fileName);
}

function loadSchemaByKey(key) {
  const manifest = loadManifest();
  const normalizedKey = SCHEMA_KEY_ALIASES[key] || key;
  const entry = manifest.schemas.find(
    (schema) => schema.key === normalizedKey || schema.domain === normalizedKey,
  );
  if (!entry) {
    throw new Error(`Unknown semantic schema key: ${key}`);
  }

  const filePath = resolveSchemaFile(entry.file);
  return {
    manifest: entry,
    file_path: filePath,
    schema: readJson(filePath),
  };
}

function inferSchemaKeyFromQuery(query) {
  const q = String(query || '').toLowerCase();
  const compact = ` ${q.replace(/[^a-z0-9_]+/g, ' ')} `;
  const tokens = new Set(compact.trim().split(/\s+/).filter(Boolean));

  const rules = [
    { key: 'obt', keywords: ['obt', 'sales', 'penjualan', 'piutang', 'invoice', 'faktur', 'so', 'do', 'quotation'] },
    { key: 'purchasing', keywords: ['purchasing', 'pembelian', 'hutang', 'supplier', 'po', 'grn', 'rfq', 'pr'] },
    { key: 'inventory', keywords: ['inventory', 'gudang', 'stok', 'mutasi', 'warehouse', 'opname', 'barang masuk'] },
    { key: 'finance', keywords: ['finance', 'accounting', 'jurnal', 'buku besar', 'kas', 'bank', 'giro', 'coa', 'saldo awal'] },
    { key: 'master', keywords: ['master', 'referensi', 'kontak', 'barang', 'item', 'akun', 'customer', 'vendor'] },
    { key: 'm1', keywords: ['m1_'] },
    { key: 'm2', keywords: ['m2_'] },
    { key: 'm3', keywords: ['m3_'] },
    { key: 'm4', keywords: ['m4_'] },
    { key: 'm5', keywords: ['m5_'] },
  ];

  const hasKeyword = (keyword) => {
    if (keyword.endsWith('_')) {
      return q.includes(keyword);
    }
    if (keyword.includes(' ')) {
      return compact.includes(` ${keyword} `);
    }
    if (keyword.length <= 3) {
      return tokens.has(keyword);
    }
    return compact.includes(` ${keyword} `);
  };

  const match = rules.find((rule) => rule.keywords.some(hasKeyword));
  return match ? match.key : 'all';
}

function loadSchemaForQuery(query) {
  const key = inferSchemaKeyFromQuery(query);
  return loadSchemaByKey(key);
}

if (require.main === module) {
  const input = process.argv.slice(2).join(' ').trim();
  const result = input ? loadSchemaForQuery(input) : loadSchemaByKey('all');
  process.stdout.write(
    JSON.stringify(
      {
        selected_key: result.manifest.key,
        file: result.manifest.file,
        table_count: result.schema.tables.length,
      },
      null,
      2,
    ) + '\n',
  );
}

module.exports = {
  inferSchemaKeyFromQuery,
  loadManifest,
  loadSchemaByKey,
  loadSchemaForQuery,
};
