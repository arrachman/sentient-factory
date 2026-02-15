import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryOrderDetailDto } from './dto/create-delivery-order-detail.dto';
import { CreateDeliveryOrderDto } from './dto/create-delivery-order.dto';
import { QueryMonitoringDeliveryOrderDto } from './dto/query-monitoring-delivery-order.dto';
import { QueryDeliveryOrderDto } from './dto/query-delivery-order.dto';
import { UpdateDeliveryOrderDto } from './dto/update-delivery-order.dto';

@Injectable()
export class DeliveryOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDeliveryOrderDto, actorId?: string) {
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
        await this.ensureBatchAvailability(detailPayload, undefined, tx);

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

        await tx.deliveryOrderDetail.createMany({
          data: detailPayload.map((detail, index) => {
            const item = itemMap.get(detail.itemId)!;
            return {
              doId: header.uuid,
              lineNo: index + 1,
              itemId: detail.itemId,
              batchNumber: detail.batchNumber,
              qtyPcs: detail.qtyPcs ?? 0,
              qtyKg: detail.qtyKg,
              itemCodeSnapshot: item.code,
              itemNameSnapshot: item.name,
              uomCodeSnapshot: item.uom.code,
              notes: detail.notes ?? null,
              createdBy: actorId ?? null,
              updatedBy: actorId ?? null,
            };
          }),
        });

        return header;
      });
    } catch (error) {
      if (isUniqueViolation(error, ['do_number', 'doNumber', 'm2_do_do_number_key'])) {
        throwDuplicate({ fieldLabel: 'DO number', value: doNumber });
      }
      throw error;
    }

    return this.findOne(created.uuid);
  }

  async findAll(query: QueryDeliveryOrderDto) {
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
      this.prisma.deliveryOrderDetail.groupBy({
        by: ['batchNumber'],
        where: {
          deletedAt: null,
          itemId: normalizedItemId,
          deliveryOrder: {
            deletedAt: null,
            uuid: normalizedExcludeDoId ? { not: normalizedExcludeDoId } : undefined,
          },
        },
        _sum: {
          qtyPcs: true,
        },
      }),
    ]);

    const usedByBatch = new Map<string, number>();
    usedRows.forEach((row) => {
      const key = String(row.batchNumber ?? '')
        .trim()
        .toLowerCase();
      if (!key) {
        return;
      }
      const qty = Number(row._sum.qtyPcs ?? 0);
      usedByBatch.set(key, (usedByBatch.get(key) ?? 0) + (Number.isFinite(qty) ? qty : 0));
    });

    return {
      success: true,
      data: inboundRows
        .map((row) => {
          const inboundQty = Number(row._sum.qty ?? 0);
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

  async findMonitoringReport(query: QueryMonitoringDeliveryOrderDto) {
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
          select: { itemId: true, batchNumber: true },
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
        const batchNumber = String(detail.batchNumber ?? '').trim();
        if (!itemId || !batchNumber) {
          return;
        }
        pairKeys.add(`${itemId}::${batchNumber}`);
        itemIds.add(itemId);
        batchNumbers.add(batchNumber);
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
          const pairKey = `${detail.itemId}::${detail.batchNumber}`;
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
      throw new NotFoundException('Delivery order not found');
    }

    return { success: true, data: item };
  }

  async update(uuid: string, dto: UpdateDeliveryOrderDto, actorId?: string) {
    const existing = await this.prisma.deliveryOrder.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true, doNumber: true },
    });
    if (!existing) {
      throw new NotFoundException('Delivery order not found');
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
    let detailPayload: CreateDeliveryOrderDetailDto[] = [];
    let itemMap: Map<string, { code: string; name: string; uom: { code: string } }> = new Map();

    if (detailsProvided) {
      detailPayload = this.normalizeAndValidateDetails(
        dto.details as CreateDeliveryOrderDetailDto[],
      );
      itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        if (detailsProvided) {
          await this.ensureBatchAvailability(detailPayload, uuid, tx);
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
          await tx.deliveryOrderDetail.deleteMany({ where: { doId: uuid } });

          await tx.deliveryOrderDetail.createMany({
            data: detailPayload.map((detail, index) => {
              const item = itemMap.get(detail.itemId)!;
              return {
                doId: uuid,
                lineNo: index + 1,
                itemId: detail.itemId,
                batchNumber: detail.batchNumber,
                qtyPcs: detail.qtyPcs ?? 0,
                qtyKg: detail.qtyKg,
                itemCodeSnapshot: item.code,
                itemNameSnapshot: item.name,
                uomCodeSnapshot: item.uom.code,
                notes: detail.notes ?? null,
                createdBy: actorId ?? null,
                updatedBy: actorId ?? null,
              };
            }),
          });
        }
      });
    } catch (error) {
      if (isUniqueViolation(error, ['do_number', 'doNumber', 'm2_do_do_number_key'])) {
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
      throw new NotFoundException('Delivery order not found');
    }

    await this.prisma.$transaction([
      this.prisma.deliveryOrder.update({
        where: { uuid },
        data: {
          deletedAt: new Date(),
          deletedBy: actorId ?? null,
          status: 'COMPLETED',
          updatedBy: actorId ?? null,
        },
      }),
      this.prisma.deliveryOrderDetail.updateMany({
        where: { doId: uuid, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedBy: actorId ?? null,
          updatedBy: actorId ?? null,
        },
      }),
    ]);

    return { success: true, message: 'Delivery order deleted' };
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

  private normalizeAndValidateDetails(details: CreateDeliveryOrderDetailDto[]) {
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
        uom: { select: { code: true } },
      },
    });

    if (items.length !== uniqueItemIds.length) {
      throw new BadRequestException('One or more items are not found or inactive');
    }

    return new Map(items.map((item) => [item.uuid, item]));
  }

  private async ensureBatchAvailability(
    details: CreateDeliveryOrderDetailDto[],
    excludeDoId?: string,
    tx: Prisma.TransactionClient,
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
      tx.deliveryOrderDetail.findMany({
        where: {
          deletedAt: null,
          itemId: { in: [...itemIds] },
          batchNumber: { in: [...batchNumbers] },
          deliveryOrder: {
            deletedAt: null,
            uuid: normalizedExcludeDoId ? { not: normalizedExcludeDoId } : undefined,
          },
        },
        select: {
          itemId: true,
          batchNumber: true,
          qtyPcs: true,
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
      const itemId = String(row.itemId ?? '').trim();
      const batchNumber = String(row.batchNumber ?? '').trim();
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
