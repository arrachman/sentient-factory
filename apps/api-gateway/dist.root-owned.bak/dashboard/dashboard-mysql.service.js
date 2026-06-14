"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardMysqlService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const promise_1 = __importDefault(require("mysql2/promise"));
const dashboard_mysql_utils_1 = require("./dashboard-mysql.utils");
const DATE_COLUMN_CANDIDATES = [
    'created_at',
    'tanggal',
    'tgl',
    'ctgl',
    'aptgl',
    'adtgl',
    'trx_date',
    'transaction_date',
    'date',
    'inputtgl',
    'postingtgl',
    'createdon',
    'inputdate',
];
let DashboardMysqlService = class DashboardMysqlService {
    configService;
    pool = null;
    tableDateColumnCache = new Map();
    constructor(configService) {
        this.configService = configService;
    }
    async executeTemplate(domain, fileName, params) {
        const templatePath = this.getTemplatePath(domain, fileName);
        if (!(0, fs_1.existsSync)(templatePath)) {
            throw new Error(`Dashboard SQL template not found: ${templatePath}`);
        }
        const templateSql = await (0, promises_1.readFile)(templatePath, 'utf8');
        const sourceTable = this.extractFirstSourceTable(templateSql);
        const dateExpr = await this.resolveDateExpression(sourceTable);
        const sql = this.bindTemplate(templateSql, {
            ...params,
            dateExpr,
        });
        const pool = this.getPool();
        const [rows] = await pool.query(sql);
        return rows;
    }
    async executeRawQuery(sql) {
        const pool = this.getPool();
        const [rows] = await pool.query(sql);
        return rows;
    }
    async healthCheck(domains) {
        const candidates = (0, dashboard_mysql_utils_1.getTemplateRootCandidates)(this.configService.get('DASHBOARD_SQL_TEMPLATE_ROOT'));
        const templateRoot = (0, dashboard_mysql_utils_1.resolveTemplateRoot)(candidates);
        const config = (0, dashboard_mysql_utils_1.getMysqlConfig)(this.configService);
        const pool = this.getPool();
        await pool.query('SELECT 1');
        const templates = domains.map((domain) => ({
            domain,
            files: {
                summary: (0, fs_1.existsSync)(this.getTemplatePath(domain, 'summary.sql')),
                trends: (0, fs_1.existsSync)(this.getTemplatePath(domain, 'trends.sql')),
                breakdown: (0, fs_1.existsSync)(this.getTemplatePath(domain, 'breakdown.sql')),
                table: (0, fs_1.existsSync)(this.getTemplatePath(domain, 'table.sql')),
            },
        }));
        return {
            templateRoot,
            database: {
                host: config.host,
                port: config.port,
                user: config.user,
                database: config.database,
            },
            mysqlPing: true,
            templates,
        };
    }
    async getDomainMetadata(domain) {
        const candidates = (0, dashboard_mysql_utils_1.getTemplateRootCandidates)(this.configService.get('DASHBOARD_SQL_TEMPLATE_ROOT'));
        const templateRoot = (0, dashboard_mysql_utils_1.resolveTemplateRoot)(candidates);
        const templates = {
            summary: this.getTemplatePath(domain, 'summary.sql'),
            trends: this.getTemplatePath(domain, 'trends.sql'),
            breakdown: this.getTemplatePath(domain, 'breakdown.sql'),
            table: this.getTemplatePath(domain, 'table.sql'),
        };
        const sourceTables = {
            summary: await this.getTemplateSourceTable(templates.summary),
            trends: await this.getTemplateSourceTable(templates.trends),
            breakdown: await this.getTemplateSourceTable(templates.breakdown),
            table: await this.getTemplateSourceTable(templates.table),
        };
        const uniqueTables = Array.from(new Set(Object.values(sourceTables).filter((table) => Boolean(table))));
        const columnsByTable = await Promise.all(uniqueTables.map(async (tableName) => this.getTableColumnMetadata(tableName)));
        return {
            templateRoot,
            domain,
            templates,
            sourceTables,
            columnsByTable,
        };
    }
    getTemplatePath(domain, fileName) {
        const candidates = (0, dashboard_mysql_utils_1.getTemplateRootCandidates)(this.configService.get('DASHBOARD_SQL_TEMPLATE_ROOT'));
        const root = fileName
            ? (0, dashboard_mysql_utils_1.resolveTemplateRootForDomainAndFile)(candidates, domain, fileName)
            : (0, dashboard_mysql_utils_1.resolveTemplateRootForDomain)(candidates, domain);
        return (0, path_1.resolve)(root, domain, fileName);
    }
    async onModuleDestroy() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
    }
    getPool() {
        if (this.pool) {
            return this.pool;
        }
        const cfg = (0, dashboard_mysql_utils_1.getMysqlConfig)(this.configService);
        this.pool = promise_1.default.createPool({
            host: cfg.host,
            port: cfg.port,
            user: cfg.user,
            password: cfg.password,
            database: cfg.database,
            waitForConnections: true,
            connectionLimit: 5,
            decimalNumbers: false,
            supportBigNumbers: true,
            dateStrings: true,
        });
        return this.pool;
    }
    bindTemplate(templateSql, params) {
        let sql = templateSql;
        if (params.fromDate) {
            sql = sql.replaceAll(':from_date', (0, dashboard_mysql_utils_1.quoteDate)(params.fromDate));
        }
        if (params.toDate) {
            sql = sql.replaceAll(':to_date', (0, dashboard_mysql_utils_1.quoteDate)(params.toDate));
        }
        if (params.limit !== undefined) {
            sql = sql.replaceAll(':limit', (0, dashboard_mysql_utils_1.assertInt)(params.limit, 'limit'));
        }
        if (params.offset !== undefined) {
            sql = sql.replaceAll(':offset', (0, dashboard_mysql_utils_1.assertInt)(params.offset, 'offset'));
        }
        sql = sql.replaceAll('__DATE_EXPR__', params.dateExpr);
        sql = sql.replaceAll('__GROUP_BY__', params.groupBy ? (0, dashboard_mysql_utils_1.assertIdentifier)(params.groupBy, 'groupBy') : 'status');
        sql = sql.replaceAll('__ORDER_BY__', params.orderBy ? (0, dashboard_mysql_utils_1.assertIdentifier)(params.orderBy, 'orderBy') : 'created_at');
        sql = sql.replaceAll('__ORDER_DIR__', params.orderDir ?? 'DESC');
        sql = sql.replaceAll('__SOURCE_FILTER__', params.sourceCode
            ? ` AND COALESCE(j.tsumber, '') = ${(0, dashboard_mysql_utils_1.quoteString)(params.sourceCode)}`
            : '');
        sql = sql.replaceAll('__SOURCE_FILTER_X__', params.sourceCode
            ? ` AND COALESCE(x.tsumber, '') = ${(0, dashboard_mysql_utils_1.quoteString)(params.sourceCode)}`
            : '');
        sql = sql.replaceAll('__SOURCE_CODE_LITERAL__', params.sourceCode ? (0, dashboard_mysql_utils_1.quoteString)(params.sourceCode) : 'NULL');
        return sql;
    }
    extractFirstSourceTable(templateSql) {
        const match = templateSql.match(/\bFROM\s+`?([A-Za-z_][A-Za-z0-9_]*)`?/i);
        return match?.[1] ?? null;
    }
    async getTemplateSourceTable(templatePath) {
        if (!(0, fs_1.existsSync)(templatePath)) {
            return null;
        }
        const sql = await (0, promises_1.readFile)(templatePath, 'utf8');
        return this.extractFirstSourceTable(sql);
    }
    async getTableColumnMetadata(tableName) {
        const pool = this.getPool();
        const cfg = (0, dashboard_mysql_utils_1.getMysqlConfig)(this.configService);
        const [rows] = await pool.query(`SELECT COLUMN_NAME
       FROM information_schema.columns
       WHERE table_schema = ?
         AND table_name = ?
       ORDER BY ordinal_position ASC`, [cfg.database, tableName]);
        const columns = rows.map((row) => row.COLUMN_NAME);
        const lowerSet = new Set(columns.map((col) => col.toLowerCase()));
        const dateColumnCandidates = DATE_COLUMN_CANDIDATES.filter((candidate) => lowerSet.has(candidate));
        const selectedDateColumn = dateColumnCandidates[0] ?? null;
        return {
            tableName,
            columns,
            dateColumnCandidates: [...dateColumnCandidates],
            selectedDateColumn,
        };
    }
    async resolveDateExpression(tableName) {
        if (!tableName) {
            return 'NOW()';
        }
        const cached = this.tableDateColumnCache.get(tableName);
        if (cached) {
            return cached;
        }
        const pool = this.getPool();
        const cfg = (0, dashboard_mysql_utils_1.getMysqlConfig)(this.configService);
        const [rows] = await pool.query(`SELECT COLUMN_NAME
       FROM information_schema.columns
       WHERE table_schema = ?
         AND table_name = ?`, [cfg.database, tableName]);
        const columns = rows.map((row) => row.COLUMN_NAME.toLowerCase());
        const columnSet = new Set(columns);
        const pickedExact = DATE_COLUMN_CANDIDATES.find((candidate) => columnSet.has(candidate)) ?? null;
        const pickedByPattern = columns.find((column) => column.endsWith('tgl')) ??
            columns.find((column) => column.includes('date')) ??
            null;
        const picked = pickedExact ?? pickedByPattern;
        const expression = picked ? `\`${picked}\`` : 'NOW()';
        this.tableDateColumnCache.set(tableName, expression);
        return expression;
    }
};
exports.DashboardMysqlService = DashboardMysqlService;
exports.DashboardMysqlService = DashboardMysqlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DashboardMysqlService);
//# sourceMappingURL=dashboard-mysql.service.js.map