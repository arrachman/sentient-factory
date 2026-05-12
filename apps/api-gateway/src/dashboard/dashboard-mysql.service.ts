import {
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import mysql, { Pool, RowDataPacket } from 'mysql2/promise';
import {
  getMysqlConfig,
  getTemplateRootCandidates,
  resolveTemplateRoot,
  resolveTemplateRootForDomain,
  resolveTemplateRootForDomainAndFile,
  quoteString,
  quoteDate,
  assertInt,
  assertIdentifier,
} from './dashboard-mysql.utils';

type DashboardTemplateParams = {
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
  groupBy?: string;
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
  sourceCode?: string | null;
};

type DashboardDomain = 'm1' | 'm' | 'm2' | 'm2r' | 'so';

type HealthResult = {
  templateRoot: string;
  database: {
    host: string;
    port: number;
    user: string;
    database: string;
  };
  mysqlPing: boolean;
  templates: Array<{
    domain: DashboardDomain;
    files: {
      summary: boolean;
      trends: boolean;
      breakdown: boolean;
      table: boolean;
    };
  }>;
};

type DomainMetadataResult = {
  templateRoot: string;
  domain: DashboardDomain;
  templates: {
    summary: string;
    trends: string;
    breakdown: string;
    table: string;
  };
  sourceTables: {
    summary: string | null;
    trends: string | null;
    breakdown: string | null;
    table: string | null;
  };
  columnsByTable: Array<{
    tableName: string;
    columns: string[];
    dateColumnCandidates: string[];
    selectedDateColumn: string | null;
  }>;
};

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
] as const;

type ColumnNameRow = RowDataPacket & {
  COLUMN_NAME: string;
};

@Injectable()
export class DashboardMysqlService implements OnModuleDestroy {
  private pool: Pool | null = null;
  private readonly tableDateColumnCache = new Map<string, string>();

  constructor(private readonly configService: ConfigService) {}

  async executeTemplate(
    domain: DashboardDomain,
    fileName: string,
    params: DashboardTemplateParams,
  ): Promise<RowDataPacket[]> {
    const templatePath = this.getTemplatePath(domain, fileName);
    if (!existsSync(templatePath)) {
      throw new Error(`Dashboard SQL template not found: ${templatePath}`);
    }

    const templateSql = await readFile(templatePath, 'utf8');
    const sourceTable = this.extractFirstSourceTable(templateSql);
    const dateExpr = await this.resolveDateExpression(sourceTable);

    const sql = this.bindTemplate(templateSql, {
      ...params,
      dateExpr,
    });

    const pool = this.getPool();
    const [rows] = await pool.query<RowDataPacket[]>(sql);
    return rows;
  }

  async executeRawQuery(sql: string): Promise<RowDataPacket[]> {
    const pool = this.getPool();
    const [rows] = await pool.query<RowDataPacket[]>(sql);
    return rows;
  }

