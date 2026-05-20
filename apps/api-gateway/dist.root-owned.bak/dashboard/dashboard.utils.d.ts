export declare function escapeSqlLiteral(value: string): string;
export declare function asJson<T>(value: unknown, fallback: T): T;
export declare function toNumber(value: unknown): number;
export declare function formatNumber(value: number): string;
export declare function formatMoneyCompact(value: number): string;
export declare function formatPercent(value: number): string;
export declare function toAuditUserId(actorId?: string | number): number | null;
export declare function escapeHtml(value: string): string;
