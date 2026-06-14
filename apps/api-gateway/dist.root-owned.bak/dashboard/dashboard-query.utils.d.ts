import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';
declare const SUPPORTED_DOMAINS: readonly ["m1", "m", "m2", "m2r", "so"];
export type SupportedDomain = (typeof SUPPORTED_DOMAINS)[number];
export declare const DOMAIN_FIELD_ALLOWLIST: Record<SupportedDomain, {
    groupBy: readonly string[];
    sortBy: readonly string[];
}>;
export declare function assertDomain(domain: string): SupportedDomain;
export declare function normalizeRange(query: QueryDashboardRangeDto): {
    fromDate: string;
    toDate: string;
};
export declare function resolveAllowedGroupBy(domain: SupportedDomain, input?: string): string;
export declare function resolveAllowedSortBy(domain: SupportedDomain, input?: string): string;
export declare function resolveM2SourceCode(domain: SupportedDomain, feature?: string): string | null;
export declare function wrapExecutionError(error: unknown, domain: string, endpoint: string): Error;
export declare function filterExistingColumns(candidates: readonly string[], columns?: Set<string>): string[];
export {};
