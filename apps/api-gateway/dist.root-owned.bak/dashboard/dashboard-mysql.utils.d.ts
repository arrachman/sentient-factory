export type MysqlConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
};
type EnvReader = {
    get<T = string>(key: string): T | undefined;
};
export declare function getMysqlConfig(configService: EnvReader): MysqlConfig;
export declare function getTemplateRootCandidates(configuredRoot: string | undefined): string[];
export declare function resolveTemplateRoot(candidates: string[]): string;
export declare function resolveTemplateRootForDomain(candidates: string[], domain: string): string;
export declare function resolveTemplateRootForDomainAndFile(candidates: string[], domain: string, fileName: string): string;
export declare function quoteString(value: string): string;
export declare function quoteDate(value: string): string;
export declare function assertInt(value: number, label: string): string;
export declare function assertIdentifier(value: string, label: string): string;
export {};
