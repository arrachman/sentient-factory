import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { parseIntStrict } from './inbound-transaction.utils';

/**
 * Handles inventory-ledger synchronisation for inbound documents.
 *
 * Strategy: soft-delete every existing ledger entry for the inbound, then
 * re-create from current detail/batch state.  This keeps the ledger
 * idempotent across create / update / delete cycles.
 *
 * Must be called inside an active Prisma transaction.
 */
@Injectable()
export class InboundLedgerSyncService {
  async sync(
    tx: Prisma.TransactionClient,
    inboundId: number,
    actorId?: string | number,
  ): Promise<void> {
    const now = new Date();

    // Soft-delete previous ledger entries for this inbound.
    await tx.inventoryLedger.updateMany({
      where: {
        referenceDocType: 'INBOUND',
        referenceDocId: String(inboundId),
        deletedAt: null,
      },
      data: {
        deletedAt: now,
        deletedBy: toAuditUserId(actorId),
        updatedBy: toAuditUserId(actorId),
      },
    });

    const inbound = await tx.inbound.findFirst({
      where: { id: inboundId },
      select: {
        id: true,
        transactionNo: true,
        transactionDate: true,
        warehouse: { select: { id: true } },
        status: true,
        deletedAt: true,
        details: {
          where: { deletedAt: null },
          orderBy: [{ lineNo: 'asc' }],
          select: {
            itemId: true,
            item: { select: { id: true, uom: { select: { id: true } } } },
            batches: {
              where: { deletedAt: null },
              orderBy: [{ lineNo: 'asc' }],
              select: { batchIn: true, qty: true, expiredDate: true },
            },
          },
        },
      },
    });

    // Only create ledger entries for live, posted inbounds.
    if (!inbound || inbound.deletedAt || inbound.status !== 'POSTED') {
      return;
    }

    const actorUserId = await this.resolveActorUserId(tx, actorId);

    for (const detail of inbound.details) {
      for (const batch of detail.batches) {
        const batchNumber = String(batch.batchIn ?? '').trim();
        if (!batchNumber) continue;

        const inventoryBatch = await tx.inventoryBatch.upsert({
          where: { itemId_batchNumber: { itemId: detail.item.id, batchNumber } },
          update: {
            expiryDate: batch.expiredDate ?? undefined,
            deletedAt: null,
            deletedBy: null,
            updatedBy: toAuditUserId(actorId),
          },
          create: {
            itemId: detail.item.id,
            batchNumber,
            expiryDate: batch.expiredDate ?? null,
            createdBy: toAuditUserId(actorId),
            updatedBy: toAuditUserId(actorId),
          },
          select: { id: true },
        });

        await tx.inventoryLedger.create({
          data: {
            transactionDate: inbound.transactionDate,
            itemId: detail.item.id,
            warehouseId: inbound.warehouse.id,
            batchId: inventoryBatch.id,
            transactionType: 'INBOUND',
            referenceDocType: 'INBOUND',
            referenceDocId: String(inbound.id),
            referenceNumber: inbound.transactionNo,
            quantityPcs: batch.qty,
            quantityKg: 0,
            uomId: detail.item.uom.id,
            unitCost: null,
            totalValue: 0,
            userId: actorUserId ?? null,
            createdBy: toAuditUserId(actorId),
            updatedBy: toAuditUserId(actorId),
          },
        });
      }
    }
  }

  private async resolveActorUserId(
    tx: Prisma.TransactionClient,
    actorId?: string | number,
  ): Promise<number | undefined> {
    if (actorId === undefined || actorId === null || actorId === '') {
      return undefined;
    }
    const normalizedActorId = parseIntStrict(String(actorId), 'User ID');
    const actor = await tx.user.findFirst({
      where: { id: normalizedActorId, deletedAt: null },
      select: { id: true },
    });
    return actor?.id;
  }
}
