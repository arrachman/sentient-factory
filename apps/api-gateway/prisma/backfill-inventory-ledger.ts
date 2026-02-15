import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type PairSource = {
  warehouseId: string;
  expiryDate: Date | null;
};

function pairKey(itemId: string, batchNumber: string) {
  return `${itemId}::${batchNumber.trim().toLowerCase()}`;
}

async function main() {
  console.log('[backfill] starting inventory batch + ledger rebuild...');

  await prisma.$transaction(async (tx) => {
    await tx.inventoryLedger.deleteMany({});
    await tx.inventoryBatch.deleteMany({});

    const inboundDocs = await tx.inbound.findMany({
      where: {
        deletedAt: null,
        status: 'POSTED',
      },
      orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }],
      select: {
        uuid: true,
        transactionNo: true,
        transactionDate: true,
        warehouseId: true,
        createdBy: true,
        details: {
          where: { deletedAt: null },
          orderBy: [{ lineNo: 'asc' }],
          select: {
            itemId: true,
            item: { select: { uomId: true } },
            batches: {
              where: { deletedAt: null },
              orderBy: [{ lineNo: 'asc' }],
              select: {
                batchIn: true,
                qty: true,
                expiredDate: true,
              },
            },
          },
        },
      },
    });

    let inboundLedgerCount = 0;
    const sourceByPair = new Map<string, PairSource>();

    for (const inbound of inboundDocs) {
      for (const detail of inbound.details) {
        for (const batch of detail.batches) {
          const batchNumber = String(batch.batchIn ?? '').trim();
          if (!batchNumber) {
            continue;
          }

          const key = pairKey(detail.itemId, batchNumber);
          if (!sourceByPair.has(key)) {
            sourceByPair.set(key, {
              warehouseId: inbound.warehouseId,
              expiryDate: batch.expiredDate ?? null,
            });
          }

          const inventoryBatch = await tx.inventoryBatch.upsert({
            where: {
              itemId_batchNumber: {
                itemId: detail.itemId,
                batchNumber,
              },
            },
            update: {
              expiryDate: batch.expiredDate ?? undefined,
              isActive: true,
              deletedAt: null,
              deletedBy: null,
            },
            create: {
              itemId: detail.itemId,
              batchNumber,
              expiryDate: batch.expiredDate ?? null,
              isActive: true,
              createdBy: inbound.createdBy ?? null,
              updatedBy: inbound.createdBy ?? null,
            },
            select: { uuid: true },
          });

          await tx.inventoryLedger.create({
            data: {
              transactionDate: inbound.transactionDate,
              itemId: detail.itemId,
              warehouseId: inbound.warehouseId,
              batchId: inventoryBatch.uuid,
              transactionType: 'INBOUND',
              referenceDocType: 'INBOUND',
              referenceDocId: inbound.uuid,
              referenceNumber: inbound.transactionNo,
              quantityPcs: batch.qty,
              quantityKg: 0,
              uomId: detail.item.uomId,
              unitCost: null,
              totalValue: 0,
              userId: inbound.createdBy ?? null,
              createdBy: inbound.createdBy ?? null,
              updatedBy: inbound.createdBy ?? null,
            },
          });
          inboundLedgerCount += 1;
        }
      }
    }

    const outboundDocs = await tx.deliveryOrder.findMany({
      where: { deletedAt: null },
      orderBy: [{ doDate: 'asc' }, { createdAt: 'asc' }],
      select: {
        uuid: true,
        doNumber: true,
        doDate: true,
        createdBy: true,
        details: {
          where: { deletedAt: null },
          orderBy: [{ lineNo: 'asc' }],
          select: {
            itemId: true,
            item: { select: { uomId: true } },
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

    let outboundLedgerCount = 0;
    for (const outbound of outboundDocs) {
      for (const detail of outbound.details) {
        for (const batch of detail.batches) {
          const batchNumber = String(batch.batchOut ?? '').trim();
          if (!batchNumber) {
            continue;
          }

          const key = pairKey(detail.itemId, batchNumber);
          const source = sourceByPair.get(key);
          if (!source?.warehouseId) {
            throw new Error(
              `Cannot resolve source warehouse for item=${detail.itemId}, batch=${batchNumber}, do=${outbound.doNumber}`,
            );
          }

          const inventoryBatch = await tx.inventoryBatch.upsert({
            where: {
              itemId_batchNumber: {
                itemId: detail.itemId,
                batchNumber,
              },
            },
            update: {
              expiryDate: source.expiryDate ?? batch.expiredDate ?? undefined,
              isActive: true,
              deletedAt: null,
              deletedBy: null,
            },
            create: {
              itemId: detail.itemId,
              batchNumber,
              expiryDate: source.expiryDate ?? batch.expiredDate ?? null,
              isActive: true,
              createdBy: outbound.createdBy ?? null,
              updatedBy: outbound.createdBy ?? null,
            },
            select: { uuid: true },
          });

          const qtyPcs = Number(batch.qtyPcs ?? 0);
          const qtyKg = Number(batch.qtyKg ?? 0);

          await tx.inventoryLedger.create({
            data: {
              transactionDate: outbound.doDate ?? new Date(),
              itemId: detail.itemId,
              warehouseId: source.warehouseId,
              batchId: inventoryBatch.uuid,
              transactionType: 'OUTBOUND',
              referenceDocType: 'OUTBOUND',
              referenceDocId: outbound.uuid,
              referenceNumber: outbound.doNumber,
              quantityPcs: -Math.abs(Number.isFinite(qtyPcs) ? qtyPcs : 0),
              quantityKg: -Math.abs(Number.isFinite(qtyKg) ? qtyKg : 0),
              uomId: detail.item.uomId,
              unitCost: null,
              totalValue: 0,
              userId: outbound.createdBy ?? null,
              notes: batch.notes ?? null,
              createdBy: outbound.createdBy ?? null,
              updatedBy: outbound.createdBy ?? null,
            },
          });
          outboundLedgerCount += 1;
        }
      }
    }

    console.log(
      `[backfill] done. inbound ledger=${inboundLedgerCount}, outbound ledger=${outboundLedgerCount}`,
    );
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('[backfill] failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
