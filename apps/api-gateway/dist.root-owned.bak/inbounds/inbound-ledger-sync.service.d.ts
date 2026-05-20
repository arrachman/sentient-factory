import { Prisma } from '@prisma/client';
export declare class InboundLedgerSyncService {
    sync(tx: Prisma.TransactionClient, inboundId: number, actorId?: string | number): Promise<void>;
    private resolveActorUserId;
}
