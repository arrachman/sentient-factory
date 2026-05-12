import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeAuditActor, parseOptionalActorUserId } from './outbound-helpers';

type NormalizedDetail = {
  itemId: number;
  batchNumber: string;
  qtyPcs?: number | null;
  qtyKg: number;
  notes?: string | null;
};

@Injectable()
export class OutboundInventoryService {
  constructor(private prisma: PrismaService) {}

  async syncOutboundInventoryLedger(
    tx: Prisma.TransactionClient,
    deliveryOrderId: number,
    actorId?: string | number,
  ) {
    const auditActor = normalizeAuditActor(actorId);
    const now = new Date();
    await tx.inventoryLedger.updateMany({
      where: {
        referenceDocType: 'OUTBOUND',
        referenceDocId: String(deliveryOrderId),
        deletedAt: null,
      },
      data: {
        deletedAt: now,
        deletedBy: auditActor ?? null,
        updatedBy: auditActor ?? null,
      },
    });

    const outbound = await tx.deliveryOrder.findFirst({
      where: { id: deliveryOrderId },
      select: {
        id: true,
        doNumber: true,
        doDate: true,
        warehouseId: true,
        deletedAt: true,
        details: {
          where: { deletedAt: null },
          orderBy: [{ lineNo: 'asc' }],
          select: {
            itemId: true,
            item: {
              select: {
                id: true,
                uom: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            batches: {
              where: { deletedAt: null },
              orderBy: [{ lineNo: 'asc' }],
              select: {
                batchOut: true,
                qtyPcs: true,
                qtyKg: true,
                expiredDate: true,
                notes: true,
              },
            },
          },
        },
      },
    });

    if (!outbound || outbound.deletedAt) {
      return;
    }

    const actorWarehouseId = await this.resolveWarehouseForActor(tx, actorId);
    const actorUserId = await this.resolveActorUserId(tx, actorId);
    const itemIds = new Set<number>();
    const batchNumbers = new Set<string>();

    outbound.details.forEach((detail) => {
      const itemId = Number(detail.itemId ?? 0);
      if (!itemId) {
        return;
      }
      itemIds.add(itemId);
      detail.batches.forEach((batch) => {
        const batchNumber = String(batch.batchOut ?? '').trim();
        if (batchNumber) {
          batchNumbers.add(batchNumber);
        }
      });
    });

    const sourceByPair = new Map<string, { warehouseId: number; expiryDate: Date | null }>();
    if (itemIds.size > 0 && batchNumbers.size > 0) {
      const inboundSources = await tx.inboundDetailBatch.findMany({
        where: {
          deletedAt: null,
          batchIn: { in: [...batchNumbers] },
          inboundDetail: {
            deletedAt: null,
            itemId: { in: [...itemIds] },
            inbound: {
              deletedAt: null,
              status: 'POSTED',
            },
          },
        },
        select: {
          batchIn: true,
          expiredDate: true,
          inboundDetail: {
            select: {
              itemId: true,
              inbound: {
                select: {
                  warehouse: {
                    select: {
                      id: true,
                    },
                  },
                  transactionDate: true,
                },
              },
            },
          },
        },
        orderBy: [{ inboundDetail: { inbound: { transactionDate: 'asc' } } }, { createdAt: 'asc' }],
      });

      inboundSources.forEach((source) => {
        const itemId = String(source.inboundDetail?.itemId ?? '').trim();
        const batchNumber = String(source.batchIn ?? '').trim();
        const warehouseId = Number(source.inboundDetail?.inbound?.warehouse?.id ?? 0);
        if (!itemId || !batchNumber || !warehouseId) {
          return;
        }

        const key = `${itemId}::${batchNumber.toLowerCase()}`;
        if (!sourceByPair.has(key)) {
          sourceByPair.set(key, {
            warehouseId,
            expiryDate: source.expiredDate ?? null,
          });
        }
      });
    }

    for (const detail of outbound.details) {
      for (const batch of detail.batches) {
        const batchNumber = String(batch.batchOut ?? '').trim();
        if (!batchNumber) {
          continue;
        }

        const pairKey = `${detail.itemId}::${batchNumber.toLowerCase()}`;
        const source = sourceByPair.get(pairKey);
        const warehouseId = outbound.warehouseId || source?.warehouseId || actorWarehouseId;
        if (!warehouseId) {
          throw new BadRequestException(
            `Warehouse source is not found for item ${detail.itemId} batch ${batchNumber}`,
          );
        }

        const inventoryBatch = await tx.inventoryBatch.upsert({
          where: {
            itemId_batchNumber: {
              itemId: detail.item.id,
              batchNumber,
            },
          },
          update: {
            expiryDate: source?.expiryDate ?? batch.expiredDate ?? undefined,
            deletedAt: null,
            deletedBy: null,
            updatedBy: auditActor ?? null,
          },
          create: {
            itemId: detail.item.id,
            batchNumber,
            expiryDate: source?.expiryDate ?? batch.expiredDate ?? null,
            createdBy: auditActor ?? null,
            updatedBy: auditActor ?? null,
          },
          select: { id: true },
        });

        const qtyPcs = Number(batch.qtyPcs ?? 0);
        const qtyKg = Number(batch.qtyKg ?? 0);

        await tx.inventoryLedger.create({
          data: {
            transactionDate: outbound.doDate ?? now,
            itemId: detail.item.id,
            warehouseId,
            batchId: inventoryBatch.id,
            transactionType: 'OUTBOUND',
            referenceDocType: 'OUTBOUND',
            referenceDocId: String(outbound.id),
            referenceNumber: outbound.doNumber,
            quantityPcs: -Math.abs(Number.isFinite(qtyPcs) ? qtyPcs : 0),
            quantityKg: -Math.abs(Number.isFinite(qtyKg) ? qtyKg : 0),
            uomId: detail.item.uom.id,
            unitCost: null,
            totalValue: 0,
            userId: actorUserId ?? null,
            notes: batch.notes ?? null,
            createdBy: auditActor ?? null,
            updatedBy: auditActor ?? null,
          },
        });
      }
    }
  }

  async ensureBatchAvailability(
    details: NormalizedDetail[],
    tx: Prisma.TransactionClient,
    excludeDoId?: number,
    warehouseId?: number,
  ) {
    const requestedByPair = new Map<string, number>();
    const pairLabelByKey = new Map<string, { itemId: number; batchNumber: string }>();
    const itemIds = new Set<number>();
    const batchNumbers = new Set<string>();

    details.forEach((detail) => {
      const itemId = detail.itemId;
      const batchNumber = String(detail.batchNumber ?? '').trim();
      const qty = Number(detail.qtyPcs ?? 0);
      const qtyPcs = Number.isFinite(qty) ? qty : 0;
      const key = `${String(itemId)}::${batchNumber.toLowerCase()}`;

      requestedByPair.set(key, (requestedByPair.get(key) ?? 0) + qtyPcs);
      if (!pairLabelByKey.has(key)) {
        pairLabelByKey.set(key, { itemId, batchNumber });
      }
      itemIds.add(itemId);
      batchNumbers.add(batchNumber);
    });

    if (pairLabelByKey.size === 0) {
      return;
    }

    const normalizedExcludeDoId = excludeDoId;
    const [inboundRows, usedRows] = await Promise.all([
      tx.inboundDetailBatch.findMany({
        where: {
          deletedAt: null,
          batchIn: { in: [...batchNumbers] },
          inboundDetail: {
            deletedAt: null,
            itemId: { in: [...itemIds] },
            inbound: {
              deletedAt: null,
              status: 'POSTED',
              warehouseId,
            },
          },
        },
        select: {
          batchIn: true,
          qty: true,
          inboundDetail: {
            select: {
              itemId: true,
            },
          },
        },
      }),
      tx.outboundDetailBatch.findMany({
        where: {
          deletedAt: null,
          batchOut: { in: [...batchNumbers] },
          outboundDetail: {
            deletedAt: null,
            itemId: { in: [...itemIds] },
            deliveryOrder: {
              deletedAt: null,
              id: normalizedExcludeDoId ? { not: normalizedExcludeDoId } : undefined,
              warehouseId,
            },
          },
        },
        select: {
          batchOut: true,
          qtyPcs: true,
          outboundDetail: {
            select: {
              itemId: true,
            },
          },
        },
      }),
    ]);

    const inboundByPair = new Map<string, number>();
    inboundRows.forEach((row) => {
      const itemId = String(row.inboundDetail?.itemId ?? '').trim();
      const batchNumber = String(row.batchIn ?? '').trim();
      if (!itemId || !batchNumber) {
        return;
      }
      const key = `${itemId}::${batchNumber.toLowerCase()}`;
      const qty = Number(row.qty ?? 0);
      inboundByPair.set(key, (inboundByPair.get(key) ?? 0) + (Number.isFinite(qty) ? qty : 0));
    });

    const usedByPair = new Map<string, number>();
    usedRows.forEach((row) => {
      const itemId = String(row.outboundDetail?.itemId ?? '').trim();
      const batchNumber = String(row.batchOut ?? '').trim();
      if (!itemId || !batchNumber) {
        return;
      }
      const key = `${itemId}::${batchNumber.toLowerCase()}`;
      const qty = Number(row.qtyPcs ?? 0);
      usedByPair.set(key, (usedByPair.get(key) ?? 0) + (Number.isFinite(qty) ? qty : 0));
    });

    requestedByPair.forEach((requestedQty, key) => {
      const pair = pairLabelByKey.get(key);
      if (!pair) {
        return;
      }
      const inboundQty = inboundByPair.get(key) ?? 0;
      const usedQty = usedByPair.get(key) ?? 0;
      const availableQty = Math.max(inboundQty - usedQty, 0);

      if (requestedQty > availableQty) {
        throw new BadRequestException(
          `Insufficient stock for item ${pair.itemId} batch ${pair.batchNumber}. Remaining ${availableQty.toLocaleString(
            'en-US',
          )} pcs, requested ${requestedQty.toLocaleString('en-US')} pcs.`,
        );
      }
    });
  }

  private async resolveWarehouseForActor(tx: Prisma.TransactionClient, actorId?: string | number) {
    const parsedActorId = parseOptionalActorUserId(actorId);
    if (!parsedActorId) {
      return undefined;
    }

    const actor = await tx.user.findFirst({
      where: {
        id: parsedActorId,
        deletedAt: null,
      },
      select: {
        warehouse: {
          select: {
            id: true,
          },
        },
      },
    });

    const mappedWarehouseId = actor?.warehouse?.id;
    if (!mappedWarehouseId || mappedWarehouseId <= 0) {
      return undefined;
    }

    return mappedWarehouseId;
  }

  private async resolveActorUserId(tx: Prisma.TransactionClient, actorId?: string | number) {
    const parsedActorId = parseOptionalActorUserId(actorId);
    if (!parsedActorId) {
      return undefined;
    }

    const actor = await tx.user.findFirst({
      where: {
        id: parsedActorId,
        deletedAt: null,
      },
      select: { id: true },
    });

    return actor?.id;
  }
}
