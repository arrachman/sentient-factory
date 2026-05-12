import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryMonitoringOutboundDto } from './dto/query-monitoring-outbound.dto';
import { parseId, parseOptionalId, parseOptionalActorId } from './outbound-helpers';

@Injectable()
export class OutboundBatchService {
  constructor(private prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Warehouse-access resolution (duplicated from OutboundService to avoid
  // circular dependency; keep in sync if the main logic ever changes)
  // ---------------------------------------------------------------------------

  private async getActorWarehouseAccess(actorId?: string | number) {
    const actorUserId = parseOptionalActorId(actorId);
    if (!actorUserId) {
      throw new BadRequestException('User login tidak ditemukan');
    }

    const actor = await this.prisma.user.findFirst({
      where: {
        id: actorUserId,
        deletedAt: null,
      },
      select: {
        warehouseId: true,
        roles: {
          where: {
            deletedAt: null,
            role: { deletedAt: null },
          },
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!actor) {
      throw new BadRequestException('User login tidak ditemukan');
    }

    const roleNames = (actor.roles ?? [])
      .map((row) =>
        String(row.role?.name ?? '')
          .trim()
          .toLowerCase(),
      )
      .filter(Boolean);

    const canAccessAllWarehouses = roleNames.some(
      (roleName) => roleName === 'admin' || roleName === 'super_admin',
    );

    return {
      warehouseId: actor.warehouseId,
      canAccessAllWarehouses,
    };
  }

  private async resolveWarehouseFilterForActor(
    actorId?: string | number,
    requestedWarehouseId?: string,
  ): Promise<number | undefined> {
    const actor = await this.getActorWarehouseAccess(actorId);
    if (actor.canAccessAllWarehouses) {
      if (requestedWarehouseId?.trim()) {
        return parseId(requestedWarehouseId, 'warehouseId');
      }
      return undefined;
    }

    if (typeof actor.warehouseId === 'number' && actor.warehouseId > 0) {
      return actor.warehouseId;
    }

    throw new BadRequestException('Warehouse untuk user login belum terdaftar');
  }

  // ---------------------------------------------------------------------------
  // Public methods
  // ---------------------------------------------------------------------------

  async getBatchOptions(
    itemId?: string,
    excludeDoId?: string,
    warehouseId?: string,
    actorId?: string | number,
  ) {
    if (!String(itemId ?? '').trim()) {
      throw new BadRequestException('itemId is required');
    }
    const normalizedItemId = parseId(itemId as string, 'itemId');

    const normalizedExcludeDoId = parseOptionalId(excludeDoId, 'excludeDoId');
    const normalizedWarehouseId = await this.resolveWarehouseFilterForActor(actorId, warehouseId);
    const [inboundRows, usedRows] = await this.prisma.$transaction([
      this.prisma.inboundDetailBatch.groupBy({
        by: ['batchIn'],
        where: {
          deletedAt: null,
          inboundDetail: {
            deletedAt: null,
            itemId: normalizedItemId,
            inbound: {
              deletedAt: null,
              status: 'POSTED',
              warehouseId: normalizedWarehouseId,
            },
          },
        },
        _sum: {
          qty: true,
        },
        orderBy: {
          batchIn: 'asc',
        },
      }),
      this.prisma.outboundDetailBatch.groupBy({
        by: ['batchOut'],
        where: {
          deletedAt: null,
          outboundDetail: {
            deletedAt: null,
            itemId: normalizedItemId,
            deliveryOrder: {
              deletedAt: null,
              id: normalizedExcludeDoId ? { not: normalizedExcludeDoId } : undefined,
              warehouseId: normalizedWarehouseId,
            },
          },
        },
        _sum: {
          qtyPcs: true,
        },
        orderBy: {
          batchOut: 'asc',
        },
      }),
    ]);

    const usedByBatch = new Map<string, number>();
    usedRows.forEach((row) => {
      const key = String(row.batchOut ?? '')
        .trim()
        .toLowerCase();
      if (!key) {
        return;
      }
      const qty = Number(row._sum?.qtyPcs ?? 0);
      usedByBatch.set(key, (usedByBatch.get(key) ?? 0) + (Number.isFinite(qty) ? qty : 0));
    });

    return {
      success: true,
      data: inboundRows
        .map((row) => {
          const inboundQty = Number(row._sum?.qty ?? 0);
          const usedQty =
            usedByBatch.get(
              String(row.batchIn ?? '')
                .trim()
                .toLowerCase(),
            ) ?? 0;
          const remainingQty = Math.max(inboundQty - usedQty, 0);
          return {
            batchNumber: row.batchIn,
            qtyPcs: remainingQty,
          };
        })
        .filter((row) => row.qtyPcs > 0),
    };
  }

  async findMonitoringReport(query: QueryMonitoringOutboundDto, actorId?: string | number) {
    const where: Prisma.DeliveryOrderWhereInput = { deletedAt: null };

    if (query.cityId?.trim()) {
      where.destinationCityId = parseId(query.cityId, 'cityId');
    }

    if (query.provinceId?.trim()) {
      where.destinationCity = {
        provinceId: parseId(query.provinceId, 'provinceId'),
      };
    }

    if (query.status?.trim()) {
      where.status = query.status.trim().toUpperCase();
    }

    if (query.doReceivedDateFrom || query.doReceivedDateTo) {
      where.doReceivedDate = {
        gte: query.doReceivedDateFrom ? new Date(query.doReceivedDateFrom) : undefined,
        lte: query.doReceivedDateTo ? new Date(query.doReceivedDateTo) : undefined,
      };
    }

    const items = await this.prisma.deliveryOrder.findMany({
      where,
      include: {
        customer: { select: { id: true, code: true, name: true, type: true } },
        warehouse: {
          select: {
            id: true,
            name: true,
            locationName: true,
            city: { select: { id: true, name: true, postalCode: true } },
          },
        },
        destinationCity: {
          select: {
            id: true,
            name: true,
            postalCode: true,
            province: { select: { id: true, name: true, isoCode: true } },
          },
        },
        details: {
          where: { deletedAt: null },
          select: {
            itemId: true,
            qtyPcs: true,
            qtyKg: true,
            batches: {
              where: { deletedAt: null },
              select: { batchOut: true },
            },
          },
        },
      },
      orderBy: [{ doReceivedDate: 'desc' }, { createdAt: 'desc' }],
    });

    const pairKeys = new Set<string>();
    const batchNumbers = new Set<string>();
    const itemIds = new Set<number>();
    items.forEach((row) => {
      row.details.forEach((detail) => {
        const itemId = Number(detail.itemId ?? 0);
        detail.batches.forEach((batch) => {
          const batchNumber = String(batch.batchOut ?? '').trim();
          if (!Number.isInteger(itemId) || itemId <= 0 || !batchNumber) {
            return;
          }
          pairKeys.add(`${itemId}::${batchNumber}`);
          itemIds.add(itemId);
          batchNumbers.add(batchNumber);
        });
      });
    });

    const sourceByPair = new Map<
      string,
      Array<{
        supplierId: number | null;
        supplierName: string | null;
        warehouseId: number | null;
        warehouseName: string | null;
      }>
    >();

    if (pairKeys.size > 0) {
      const sourceRows = await this.prisma.inboundDetailBatch.findMany({
        where: {
          deletedAt: null,
          batchIn: { in: [...batchNumbers] },
          inboundDetail: {
            deletedAt: null,
            itemId: { in: [...itemIds] },
            inbound: { deletedAt: null },
          },
        },
        select: {
          batchIn: true,
          inboundDetail: {
            select: {
              itemId: true,
              inbound: {
                select: {
                  supplierId: true,
                  warehouseId: true,
                  supplier: { select: { name: true } },
                  warehouse: { select: { name: true } },
                },
              },
            },
          },
        },
      });

      sourceRows.forEach((row) => {
        const itemId = String(row.inboundDetail?.itemId ?? '').trim();
        const batchNumber = String(row.batchIn ?? '').trim();
        const pairKey = `${itemId}::${batchNumber}`;

        if (!pairKeys.has(pairKey)) {
          return;
        }

        const next = sourceByPair.get(pairKey) ?? [];
        next.push({
          supplierId: row.inboundDetail?.inbound?.supplierId ?? null,
          supplierName: row.inboundDetail?.inbound?.supplier?.name ?? null,
          warehouseId: row.inboundDetail?.inbound?.warehouseId ?? null,
          warehouseName: row.inboundDetail?.inbound?.warehouse?.name ?? null,
        });
        sourceByPair.set(pairKey, next);
      });
    }

    const supplierFilter = parseOptionalId(query.supplierId, 'supplierId');
    const warehouseFilter = await this.resolveWarehouseFilterForActor(actorId, query.warehouseId);

    const enriched = items
      .map((row) => {
        const supplierSet = new Map<number, string>();
        const warehouseSet = new Map<number, string>();
        const totalItemTypes = row.details.length;
        const totalQtyPcs = row.details.reduce((sum, detail) => {
          const qty = Number(detail.qtyPcs ?? 0);
          return sum + (Number.isFinite(qty) ? qty : 0);
        }, 0);
        const totalKg = row.details.reduce((sum, detail) => {
          const qty = Number(detail.qtyKg ?? 0);
          return sum + (Number.isFinite(qty) ? qty : 0);
        }, 0);

        row.details.forEach((detail) => {
          detail.batches.forEach((batch) => {
            const pairKey = `${detail.itemId}::${batch.batchOut}`;
            const sources = sourceByPair.get(pairKey) ?? [];
            sources.forEach((source) => {
              if (source.supplierId) {
                supplierSet.set(
                  source.supplierId,
                  source.supplierName || String(source.supplierId),
                );
              }
              if (source.warehouseId) {
                warehouseSet.set(
                  source.warehouseId,
                  source.warehouseName || String(source.warehouseId),
                );
              }
            });
          });
        });

        return {
          ...row,
          totalItemTypes,
          totalQtyPcs,
          totalKg,
          sourceSuppliers: [...supplierSet.entries()].map(([id, name]) => ({ id, name })),
          sourceWarehouses: [...warehouseSet.entries()].map(([id, name]) => ({ id, name })),
        };
      })
      .filter((row) => {
        if (supplierFilter !== undefined) {
          const hasSupplier = row.sourceSuppliers.some(
            (supplier) => supplier.id === supplierFilter,
          );
          if (!hasSupplier) {
            return false;
          }
        }

        if (warehouseFilter !== undefined) {
          const hasWarehouse = row.sourceWarehouses.some(
            (warehouse) => warehouse.id === warehouseFilter,
          );
          if (!hasWarehouse) {
            return false;
          }
        }

        return true;
      });

    return {
      success: true,
      data: enriched,
      meta: {
        total: enriched.length,
      },
    };
  }
}
