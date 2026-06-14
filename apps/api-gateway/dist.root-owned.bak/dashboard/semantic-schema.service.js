"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticSchemaService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let SemanticSchemaService = class SemanticSchemaService {
    dbRoot = this.resolveDbRoot();
    manifestPath = (0, path_1.resolve)(this.dbRoot, 'semantic-schema-manifest.json');
    schemaKeyAliases = {
        sales: 'obt',
        sales_account_receivable: 'obt',
    };
    getAvailableSchemas() {
        return this.loadManifest().schemas;
    }
    loadSchemaByKey(key) {
        const manifest = this.loadManifest();
        const normalizedKey = this.schemaKeyAliases[key] ?? key;
        const entry = manifest.schemas.find((schema) => schema.key === normalizedKey || schema.domain === normalizedKey);
        if (!entry) {
            throw new Error(`Unknown semantic schema key: ${key}`);
        }
        const schemaPath = (0, path_1.resolve)(this.dbRoot, entry.file);
        const schema = this.readJsonFile(schemaPath);
        return {
            selectedKey: entry.key,
            selectedDomain: entry.domain,
            schemaFile: entry.file,
            schemaPath,
            tableCount: schema.tables.length,
            tables: schema.tables,
        };
    }
    inferSchemaKeyFromQuery(query) {
        const q = String(query || '').toLowerCase();
        const compact = ` ${q.replace(/[^a-z0-9_]+/g, ' ')} `;
        const tokens = new Set(compact.trim().split(/\s+/).filter(Boolean));
        const rules = [
            {
                key: 'obt',
                keywords: [
                    'obt',
                    'sales',
                    'penjualan',
                    'piutang',
                    'invoice',
                    'faktur',
                    'so',
                    'do',
                    'quotation',
                ],
            },
            {
                key: 'purchasing',
                keywords: ['purchasing', 'pembelian', 'hutang', 'supplier', 'po', 'grn', 'rfq', 'pr'],
            },
            {
                key: 'inventory',
                keywords: ['inventory', 'gudang', 'stok', 'mutasi', 'warehouse', 'opname', 'barang masuk'],
            },
            {
                key: 'finance',
                keywords: [
                    'finance',
                    'accounting',
                    'jurnal',
                    'buku besar',
                    'kas',
                    'bank',
                    'giro',
                    'coa',
                    'saldo awal',
                ],
            },
            {
                key: 'master',
                keywords: ['master', 'referensi', 'kontak', 'barang', 'item', 'akun', 'customer', 'vendor'],
            },
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
    loadSchemaForQuery(query) {
        return this.loadSchemaByKey(this.inferSchemaKeyFromQuery(query));
    }
    loadManifest() {
        return this.readJsonFile(this.manifestPath);
    }
    readJsonFile(filePath) {
        return JSON.parse((0, fs_1.readFileSync)(filePath, 'utf8'));
    }
    resolveDbRoot() {
        const configured = process.env.MYERPPLUS_DB_MAPPING_ROOT;
        const candidates = [
            configured,
            (0, path_1.resolve)('/myerpplus-db-mapping/db'),
            (0, path_1.resolve)(process.cwd(), '../myerpplus-db-mapping/db'),
            (0, path_1.resolve)(process.cwd(), '../../apps/myerpplus-db-mapping/db'),
            (0, path_1.resolve)(__dirname, '../../../myerpplus-db-mapping/db'),
            (0, path_1.resolve)(__dirname, '../../../../apps/myerpplus-db-mapping/db'),
        ].filter((value) => Boolean(value));
        const match = candidates.find((candidate) => (0, fs_1.existsSync)(candidate));
        if (!match) {
            throw new Error(`Unable to locate myerpplus semantic schema directory. Checked: ${candidates.join(', ')}`);
        }
        return match;
    }
};
exports.SemanticSchemaService = SemanticSchemaService;
exports.SemanticSchemaService = SemanticSchemaService = __decorate([
    (0, common_1.Injectable)()
], SemanticSchemaService);
//# sourceMappingURL=semantic-schema.service.js.map