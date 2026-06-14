import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
type NormalizedDetail = {
    itemId: number;
    batchNumber: string;
    qtyPcs?: number | null;
    qtyKg: number;
    notes?: string | null;
};
export declare class OutboundInventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    syncOutboundInventoryLedger(tx: Prisma.TransactionClient, deliveryOrderId: number, actorId?: string | number): Promise<void>;
    ensureBatchAvailability(details: NormalizedDetail[], tx: Prisma.TransactionClient, excludeDoId?: number, warehouseId?: number): Promise<void>;
    private resolveWarehouseForActor;
    private resolveActorUserId;
}
export {};
