declare const DELIVERY_ORDER_STATUSES: readonly ["OPEN", "DELIVERY", "DELIVERED", "COMPLETED"];
export declare class QueryOutboundDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: (typeof DELIVERY_ORDER_STATUSES)[number];
    customerId?: string;
    warehouseId?: string;
    doDateFrom?: string;
    doDateTo?: string;
}
export {};
