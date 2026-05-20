import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RowDataPacket } from 'mysql2/promise';
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
export declare class DashboardMysqlService implements OnModuleDestroy {
    private readonly configService;
    private pool;
    private readonly tableDateColumnCache;
    constructor(configService: ConfigService);
    executeTemplate(domain: DashboardDomain, fileName: string, params: DashboardTemplateParams): Promise<RowDataPacket[]>;
    executeRawQuery(sql: string): Promise<RowDataPacket[]>;
    healthCheck(domains: readonly DashboardDomain[]): Promise<HealthResult>;
    getDomainMetadata(domain: DashboardDomain): Promise<DomainMetadataResult>;
    getTemplatePath(domain: DashboardDomain, fileName: string): string;
    onModuleDestroy(): Promise<void>;
    private getPool;
    private bindTemplate;
    private extractFirstSourceTable;
    private getTemplateSourceTable;
    private getTableColumnMetadata;
    private resolveDateExpression;
}
export {};
