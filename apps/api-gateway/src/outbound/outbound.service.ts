import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOutboundDetailDto } from './dto/create-outbound-detail.dto';
import { CreateOutboundDto } from './dto/create-outbound.dto';
import { QueryMonitoringOutboundDto } from './dto/query-monitoring-outbound.dto';
import { QueryOutboundDto } from './dto/query-outbound.dto';
import { QueryStockBatchReportDto } from './dto/query-stock-batch-report.dto';
import { QueryStockMutationReportDto } from './dto/query-stock-mutation-report.dto';
import { UpdateOutboundDto } from './dto/update-outbound.dto';

@Injectable()
export class OutboundService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOutboundDto, actorId?: string) {
    const doNumber = this.normalizeRequiredDoNumber(dto.doNumber);
    await this.ensureDoNumberAvailable(doNumber);

    const customer = await this.ensureCustomerExists(dto.customerId);
    const defaults = await this.resolveDefaultsFromCustomerCity(customer.city ?? undefined);

    const resolvedDestinationCityId =
      dto.destinationCityId?.trim() || defaults.destinationCityId || null;
    if (resolvedDestinationCityId) {
      await this.ensureCityExists(resolvedDestinationCityId);
    }

    const resolvedSla = resolvedDestinationCityId
      ? await this.findCitySlaByCityId(resolvedDestinationCityId)
      : null;
    const resolvedStdLeadTimeDays = dto.stdLeadTimeDays ?? resolvedSla?.stdLeadTimeDays ?? 0;
    const resolvedStdReturnDoDays = dto.stdReturnDoDays ?? resolvedSla?.stdReturnDoDays ?? 0;

