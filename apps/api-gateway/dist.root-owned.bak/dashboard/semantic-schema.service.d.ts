type SemanticSchemaEntry = {
    key: string;
    domain: string;
    description: string;
    file: string;
    table_prefixes: string[];
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
export type SemanticSchemaContext = {
    selectedKey: string;
    selectedDomain: string;
    schemaFile: string;
    schemaPath: string;
    tableCount: number;
    tables: SemanticSchemaTable[];
};
export declare class SemanticSchemaService {
    private readonly dbRoot;
    private readonly manifestPath;
    private readonly schemaKeyAliases;
    getAvailableSchemas(): SemanticSchemaEntry[];
    loadSchemaByKey(key: string): SemanticSchemaContext;
    inferSchemaKeyFromQuery(query: string): string;
    loadSchemaForQuery(query: string): SemanticSchemaContext;
    private loadManifest;
    private readJsonFile;
    private resolveDbRoot;
}
export {};
