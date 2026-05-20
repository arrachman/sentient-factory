type SupportedDomain = 'm1' | 'm' | 'm2' | 'm2r' | 'so';
export declare function extractConfidenceAverage(response: unknown): number | null;
export declare function normalizeRange(query: {
    fromDate?: string;
    toDate?: string;
}): {
    fromDate: string;
    toDate: string;
};
export declare function resolveM2SourceCode(domain: SupportedDomain, feature?: string): string | null;
export declare function wrapExecutionError(error: unknown, domain: string, endpoint: string): Error;
export {};