    const detailPayload = this.normalizeAndValidateDetails(dto.details);
    const itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));

    let created;
    try {
      created = await this.prisma.$transaction(async (tx) => {
        await this.ensureBatchAvailability(detailPayload, tx, undefined);

        const header = await tx.deliveryOrder.create({
          data: {
            doNumber,
            doDate: new Date(dto.doDate),
            doReceivedDate: new Date(dto.doReceivedDate),
            customerId: dto.customerId,
            destinationCityId: resolvedDestinationCityId,
            stdLeadTimeDays: resolvedStdLeadTimeDays,
            stdReturnDoDays: resolvedStdReturnDoDays,
            shippingDate: dto.shippingDate ? new Date(dto.shippingDate) : null,
            actualReceivedDate: dto.actualReceivedDate ? new Date(dto.actualReceivedDate) : null,
            receivedBy: dto.receivedBy ?? null,
            doScanReturnDate: dto.doScanReturnDate ? new Date(dto.doScanReturnDate) : null,
            bu: dto.bu ?? null,
            notes: dto.notes ?? null,
            status: dto.status ?? 'OPEN',
            createdBy: actorId ?? null,
            updatedBy: actorId ?? null,
          },
        });

        for (let index = 0; index < detailPayload.length; index += 1) {
          const detail = detailPayload[index];
          const item = itemMap.get(detail.itemId)!;

          const createdDetail = await tx.deliveryOrderDetail.create({
            data: {
              doId: header.uuid,
              lineNo: index + 1,
              itemId: detail.itemId,
              qtyPcs: detail.qtyPcs ?? 0,
              qtyKg: detail.qtyKg,
              itemCodeSnapshot: item.code,
              itemNameSnapshot: item.name,
              uomCodeSnapshot: item.uom.code,
              notes: detail.notes ?? null,
              createdBy: actorId ?? null,
              updatedBy: actorId ?? null,
            },
            select: { uuid: true },
          });

          await tx.outboundDetailBatch.create({
            data: {
              outboundDetailId: createdDetail.uuid,
              lineNo: 1,
              batchOut: detail.batchNumber,
              qtyPcs: detail.qtyPcs ?? 0,
              qtyKg: detail.qtyKg,
              notes: detail.notes ?? null,
              createdBy: actorId ?? null,
              updatedBy: actorId ?? null,
            },
          });
        }

        await this.syncOutboundInventoryLedger(tx, header.uuid, actorId);

        return header;
      });
    } catch (error) {
      if (
        isUniqueViolation(error, [
          'do_number',
          'doNumber',
          'm2_outbound_do_number_key',
          'ux_m2_outbound_number_active',
        ])
      ) {
        throwDuplicate({ fieldLabel: 'DO number', value: doNumber });
      }
      throw error;
    }

    return this.findOne(created.uuid);
  }

  async findAll(query: QueryOutboundDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DeliveryOrderWhereInput = { deletedAt: null };

    if (query.status) {
      where.status = query.status;
    }

    if (query.customerId?.trim()) {
      where.customerId = query.customerId.trim();
    }

    if (query.doDateFrom || query.doDateTo) {
      where.doDate = {
        gte: query.doDateFrom ? new Date(query.doDateFrom) : undefined,
        lte: query.doDateTo ? new Date(query.doDateTo) : undefined,
      };
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { doNumber: { contains: q, mode: 'insensitive' } },
        { bu: { contains: q, mode: 'insensitive' } },
        { customer: { code: { contains: q, mode: 'insensitive' } } },
        { customer: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.deliveryOrder.findMany({
        where,
        include: {
          customer: { select: { uuid: true, code: true, name: true, type: true } },
          destinationCity: { select: { uuid: true, name: true, postalCode: true } },
          _count: { select: { details: { where: { deletedAt: null } } } },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.deliveryOrder.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getBatchOptions(itemId?: string, excludeDoId?: string) {
    const normalizedItemId = String(itemId ?? '').trim();
    if (!normalizedItemId) {
      throw new BadRequestException('itemId is required');
    }

    const normalizedExcludeDoId = String(excludeDoId ?? '').trim() || undefined;
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
              uuid: normalizedExcludeDoId ? { not: normalizedExcludeDoId } : undefined,
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

  async findMonitoringReport(query: QueryMonitoringOutboundDto) {
    const where: Prisma.DeliveryOrderWhereInput = { deletedAt: null };

    if (query.cityId?.trim()) {
      where.destinationCityId = query.cityId.trim();
    }

    if (query.provinceId?.trim()) {
      where.destinationCity = {
        provinceId: query.provinceId.trim(),
      };
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
        customer: { select: { uuid: true, code: true, name: true, type: true } },
        destinationCity: {
          select: {
            uuid: true,
            name: true,
            postalCode: true,
            province: { select: { uuid: true, name: true, isoCode: true } },
          },
        },
        details: {
          where: { deletedAt: null },
          select: {
            itemId: true,
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
    const itemIds = new Set<string>();
    items.forEach((row) => {
      row.details.forEach((detail) => {
        const itemId = String(detail.itemId ?? '').trim();
        detail.batches.forEach((batch) => {
          const batchNumber = String(batch.batchOut ?? '').trim();
          if (!itemId || !batchNumber) {
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
        supplierId: string | null;
        supplierName: string | null;
        warehouseId: string | null;
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

    const supplierFilter = query.supplierId?.trim() || '';
    const warehouseFilter = query.warehouseId?.trim() || '';

    const enriched = items
      .map((row) => {
        const supplierSet = new Map<string, string>();
        const warehouseSet = new Map<string, string>();

        row.details.forEach((detail) => {
          detail.batches.forEach((batch) => {
            const pairKey = `${detail.itemId}::${batch.batchOut}`;
            const sources = sourceByPair.get(pairKey) ?? [];
            sources.forEach((source) => {
              if (source.supplierId) {
                supplierSet.set(source.supplierId, source.supplierName || source.supplierId);
              }
              if (source.warehouseId) {
                warehouseSet.set(source.warehouseId, source.warehouseName || source.warehouseId);
              }
            });
          });
        });

        return {
          ...row,
          sourceSuppliers: [...supplierSet.entries()].map(([id, name]) => ({ id, name })),
          sourceWarehouses: [...warehouseSet.entries()].map(([id, name]) => ({ id, name })),
        };
      })
      .filter((row) => {
        if (supplierFilter) {
          const hasSupplier = row.sourceSuppliers.some(
            (supplier) => supplier.id === supplierFilter,
          );
          if (!hasSupplier) {
            return false;
          }
        }

        if (warehouseFilter) {
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

  async findStockBatchReport(query: QueryStockBatchReportDto) {
    const minimumStockPcs = 0;
    const warehouseFilter = String(query.warehouseId ?? '').trim();
    const supplierFilter = String(query.supplierId ?? '').trim();
    const itemFilter = String(query.itemId ?? '').trim();

    const ledgerRows = await this.prisma.inventoryLedger.findMany({
      where: {
        deletedAt: null,
        warehouseId: warehouseFilter || undefined,
        itemId: itemFilter || undefined,
      },
      include: {
        item: {
          select: {
            uuid: true,
            code: true,
            name: true,
            uom: { select: { uuid: true, code: true, name: true } },
          },
        },
        warehouse: { select: { uuid: true, name: true } },
        batch: { select: { uuid: true, batchNumber: true } },
      },
      orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });

    const pairKeys = new Set<string>();
    const itemIds = new Set<string>();
    const batchNumbers = new Set<string>();
    const warehouseIds = new Set<string>();

    ledgerRows.forEach((row) => {
      const itemId = String(row.itemId ?? '').trim();
      const batchNumber = String(row.batch?.batchNumber ?? '').trim();
      const warehouseId = String(row.warehouseId ?? '').trim();
      if (!itemId || !batchNumber || !warehouseId) {
        return;
      }
      pairKeys.add(`${itemId}::${batchNumber}::${warehouseId}`);
      itemIds.add(itemId);
      batchNumbers.add(batchNumber);
      warehouseIds.add(warehouseId);
    });

    const suppliersByPair = new Map<string, Array<{ id: string; name: string }>>();

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
        const warehouseId = String(row.inboundDetail?.inbound?.warehouseId ?? '').trim();
        const supplierId = String(row.inboundDetail?.inbound?.supplierId ?? '').trim();
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
            name: row.inboundDetail?.inbound?.supplier?.name ?? supplierId,
          });
        }
        suppliersByPair.set(pairKey, current);
      });
    }

    const balancesByKey = new Map<string, number>();

    const data = ledgerRows
      .filter((row) => {
        if (!supplierFilter) {
          return true;
        }

        const pairKey = `${row.itemId}::${row.batch?.batchNumber ?? ''}::${row.warehouseId}`;
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

        const pairKey = `${row.itemId}::${row.batch?.batchNumber ?? ''}::${row.warehouseId}`;
        const suppliers = suppliersByPair.get(pairKey) ?? [];

        return {
          uuid: row.uuid,
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
    const warehouseFilter = String(query.warehouseId ?? '').trim();
    const supplierFilter = String(query.supplierId ?? '').trim();
    const itemFilter = String(query.itemId ?? '').trim();

    const ledgerRows = await this.prisma.inventoryLedger.findMany({
      where: {
        deletedAt: null,
        warehouseId: warehouseFilter || undefined,
        itemId: itemFilter || undefined,
      },
      include: {
        item: {
          select: {
            uuid: true,
            code: true,
            name: true,
          },
        },
        warehouse: {
          select: {
            uuid: true,
            name: true,
          },
        },
        batch: {
          select: {
            uuid: true,
            batchNumber: true,
            expiryDate: true,
          },
        },
      },
      orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });

    const batchBalanceMap = new Map<
      string,
      {
        itemId: string;
        itemCode: string;
        itemName: string;
        warehouseId: string;
        warehouseName: string;
        batchNumber: string;
        expiryDate: Date | null;
        total: number;
      }
    >();

    ledgerRows.forEach((row) => {
      const itemId = String(row.itemId ?? '').trim();
      const warehouseId = String(row.warehouseId ?? '').trim();
      const batchId = String(row.batchId ?? '').trim();
      if (!itemId || !warehouseId || !batchId) {
        return;
      }

      const key = `${itemId}::${warehouseId}::${batchId}`;
      const current = batchBalanceMap.get(key) ?? {
        itemId,
        itemCode: row.item?.code ?? '',
        itemName: row.item?.name ?? '',
        warehouseId,
        warehouseName: row.warehouse?.name ?? '',
        batchNumber: row.batch?.batchNumber ?? '',
        expiryDate: row.batch?.expiryDate ?? null,
        total: 0,
      };

      const qty = Number(row.quantityPcs ?? 0);
      current.total += Number.isFinite(qty) ? qty : 0;
      if (!current.expiryDate && row.batch?.expiryDate) {
        current.expiryDate = row.batch.expiryDate;
      }

      batchBalanceMap.set(key, current);
    });

    const balances = [...batchBalanceMap.values()].filter((row) => Math.abs(row.total) > 0.000001);
    const pairKeys = new Set<string>();
    const itemIds = new Set<string>();
    const batchNumbers = new Set<string>();
    const warehouseIds = new Set<string>();

    balances.forEach((row) => {
      if (!row.itemId || !row.batchNumber || !row.warehouseId) {
        return;
      }
      pairKeys.add(`${row.itemId}::${row.batchNumber}::${row.warehouseId}`);
      itemIds.add(row.itemId);
      batchNumbers.add(row.batchNumber);
      warehouseIds.add(row.warehouseId);
    });

    const suppliersByPair = new Map<string, Array<{ id: string; name: string }>>();

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
        const warehouseId = String(row.inboundDetail?.inbound?.warehouseId ?? '').trim();
        const supplierId = String(row.inboundDetail?.inbound?.supplierId ?? '').trim();
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
            name: row.inboundDetail?.inbound?.supplier?.name ?? supplierId,
          });
        }
        suppliersByPair.set(pairKey, current);
      });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const plusThreeMonths = new Date(startOfToday);
    plusThreeMonths.setMonth(plusThreeMonths.getMonth() + 3);
    const plusSixMonths = new Date(startOfToday);
    plusSixMonths.setMonth(plusSixMonths.getMonth() + 6);

    const data = balances
      .filter((row) => {
        if (!supplierFilter) {
          return true;
        }
        const pairKey = `${row.itemId}::${row.batchNumber}::${row.warehouseId}`;
        const suppliers = suppliersByPair.get(pairKey) ?? [];
        return suppliers.some((supplier) => supplier.id === supplierFilter);
      })
      .map((row) => {
        const exp = row.expiryDate ? new Date(row.expiryDate) : null;
        const expDateOnly = exp ? new Date(exp.getFullYear(), exp.getMonth(), exp.getDate()) : null;
        const isExpiredOrToday = expDateOnly
          ? expDateOnly.getTime() <= startOfToday.getTime()
          : false;
        const isInThreeMonths = expDateOnly
          ? expDateOnly.getTime() > startOfToday.getTime() &&
            expDateOnly.getTime() <= plusThreeMonths.getTime()
          : false;
        const isInSixMonths = expDateOnly
          ? expDateOnly.getTime() > plusThreeMonths.getTime() &&
            expDateOnly.getTime() <= plusSixMonths.getTime()
          : false;

        let expireLabel = '-';
        let remarks = '';
        if (expDateOnly) {
          const diffMs = expDateOnly.getTime() - startOfToday.getTime();
          const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
          if (diffDays < 0) {
            expireLabel = `EXPIRED ${Math.abs(diffDays)} DAY`;
            remarks = 'Expired';
          } else if (diffDays === 0) {
            expireLabel = 'EXPIRED TODAY';
            remarks = 'Expired Today';
          } else {
            expireLabel = `${diffDays} DAY`;
            if (diffDays <= 90) {
              remarks = 'Near Expire <= 3 Mth';
            } else if (diffDays <= 180) {
              remarks = 'Near Expire <= 6 Mth';
            }
          }
        }

        return {
          itemId: row.itemId,
          warehouseId: row.warehouseId,
          supplierNames:
            suppliersByPair
              .get(`${row.itemId}::${row.batchNumber}::${row.warehouseId}`)
              ?.map((supplier) => supplier.name) ?? [],
          description: `${row.itemCode} ${row.itemName}`.trim(),
          batchNumber: row.batchNumber,
          expiryDate: row.expiryDate,
          total: row.total,
          actualToday: isExpiredOrToday ? row.total : 0,
          actualThreeMonths: isInThreeMonths ? row.total : 0,
          actualSixMonths: isInSixMonths ? row.total : 0,
          expire: expireLabel,
          remarks,
        };
      })
      .sort((a, b) => {
        if (a.description !== b.description) {
          return a.description.localeCompare(b.description);
        }
        return a.batchNumber.localeCompare(b.batchNumber);
      });

    return {
      success: true,
      data,
      meta: {
        total: data.length,
      },
    };
  }

  async findOne(uuid: string) {
    const item = await this.prisma.deliveryOrder.findFirst({
      where: { uuid, deletedAt: null },
      include: {
        customer: { select: { uuid: true, code: true, name: true, type: true } },
        destinationCity: {
          select: {
            uuid: true,
            name: true,
            postalCode: true,
            province: { select: { uuid: true, name: true, isoCode: true } },
          },
        },
        details: {
          where: { deletedAt: null },
          orderBy: [{ lineNo: 'asc' }],
          include: {
            batches: {
              where: { deletedAt: null },
              orderBy: [{ lineNo: 'asc' }],
            },
            item: {
              select: {
                uuid: true,
                code: true,
                name: true,
                category: true,
                itemType: true,
                uom: { select: { uuid: true, code: true, name: true, type: true } },
              },
            },
          },
        },
      },
    });
    if (!item) {
      throw new NotFoundException('outbound not found');
    }

    return { success: true, data: item };
  }

  async update(uuid: string, dto: UpdateOutboundDto, actorId?: string) {
    const existing = await this.prisma.deliveryOrder.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true, doNumber: true },
    });
    if (!existing) {
      throw new NotFoundException('outbound not found');
    }

    if (typeof dto.doNumber !== 'undefined') {
      const normalizedDoNumber = this.normalizeRequiredDoNumber(dto.doNumber);
      dto.doNumber = normalizedDoNumber;
      if (normalizedDoNumber !== existing.doNumber) {
        await this.ensureDoNumberAvailable(normalizedDoNumber, uuid);
      }
    }

    if (dto.customerId) {
      await this.ensureCustomerExists(dto.customerId);
    }

    if (typeof dto.destinationCityId !== 'undefined') {
      const destinationCityId = dto.destinationCityId?.trim();
      if (destinationCityId) {
        await this.ensureCityExists(destinationCityId);
      }
      dto.destinationCityId = destinationCityId;
    }

    const detailsProvided = Array.isArray(dto.details);
    let detailPayload: CreateOutboundDetailDto[] = [];
    let itemMap: Map<string, { code: string; name: string; uomId: string; uom: { code: string } }> =
      new Map();

    if (detailsProvided) {
      detailPayload = this.normalizeAndValidateDetails(
        dto.details as CreateOutboundDetailDto[],
      );
      itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        if (detailsProvided) {
          await this.ensureBatchAvailability(detailPayload, tx, uuid);
        }

        await tx.deliveryOrder.update({
          where: { uuid },
          data: {
            doNumber: dto.doNumber,
            doDate: dto.doDate ? new Date(dto.doDate) : undefined,
            doReceivedDate: dto.doReceivedDate ? new Date(dto.doReceivedDate) : undefined,
            customerId: dto.customerId,
            destinationCityId:
              typeof dto.destinationCityId !== 'undefined'
                ? dto.destinationCityId || null
                : undefined,
            stdLeadTimeDays: dto.stdLeadTimeDays,
            stdReturnDoDays: dto.stdReturnDoDays,
            shippingDate: dto.shippingDate ? new Date(dto.shippingDate) : undefined,
            actualReceivedDate: dto.actualReceivedDate
              ? new Date(dto.actualReceivedDate)
              : undefined,
            receivedBy: dto.receivedBy,
            doScanReturnDate: dto.doScanReturnDate ? new Date(dto.doScanReturnDate) : undefined,
            bu: dto.bu,
            notes: dto.notes,
            status: dto.status,
            updatedBy: actorId ?? null,
          },
        });

        if (detailsProvided) {
          const existingDetailRows = await tx.deliveryOrderDetail.findMany({
            where: { doId: uuid },
            select: { uuid: true },
          });
          const existingDetailIds = existingDetailRows.map((row) => row.uuid);
          if (existingDetailIds.length > 0) {
            await tx.outboundDetailBatch.deleteMany({
              where: { outboundDetailId: { in: existingDetailIds } },
            });
          }
          await tx.deliveryOrderDetail.deleteMany({ where: { doId: uuid } });

          for (let index = 0; index < detailPayload.length; index += 1) {
            const detail = detailPayload[index];
            const item = itemMap.get(detail.itemId)!;

            const createdDetail = await tx.deliveryOrderDetail.create({
              data: {
                doId: uuid,
                lineNo: index + 1,
                itemId: detail.itemId,
                qtyPcs: detail.qtyPcs ?? 0,
                qtyKg: detail.qtyKg,
                itemCodeSnapshot: item.code,
                itemNameSnapshot: item.name,
                uomCodeSnapshot: item.uom.code,
                notes: detail.notes ?? null,
                createdBy: actorId ?? null,
                updatedBy: actorId ?? null,
              },
              select: { uuid: true },
            });

            await tx.outboundDetailBatch.create({
              data: {
                outboundDetailId: createdDetail.uuid,
                lineNo: 1,
                batchOut: detail.batchNumber,
                qtyPcs: detail.qtyPcs ?? 0,
                qtyKg: detail.qtyKg,
                notes: detail.notes ?? null,
                createdBy: actorId ?? null,
                updatedBy: actorId ?? null,
              },
            });
          }
        }

        await this.syncOutboundInventoryLedger(tx, uuid, actorId);
      });
    } catch (error) {
      if (
        isUniqueViolation(error, [
          'do_number',
          'doNumber',
          'm2_outbound_do_number_key',
          'ux_m2_outbound_number_active',
        ])
      ) {
        throwDuplicate({
          fieldLabel: 'DO number',
          value: dto.doNumber ?? existing.doNumber,
        });
      }
      throw error;
    }

    return this.findOne(uuid);
  }

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.deliveryOrder.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true },
    });
    if (!existing) {
      throw new NotFoundException('outbound not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.deliveryOrder.update({
        where: { uuid },
        data: {
          deletedAt: new Date(),
          deletedBy: actorId ?? null,
          status: 'COMPLETED',
          updatedBy: actorId ?? null,
        },
      });
      await tx.outboundDetailBatch.updateMany({
        where: {
          deletedAt: null,
          outboundDetail: {
            doId: uuid,
            deletedAt: null,
          },
        },
        data: {
          deletedAt: new Date(),
          deletedBy: actorId ?? null,
          updatedBy: actorId ?? null,
        },
      });
      await tx.deliveryOrderDetail.updateMany({
        where: { doId: uuid, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedBy: actorId ?? null,
          updatedBy: actorId ?? null,
        },
      });

      await this.syncOutboundInventoryLedger(tx, uuid, actorId);
    });

    return { success: true, message: 'outbound deleted' };
  }

  private async ensureDoNumberAvailable(doNumber: string, exceptUuid?: string) {
    const duplicate = await this.prisma.deliveryOrder.findFirst({
      where: {
        doNumber,
        NOT: exceptUuid ? { uuid: exceptUuid } : undefined,
      },
      select: { uuid: true, deletedAt: true },
    });

    if (duplicate) {
      throwDuplicate({
        fieldLabel: 'DO number',
        value: doNumber,
        isSoftDeleted: Boolean(duplicate.deletedAt),
      });
    }
  }

  private normalizeRequiredDoNumber(value?: string) {
    const doNumber = String(value ?? '').trim();
    if (!doNumber) {
      throw new BadRequestException('DO number is required');
    }
    return doNumber;
  }

  private async ensureCustomerExists(customerId: string) {
    const customer = await this.prisma.masterDataContact.findFirst({
      where: {
        uuid: customerId,
        type: 'customer',
        deletedAt: null,
      },
      select: { uuid: true, city: true },
    });

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    return customer;
  }

  private async resolveDefaultsFromCustomerCity(customerCity?: string) {
    const normalizedCityName = String(customerCity ?? '').trim();
    if (!normalizedCityName) {
      return { destinationCityId: null as string | null };
    }

    const matchedCity = await this.prisma.masterDataCity.findFirst({
      where: {
        name: {
          equals: normalizedCityName,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
      select: { uuid: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    return { destinationCityId: matchedCity?.uuid ?? null };
  }

  private async findCitySlaByCityId(cityId: string) {
    return this.prisma.masterDataCitySla.findFirst({
      where: {
        cityId,
        deletedAt: null,
      },
      select: {
        stdLeadTimeDays: true,
        stdReturnDoDays: true,
      },
    });
  }

  private async ensureCityExists(cityId: string) {
    const city = await this.prisma.masterDataCity.findFirst({
      where: { uuid: cityId, deletedAt: null },
      select: { uuid: true },
    });

    if (!city) {
      throw new BadRequestException('Destination city not found');
    }
  }

  private normalizeAndValidateDetails(details: CreateOutboundDetailDto[]) {
    if (!details.length) {
      throw new BadRequestException('At least one detail row is required');
    }

    const seen = new Set<string>();

    return details.map((raw) => {
      const itemId = raw.itemId.trim();
      const batchNumber = raw.batchNumber.trim();

      if (!itemId) {
        throw new BadRequestException('Detail itemId is required');
      }

      if (!batchNumber) {
        throw new BadRequestException('Detail batchNumber is required');
      }

      const compositeKey = `${itemId}::${batchNumber.toLowerCase()}`;
      if (seen.has(compositeKey)) {
        throw new BadRequestException(
          `Duplicate item and batch combination: ${itemId} - ${batchNumber}`,
        );
      }
      seen.add(compositeKey);

      return {
        ...raw,
        itemId,
        batchNumber,
      };
    });
  }

  private async getActiveItems(itemIds: string[]) {
    const uniqueItemIds = [...new Set(itemIds)];

    const items = await this.prisma.masterDataItem.findMany({
      where: {
        uuid: { in: uniqueItemIds },
        isActive: true,
        deletedAt: null,
      },
      select: {
        uuid: true,
        code: true,
        name: true,
        uomId: true,
        uom: { select: { code: true } },
      },
    });

    if (items.length !== uniqueItemIds.length) {
      throw new BadRequestException('One or more items are not found or inactive');
    }

    return new Map(items.map((item) => [item.uuid, item]));
  }

  private async resolveWarehouseForActor(tx: Prisma.TransactionClient, actorId?: string) {
    if (!actorId) {
      return undefined;
    }

    const actor = await tx.user.findFirst({
      where: {
        uuid: actorId,
        deletedAt: null,
      },
      select: {
        warehouseId: true,
      },
    });

    const mappedWarehouseId = String(actor?.warehouseId ?? '').trim();
    if (!mappedWarehouseId || mappedWarehouseId === 'null' || mappedWarehouseId === 'undefined') {
      return undefined;
    }

    return mappedWarehouseId;
  }

  private async syncOutboundInventoryLedger(
    tx: Prisma.TransactionClient,
    deliveryOrderUuid: string,
    actorId?: string,
  ) {
    const now = new Date();
    await tx.inventoryLedger.updateMany({
      where: {
        referenceDocType: 'OUTBOUND',
        referenceDocId: deliveryOrderUuid,
        deletedAt: null,
      },
      data: {
        deletedAt: now,
        deletedBy: actorId ?? null,
        updatedBy: actorId ?? null,
      },
    });

    const outbound = await tx.deliveryOrder.findFirst({
      where: { uuid: deliveryOrderUuid },
      select: {
        uuid: true,
        doNumber: true,
        doDate: true,
        deletedAt: true,
        details: {
          where: { deletedAt: null },
          orderBy: [{ lineNo: 'asc' }],
          select: {
            itemId: true,
            item: {
              select: {
                uomId: true,
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
    const itemIds = new Set<string>();
    const batchNumbers = new Set<string>();

    outbound.details.forEach((detail) => {
      const itemId = String(detail.itemId ?? '').trim();
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

    const sourceByPair = new Map<string, { warehouseId: string; expiryDate: Date | null }>();
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
                  warehouseId: true,
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
        const warehouseId = String(source.inboundDetail?.inbound?.warehouseId ?? '').trim();
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
        const warehouseId = source?.warehouseId || actorWarehouseId;
        if (!warehouseId) {
          throw new BadRequestException(
            `Warehouse source is not found for item ${detail.itemId} batch ${batchNumber}`,
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
            expiryDate: source?.expiryDate ?? batch.expiredDate ?? undefined,
            isActive: true,
            deletedAt: null,
            deletedBy: null,
            updatedBy: actorId ?? null,
          },
          create: {
            itemId: detail.itemId,
            batchNumber,
            expiryDate: source?.expiryDate ?? batch.expiredDate ?? null,
            isActive: true,
            createdBy: actorId ?? null,
            updatedBy: actorId ?? null,
          },
          select: { uuid: true },
        });

        const qtyPcs = Number(batch.qtyPcs ?? 0);
        const qtyKg = Number(batch.qtyKg ?? 0);

        await tx.inventoryLedger.create({
          data: {
            transactionDate: outbound.doDate ?? now,
            itemId: detail.itemId,
            warehouseId,
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
            userId: actorId ?? null,
            notes: batch.notes ?? null,
            createdBy: actorId ?? null,
            updatedBy: actorId ?? null,
          },
        });
      }
    }
  }

  private async ensureBatchAvailability(
    details: CreateOutboundDetailDto[],
    tx: Prisma.TransactionClient,
    excludeDoId?: string,
  ) {
    const requestedByPair = new Map<string, number>();
    const pairLabelByKey = new Map<string, { itemId: string; batchNumber: string }>();
    const itemIds = new Set<string>();
    const batchNumbers = new Set<string>();

    details.forEach((detail) => {
      const itemId = String(detail.itemId ?? '').trim();
      const batchNumber = String(detail.batchNumber ?? '').trim();
      const qty = Number(detail.qtyPcs ?? 0);
      const qtyPcs = Number.isFinite(qty) ? qty : 0;
      const key = `${itemId}::${batchNumber.toLowerCase()}`;

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

    const normalizedExcludeDoId = String(excludeDoId ?? '').trim() || undefined;
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
              uuid: normalizedExcludeDoId ? { not: normalizedExcludeDoId } : undefined,
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
}
