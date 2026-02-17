import { CreateInboundDetailDto } from './create-inbound-detail.dto';
declare const INBOUND_STATUSES: readonly ["DRAFT", "POSTED", "CANCELLED"];
export declare class CreateInboundDto {
    transactionNo?: string;
    transactionDate?: string;
    supplierId: string;
    warehouseId: string;
    notes?: string;
    status?: (typeof INBOUND_STATUSES)[number];
    details: CreateInboundDetailDto[];
}
export {};
