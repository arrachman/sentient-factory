import { Prisma } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { NormalizedInboundDetail } from './inbound-transaction.utils';

/** Item info fetched from DB for snapshot fields. */
export type InboundItemSnapshot = {
  id: number;
  code: string;
  name: string;
  uomId: number;
};

/**
 * Builds the Prisma `create` data payload for a single InboundDetail row
 * (including nested batch creates).
 *
 * Uses the unchecked variant so scalar FK fields (`inboundId`, `itemId`) can
 * be passed directly — consistent with how the original code called
 * `tx.inboundDetail.create`.
 *
 * Pure function — no I/O.
 */
export function buildInboundDetailCreateInput(
  inboundId: number,
  lineNo: number,
  detail: NormalizedInboundDetail,
  item: InboundItemSnapshot,
  actorId?: string | number,
): Prisma.InboundDetailUncheckedCreateInput {
  return {
    inboundId,
    lineNo,
    itemId: detail.itemId,
    qty: detail.qty,
    uomInput: detail.uomInput ?? null,
    itemCodeSnapshot: item.code,
    itemNameSnapshot: item.name,
    notes: detail.notes ?? null,
    createdBy: toAuditUserId(actorId),
    updatedBy: toAuditUserId(actorId),
    batches: {
      create: detail.batches.map((batch, batchIndex) => ({
        lineNo: batchIndex + 1,
        batchIn: batch.batchIn,
        qty: batch.qty,
        expiredDate: batch.expiredDate ? new Date(batch.expiredDate) : null,
        notes: batch.notes ?? null,
        createdBy: toAuditUserId(actorId),
        updatedBy: toAuditUserId(actorId),
      })),
    },
  };
}
