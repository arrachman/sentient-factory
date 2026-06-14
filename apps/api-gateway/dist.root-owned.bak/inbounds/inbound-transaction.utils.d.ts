import { CreateInboundBatchDto } from './dto/create-inbound-batch.dto';
import { CreateInboundDetailDto } from './dto/create-inbound-detail.dto';
export type NormalizedInboundBatch = {
    batchIn: string;
    qty: number;
    expiredDate?: string;
    notes?: string;
};
export type NormalizedInboundDetail = {
    itemId: number;
    qty: number;
    uomInput?: number;
    notes?: string;
    batches: NormalizedInboundBatch[];
};
export declare function parseIntStrict(value: string, fieldLabel: string): number;
export declare function normalizeAndValidateBatches(batches: CreateInboundBatchDto[]): NormalizedInboundBatch[];
export declare function normalizeAndValidateDetails(details: CreateInboundDetailDto[]): NormalizedInboundDetail[];
