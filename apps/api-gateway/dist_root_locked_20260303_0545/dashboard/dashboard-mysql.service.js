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
            throw new common_1.NotFoundException(`Dashboard SQL template not found: ${templatePath}`);
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
    async healthCheck(domains) {
        const templateRoot = this.resolveTemplateRoot();
        const config = this.getMysqlConfig();
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
        const templateRoot = this.resolveTemplateRoot();
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
        const root = fileName
            ? this.resolveTemplateRootForDomainAndFile(domain, fileName)
            : this.resolveTemplateRootForDomain(domain);
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
        const cfg = this.getMysqlConfig();
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
    getMysqlConfig() {
        const host = this.configService.get('DASHBOARD_MYSQL_HOST') ??
            this.configService.get('MYSQL_HOST') ??
            '127.0.0.1';
        const port = Number(this.configService.get('DASHBOARD_MYSQL_PORT') ??
            this.configService.get('MYSQL_PORT') ??
            '3307');
        const user = this.configService.get('DASHBOARD_MYSQL_USER') ??
            this.configService.get('MYSQL_USER') ??
            'root';
        const password = this.configService.get('DASHBOARD_MYSQL_PASSWORD') ??
            this.configService.get('MYSQL_ROOT_PASSWORD') ??
            this.configService.get('MYSQL_PASSWORD') ??
            '';
        const database = this.configService.get('DASHBOARD_MYSQL_DATABASE') ??
            this.configService.get('MYSQL_DATABASE') ??
            'myerpplus';
        return { host, port, user, password, database };
    }
    resolveTemplateRoot() {
        const candidates = this.getTemplateRootCandidates();
        const root = candidates.find((candidate) => (0, fs_1.existsSync)(candidate));
        if (!root) {
            throw new common_1.InternalServerErrorException(`Dashboard SQL template root not found. Checked: ${candidates.join(', ')}`);
        }
        return root;
    }
    getTemplateRootCandidates() {
        const configured = this.configService.get('DASHBOARD_SQL_TEMPLATE_ROOT');
        return [
            configured,
            (0, path_1.resolve)(process.cwd(), 'sql-templates'),
            (0, path_1.resolve)(process.cwd(), '../myerpplus-db-mapping/dashboard-mapping/sql-templates'),
            (0, path_1.resolve)(process.cwd(), '../../apps/myerpplus-db-mapping/dashboard-mapping/sql-templates'),
            (0, path_1.resolve)(__dirname, '../../../myerpplus-db-mapping/dashboard-mapping/sql-templates'),
        ].filter((value) => Boolean(value));
    }
    resolveTemplateRootForDomain(domain) {
        const candidates = this.getTemplateRootCandidates();
        const rootWithDomain = candidates.find((candidate) => (0, fs_1.existsSync)((0, path_1.resolve)(candidate, domain)));
        if (rootWithDomain) {
            return rootWithDomain;
        }
        return this.resolveTemplateRoot();
    }
    resolveTemplateRootForDomainAndFile(domain, fileName) {
        const candidates = this.getTemplateRootCandidates();
        const rootWithFile = candidates.find((candidate) => (0, fs_1.existsSync)((0, path_1.resolve)(candidate, domain, fileName)));
        if (rootWithFile) {
            return rootWithFile;
        }
        return this.resolveTemplateRootForDomain(domain);
    }
    bindTemplate(templateSql, params) {
        let sql = templateSql;
        if (params.fromDate) {
            sql = sql.replaceAll(':from_date', this.quoteDate(params.fromDate));
        }
        if (params.toDate) {
            sql = sql.replaceAll(':to_date', this.quoteDate(params.toDate));
        }
        if (params.limit !== undefined) {
            sql = sql.replaceAll(':limit', this.assertInt(params.limit, 'limit'));
        }
        if (params.offset !== undefined) {
            sql = sql.replaceAll(':offset', this.assertInt(params.offset, 'offset'));
        }
        sql = sql.replaceAll('__DATE_EXPR__', params.dateExpr);
        sql = sql.replaceAll('__GROUP_BY__', params.groupBy ? this.assertIdentifier(params.groupBy, 'groupBy') : 'status');
        sql = sql.replaceAll('__ORDER_BY__', params.orderBy ? this.assertIdentifier(params.orderBy, 'orderBy') : 'created_at');
        sql = sql.replaceAll('__ORDER_DIR__', params.orderDir ?? 'DESC');
        sql = sql.replaceAll('__SOURCE_FILTER__', params.sourceCode ? ` AND COALESCE(j.tsumber, '') = ${this.quoteString(params.sourceCode)}` : '');
        sql = sql.replaceAll('__SOURCE_FILTER_X__', params.sourceCode ? ` AND COALESCE(x.tsumber, '') = ${this.quoteString(params.sourceCode)}` : '');
        return sql;
    }
    quoteString(value) {
        return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
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
        const cfg = this.getMysqlConfig();
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
        const cfg = this.getMysqlConfig();
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
    quoteDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new common_1.InternalServerErrorException(`Invalid date literal format: ${value}`);
        }
        return `'${value}'`;
    }
    assertInt(value, label) {
        if (!Number.isInteger(value) || value < 0) {
            throw new common_1.InternalServerErrorException(`Invalid integer for ${label}`);
        }
        return String(value);
    }
    assertIdentifier(value, label) {
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
            throw new common_1.InternalServerErrorException(`Unsafe SQL identifier for ${label}`);
        }
        return value;
    }
};
exports.DashboardMysqlService = DashboardMysqlService;
exports.DashboardMysqlService = DashboardMysqlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DashboardMysqlService);
//# sourceMappingURL=dashboard-mysql.service.js.map