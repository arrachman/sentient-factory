import { CreateInboundBatchDto } from './create-inbound-batch.dto';
export declare class CreateInboundDetailDto {
    itemId: string;
    qty: number;
    notes?: string;
    uomInput: number;
    batches: CreateInboundBatchDto[];
}
