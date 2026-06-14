import { CreateOutboundDetailDto } from './dto/create-outbound-detail.dto';
export type NormalizedOutboundDetail = Omit<CreateOutboundDetailDto, 'itemId' | 'batchNumber'> & {
    itemId: number;
    batchNumber: string;
};
export declare function normalizeRequiredDoNumber(value?: string): string;
export declare function parseId(value: string | number, label: string): number;
export declare function parseOptionalId(value: string | number | null | undefined, label: string): number | undefined;
export declare function parseOptionalActorUserId(actorId?: string | number): number | undefined;
export declare function parseOptionalActorId(actorId?: string | number): number | undefined;
export declare function normalizeAuditActor(actorId?: string | number): number | undefined;
export declare function isMissingWarehouseColumnError(error: unknown): boolean;
export declare function normalizeAndValidateDetails<T extends {
    itemId: string | number;
    batchNumber: string;
    qtyPcs?: number | null;
    qtyKg: number;
    notes?: string | null;
}>(details: T[]): (Omit<T, 'itemId' | 'batchNumber'> & {
    itemId: number;
    batchNumber: string;
})[];
