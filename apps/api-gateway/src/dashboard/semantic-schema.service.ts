import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

type SemanticSchemaEntry = {
  key: string;
  domain: string;
  description: string;
  file: string;
  table_prefixes: string[];
};

type SemanticSchemaManifest = {
  schemas: SemanticSchemaEntry[];
};

type SemanticSchemaTable = {
  table_name: string;
  alias: string;
  description: string;
  synonyms: string[];
  always_apply_filters?: string;
  columns: Record<string, string>;
  metrics?: Record<string, string>;
  relationships?: Array<{
    target_table: string;
    condition: string;
  }>;
};

type SemanticSchemaDocument = {
  tables: SemanticSchemaTable[];
};

export type SemanticSchemaContext = {
  selectedKey: string;
  selectedDomain: string;
  schemaFile: string;
  schemaPath: string;
  tableCount: number;
  tables: SemanticSchemaTable[];
};

@Injectable()
export class SemanticSchemaService {
  private readonly dbRoot = this.resolveDbRoot();
  private readonly manifestPath = resolve(this.dbRoot, 'semantic-schema-manifest.json');

  getAvailableSchemas(): SemanticSchemaEntry[] {
    return this.loadManifest().schemas;
  }

  loadSchemaByKey(key: string): SemanticSchemaContext {
    const manifest = this.loadManifest();
    const entry = manifest.schemas.find((schema) => schema.key === key || schema.domain === key);
    if (!entry) {
      throw new Error(`Unknown semantic schema key: ${key}`);
    }

    const schemaPath = resolve(this.dbRoot, entry.file);
    const schema = this.readJsonFile<SemanticSchemaDocument>(schemaPath);

    return {
      selectedKey: entry.key,
      selectedDomain: entry.domain,
      schemaFile: entry.file,
      schemaPath,
      tableCount: schema.tables.length,
      tables: schema.tables,
    };
  }

  inferSchemaKeyFromQuery(query: string): string {
    const q = String(query || '').toLowerCase();
    const compact = ` ${q.replace(/[^a-z0-9_]+/g, ' ')} `;
    const tokens = new Set(compact.trim().split(/\s+/).filter(Boolean));

    const rules = [
      { key: 'sales', keywords: ['sales', 'penjualan', 'piutang', 'invoice', 'faktur', 'so', 'do', 'quotation'] },
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

    const hasKeyword = (keyword: string) => {
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

  loadSchemaForQuery(query: string): SemanticSchemaContext {
    return this.loadSchemaByKey(this.inferSchemaKeyFromQuery(query));
  }

  private loadManifest(): SemanticSchemaManifest {
    return this.readJsonFile<SemanticSchemaManifest>(this.manifestPath);
  }

  private readJsonFile<T>(filePath: string): T {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T;
  }

  private resolveDbRoot(): string {
    const candidates = [
      resolve(process.cwd(), '../myerpplus-db-mapping/db'),
      resolve(process.cwd(), '../../apps/myerpplus-db-mapping/db'),
      resolve(__dirname, '../../../myerpplus-db-mapping/db'),
      resolve(__dirname, '../../../../apps/myerpplus-db-mapping/db'),
    ];

    const match = candidates.find((candidate) => existsSync(candidate));
    if (!match) {
      throw new Error('Unable to locate myerpplus semantic schema directory');
    }

    return match;
  }
}
