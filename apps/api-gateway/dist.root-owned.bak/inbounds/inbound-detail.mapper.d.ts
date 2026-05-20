import { Prisma } from '@prisma/client';
import { NormalizedInboundDetail } from './inbound-transaction.utils';
export type InboundItemSnapshot = {
    id: number;
    code: string;
    name: string;
    uomId: number;
};
export declare function buildInboundDetailCreateInput(inboundId: number, lineNo: number, detail: NormalizedInboundDetail, item: InboundItemSnapshot, actorId?: string | number): Prisma.InboundDetailUncheckedCreateInput;
