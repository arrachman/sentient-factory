declare const INBOUND_STATUSES: readonly ["DRAFT", "POSTED", "CANCELLED"];
export declare class QueryInboundDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: (typeof INBOUND_STATUSES)[number];
    supplierId?: string;
    warehouseId?: string;
    transactionDateFrom?: string;
    transactionDateTo?: string;
}
export {};
