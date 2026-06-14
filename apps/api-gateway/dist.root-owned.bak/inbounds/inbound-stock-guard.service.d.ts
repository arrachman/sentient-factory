import { Prisma } from '@prisma/client';
export declare class InboundStockGuardService {
    ensureDeleteWillNotCauseNegativeStock(tx: Prisma.TransactionClient, inboundId: number): Promise<void>;
}
