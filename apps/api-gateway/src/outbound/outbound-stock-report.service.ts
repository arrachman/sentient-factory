import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryStockBatchReportDto } from './dto/query-stock-batch-report.dto';
import { QueryStockMutationReportDto } from './dto/query-stock-mutation-report.dto';
import { parseOptionalId } from './outbound-helpers';
import { OutboundStockMutationService } from './outbound-stock-mutation.service';

@Injectable()
export class OutboundStockReportService {
  constructor(
    private prisma: PrismaService,
    private outboundStockMutationService: OutboundStockMutationService,
  ) {}

  async findStockBatchReport(query: QueryStockBatchReportDto) {
    const minimumStockPcs = 0;
    const warehouseFilter = parseOptionalId(query.warehouseId, 'warehouseId');
    const supplierFilter = parseOptionalId(query.supplierId, 'supplierId');
    const itemFilter = parseOptionalId(query.itemId, 'itemId');

    const [warehouseFilterRow, itemFilterRow] = await Promise.all([
      warehouseFilter !== undefined
        ? this.prisma.masterDataWarehouse.findFirst({
            where: { id: warehouseFilter, deletedAt: null },
            select: { id: true },
          })
        : Promise.resolve(null),
      itemFilter !== undefined
        ? this.prisma.masterDataItem.findFirst({
            where: { id: itemFilter, deletedAt: null },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);

    const ledgerRows = await this.prisma.inventoryLedger.findMany({
      where: {
        deletedAt: null,
        warehouseId: warehouseFilterRow?.id,
        itemId: itemFilterRow?.id,
      },
      include: {
        item: {
          select: {
            id: true,
            code: true,
            name: true,
            uom: { select: { id: true, code: true, name: true } },
          },
        },
        warehouse: { select: { id: true, name: true } },
        batch: { select: { id: true, batchNumber: true } },
      },
      orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });

    const pairKeys = new Set<string>();
    const itemIds = new Set<number>();
    const batchNumbers = new Set<string>();
    const warehouseIds = new Set<number>();

    ledgerRows.forEach((row) => {
      const itemId = Number(row.item?.id ?? 0);
      const batchNumber = String(row.batch?.batchNumber ?? '').trim();
      const warehouseId = Number(row.warehouse?.id ?? 0);
      if (!Number.isInteger(itemId) || itemId <= 0 || !batchNumber || !warehouseId) {
        return;
      }
      pairKeys.add(`${itemId}::${batchNumber}::${warehouseId}`);
      itemIds.add(itemId);
      batchNumbers.add(batchNumber);
      warehouseIds.add(warehouseId);
    });

    const suppliersByPair = new Map<string, Array<{ id: number; name: string }>>();

    if (pairKeys.size > 0) {
      const inboundSources = await this.prisma.inboundDetailBatch.findMany({
        where: {
          deletedAt: null,
          batchIn: { in: [...batchNumbers] },
          inboundDetail: {
            deletedAt: null,
            itemId: { in: [...itemIds] },
            inbound: {
              deletedAt: null,
              warehouseId: { in: [...warehouseIds] },
            },
          },
        },
        select: {
          batchIn: true,
          inboundDetail: {
            select: {
              itemId: true,
              inbound: {
                select: {
                  warehouseId: true,
                  supplierId: true,
                  supplier: { select: { name: true } },
                },
              },
            },
          },
        },
      });

      inboundSources.forEach((row) => {
        const itemId = String(row.inboundDetail?.itemId ?? '').trim();
        const batchNumber = String(row.batchIn ?? '').trim();
        const warehouseId = Number(row.inboundDetail?.inbound?.warehouseId ?? 0);
        const supplierId = Number(row.inboundDetail?.inbound?.supplierId ?? 0);
        if (!itemId || !batchNumber || !warehouseId || !supplierId) {
          return;
        }

        const pairKey = `${itemId}::${batchNumber}::${warehouseId}`;
        if (!pairKeys.has(pairKey)) {
          return;
        }

        const current = suppliersByPair.get(pairKey) ?? [];
        if (!current.some((supplier) => supplier.id === supplierId)) {
          current.push({
            id: supplierId,
            name: row.inboundDetail?.inbound?.supplier?.name ?? String(supplierId),
          });
        }
        suppliersByPair.set(pairKey, current);
      });
    }

    const balancesByKey = new Map<string, number>();

    const data = ledgerRows
      .filter((row) => {
        if (supplierFilter === undefined) {
          return true;
        }

        const pairKey = `${row.item?.id ?? ''}::${row.batch?.batchNumber ?? ''}::${row.warehouse?.id ?? ''}`;
        const suppliers = suppliersByPair.get(pairKey) ?? [];
        return suppliers.some((supplier) => supplier.id === supplierFilter);
      })
      .map((row) => {
        const qtyPcs = Number(row.quantityPcs ?? 0);
        const numericQty = Number.isFinite(qtyPcs) ? qtyPcs : 0;
        const inbound = numericQty > 0 ? numericQty : 0;
        const outbound = numericQty < 0 ? Math.abs(numericQty) : 0;

        const balanceKey = `${row.itemId}::${row.batchId}::${row.warehouseId}`;
        const prevBalance = balancesByKey.get(balanceKey) ?? 0;
        const nextBalance = prevBalance + numericQty;
        balancesByKey.set(balanceKey, nextBalance);

        const pairKey = `${row.item?.id ?? ''}::${row.batch?.batchNumber ?? ''}::${row.warehouse?.id ?? ''}`;
        const suppliers = suppliersByPair.get(pairKey) ?? [];

        return {
          id: row.id,
          item: row.item,
          warehouse: row.warehouse,
          batch: row.batch,
          supplierNames: suppliers.map((supplier) => supplier.name),
          transactionDate: row.transactionDate,
          mmfOrDo: row.referenceNumber ?? '',
          description: row.notes ?? row.transactionType ?? '',
          inbound,
          outbound,
          balance: nextBalance,
          replenish: nextBalance <= minimumStockPcs ? 'YES' : '',
        };
      });

    return {
      success: true,
      data,
      meta: {
        total: data.length,
      },
    };
  }

  async findStockMutationReport(query: QueryStockMutationReportDto) {
    return this.outboundStockMutationService.findStockMutationReport(query);
  }
}