  async healthCheck(domains: readonly DashboardDomain[]): Promise<HealthResult> {
    const candidates = getTemplateRootCandidates(
      this.configService.get<string>('DASHBOARD_SQL_TEMPLATE_ROOT'),
    );
    const templateRoot = resolveTemplateRoot(candidates);
    const config = getMysqlConfig(this.configService);

    const pool = this.getPool();
    await pool.query('SELECT 1');

    const templates = domains.map((domain) => ({
      domain,
      files: {
        summary: existsSync(this.getTemplatePath(domain, 'summary.sql')),
        trends: existsSync(this.getTemplatePath(domain, 'trends.sql')),
        breakdown: existsSync(this.getTemplatePath(domain, 'breakdown.sql')),
        table: existsSync(this.getTemplatePath(domain, 'table.sql')),
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

  async getDomainMetadata(domain: DashboardDomain): Promise<DomainMetadataResult> {
    const candidates = getTemplateRootCandidates(
      this.configService.get<string>('DASHBOARD_SQL_TEMPLATE_ROOT'),
    );
    const templateRoot = resolveTemplateRoot(candidates);
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

    const uniqueTables = Array.from(
      new Set(Object.values(sourceTables).filter((table): table is string => Boolean(table))),
    );

    const columnsByTable = await Promise.all(
      uniqueTables.map(async (tableName) => this.getTableColumnMetadata(tableName)),
    );

    return {
      templateRoot,
      domain,
      templates,
      sourceTables,
      columnsByTable,
    };
  }

  getTemplatePath(domain: DashboardDomain, fileName: string): string {
    const candidates = getTemplateRootCandidates(
      this.configService.get<string>('DASHBOARD_SQL_TEMPLATE_ROOT'),
    );
    const root = fileName
      ? resolveTemplateRootForDomainAndFile(candidates, domain, fileName)
      : resolveTemplateRootForDomain(candidates, domain);
    return resolve(root, domain, fileName);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  private getPool(): Pool {
    if (this.pool) {
      return this.pool;
    }

    const cfg = getMysqlConfig(this.configService);

    this.pool = mysql.createPool({
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

  private bindTemplate(
    templateSql: string,
    params: DashboardTemplateParams & { dateExpr: string },
  ): string {
    let sql = templateSql;

    if (params.fromDate) {
      sql = sql.replaceAll(':from_date', quoteDate(params.fromDate));
    }
    if (params.toDate) {
      sql = sql.replaceAll(':to_date', quoteDate(params.toDate));
    }
    if (params.limit !== undefined) {
      sql = sql.replaceAll(':limit', assertInt(params.limit, 'limit'));
    }
    if (params.offset !== undefined) {
      sql = sql.replaceAll(':offset', assertInt(params.offset, 'offset'));
    }

    sql = sql.replaceAll('__DATE_EXPR__', params.dateExpr);
    sql = sql.replaceAll(
      '__GROUP_BY__',
      params.groupBy ? assertIdentifier(params.groupBy, 'groupBy') : 'status',
    );
    sql = sql.replaceAll(
      '__ORDER_BY__',
      params.orderBy ? assertIdentifier(params.orderBy, 'orderBy') : 'created_at',
    );
    sql = sql.replaceAll('__ORDER_DIR__', params.orderDir ?? 'DESC');
    sql = sql.replaceAll(
      '__SOURCE_FILTER__',
      params.sourceCode
        ? ` AND COALESCE(j.tsumber, '') = ${quoteString(params.sourceCode)}`
        : '',
    );
    sql = sql.replaceAll(
      '__SOURCE_FILTER_X__',
      params.sourceCode
        ? ` AND COALESCE(x.tsumber, '') = ${quoteString(params.sourceCode)}`
        : '',
    );
    sql = sql.replaceAll(
      '__SOURCE_CODE_LITERAL__',
      params.sourceCode ? quoteString(params.sourceCode) : 'NULL',
    );

    return sql;
  }

  private extractFirstSourceTable(templateSql: string): string | null {
    const match = templateSql.match(/\bFROM\s+`?([A-Za-z_][A-Za-z0-9_]*)`?/i);
    return match?.[1] ?? null;
  }

  private async getTemplateSourceTable(templatePath: string): Promise<string | null> {
    if (!existsSync(templatePath)) {
      return null;
    }
    const sql = await readFile(templatePath, 'utf8');
    return this.extractFirstSourceTable(sql);
  }

  private async getTableColumnMetadata(tableName: string): Promise<{
    tableName: string;
    columns: string[];
    dateColumnCandidates: string[];
    selectedDateColumn: string | null;
  }> {
    const pool = this.getPool();
    const cfg = getMysqlConfig(this.configService);
    const [rows] = await pool.query<ColumnNameRow[]>(
      `SELECT COLUMN_NAME
       FROM information_schema.columns
       WHERE table_schema = ?
         AND table_name = ?
       ORDER BY ordinal_position ASC`,
      [cfg.database, tableName],
    );

    const columns = rows.map((row) => row.COLUMN_NAME);
    const lowerSet = new Set(columns.map((col) => col.toLowerCase()));
    const dateColumnCandidates = DATE_COLUMN_CANDIDATES.filter((candidate) =>
      lowerSet.has(candidate),
    );
    const selectedDateColumn = dateColumnCandidates[0] ?? null;

    return {
      tableName,
      columns,
      dateColumnCandidates: [...dateColumnCandidates],
      selectedDateColumn,
    };
  }

  private async resolveDateExpression(tableName: string | null): Promise<string> {
    if (!tableName) {
      return 'NOW()';
    }

    const cached = this.tableDateColumnCache.get(tableName);
    if (cached) {
      return cached;
    }

    const pool = this.getPool();
    const cfg = getMysqlConfig(this.configService);
    const [rows] = await pool.query<ColumnNameRow[]>(
      `SELECT COLUMN_NAME
       FROM information_schema.columns
       WHERE table_schema = ?
         AND table_name = ?`,
      [cfg.database, tableName],
    );

    const columns = rows.map((row) => row.COLUMN_NAME.toLowerCase());
    const columnSet = new Set(columns);
    const pickedExact =
      DATE_COLUMN_CANDIDATES.find((candidate) => columnSet.has(candidate)) ?? null;
    const pickedByPattern =
      columns.find((column) => column.endsWith('tgl')) ??
      columns.find((column) => column.includes('date')) ??
      null;
    const picked = pickedExact ?? pickedByPattern;
    const expression = picked ? `\`${picked}\`` : 'NOW()';
    this.tableDateColumnCache.set(tableName, expression);
    return expression;
  }
}
