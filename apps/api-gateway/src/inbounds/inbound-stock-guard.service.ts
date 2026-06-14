import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

/**
 * Guards inbound deletion against negative-stock scenarios.
 *
 * Extracted from InboundsService so the stock-impact logic lives in isolation
 * and can be tested independently.
 */
@Injectable()
export class InboundStockGuardService {
  /**
   * Throws BadRequestException if deleting `inboundId` would push any
   * (item, warehouse, batch) combination below zero.
   *
   * Must be called inside an active Prisma transaction.
   */
  async ensureDeleteWillNotCauseNegativeStock(
    tx: Prisma.TransactionClient,
    inboundId: number,
  ): Promise<void> {
    const inboundContributions = await tx.inventoryLedger.groupBy({
      by: ['itemId', 'warehouseId', 'batchId'],
      where: {
        referenceDocType: 'INBOUND',
        referenceDocId: String(inboundId),
        deletedAt: null,
      },
      _sum: {
        quantityPcs: true,
      },
    });

    if (!inboundContributions.length) {
      return;
    }

    const keySet = new Set<string>();
    const inboundQtyByKey = new Map<string, number>();
    inboundContributions.forEach((row) => {
      const key = `${row.itemId}::${row.warehouseId}::${row.batchId}`;
      keySet.add(key);
      const qty = Number(row._sum.quantityPcs ?? 0);
      inboundQtyByKey.set(key, Number.isFinite(qty) ? qty : 0);
    });

    const whereOr = [...keySet].map((key) => {
      const [itemId, warehouseId, batchId] = key.split('::').map((v) => Number(v));
      return { itemId, warehouseId, batchId };
    });

    const currentBalances = await tx.inventoryLedger.groupBy({
      by: ['itemId', 'warehouseId', 'batchId'],
      where: {
        deletedAt: null,
        OR: whereOr,
      },
      _sum: {
        quantityPcs: true,
      },
    });

    const currentBalanceByKey = new Map<string, number>();
    currentBalances.forEach((row) => {
      const key = `${row.itemId}::${row.warehouseId}::${row.batchId}`;
      const qty = Number(row._sum.quantityPcs ?? 0);
      currentBalanceByKey.set(key, Number.isFinite(qty) ? qty : 0);
    });

    const violations = [...keySet].filter((key) => {
      const currentBalance = currentBalanceByKey.get(key) ?? 0;
      const inboundQty = inboundQtyByKey.get(key) ?? 0;
      return currentBalance - inboundQty < -0.000001;
    });

    if (!violations.length) {
      return;
    }

    const batchIds = [...new Set(violations.map((key) => Number(key.split('::')[2])))];
    const batchRows = await tx.inventoryBatch.findMany({
      where: { id: { in: batchIds } },
      select: { id: true, batchNumber: true },
    });
    const batchById = new Map(batchRows.map((row) => [row.id, row.batchNumber]));

    const firstViolation = violations[0];
    const [itemId, warehouseId, batchId] = firstViolation.split('::').map((v) => Number(v));
    const batchNumber = batchById.get(batchId) ?? String(batchId);

    throw new BadRequestException(
      `Inbound tidak bisa dihapus karena stok akan minus. Item ${itemId}, batch ${batchNumber}, warehouse ${warehouseId} sudah dipakai outbound.`,
    );
  }
}
