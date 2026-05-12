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
import {
  isMissingWarehouseColumnError,
  normalizeAndValidateDetails,
  normalizeAuditActor,
  normalizeRequiredDoNumber,
  parseId,
  parseOptionalActorId,
  parseOptionalId,
} from './outbound-helpers';
import { OutboundBatchService } from './outbound-batch.service';
import { OutboundInventoryService } from './outbound-inventory.service';
import { OutboundStockReportService } from './outbound-stock-report.service';

type NormalizedOutboundDetail = Omit<CreateOutboundDetailDto, 'itemId' | 'batchNumber'> & {
  itemId: number;
  batchNumber: string;
};

@Injectable()
export class OutboundService {
  constructor(
    private prisma: PrismaService,
    private batchService: OutboundBatchService,
    private inventoryService: OutboundInventoryService,
    private stockReportService: OutboundStockReportService,
  ) {}

  // ---------------------------------------------------------------------------
  // Delegated methods
  // ---------------------------------------------------------------------------

  async getBatchOptions(
    itemId?: string,
    excludeDoId?: string,
    warehouseId?: string,
    actorId?: string | number,
  ) {
    return this.batchService.getBatchOptions(itemId, excludeDoId, warehouseId, actorId);
  }

  async findMonitoringReport(query: QueryMonitoringOutboundDto, actorId?: string | number) {
    return this.batchService.findMonitoringReport(query, actorId);
  }

  async findStockBatchReport(query: QueryStockBatchReportDto) {
    return this.stockReportService.findStockBatchReport(query);
  }

  async findStockMutationReport(query: QueryStockMutationReportDto) {
    return this.stockReportService.findStockMutationReport(query);
  }

  // ---------------------------------------------------------------------------
  // Core CRUD
  // ---------------------------------------------------------------------------

  async create(dto: CreateOutboundDto, actorId?: string | number) {
    const auditActor = normalizeAuditActor(actorId);
    const doNumber = normalizeRequiredDoNumber(dto.doNumber);
    await this.ensureDoNumberAvailable(doNumber);

    const customerId = parseId(dto.customerId, 'customerId');
    const warehouseId = await this.resolveInputWarehouseForActor(actorId, dto.warehouseId);
    const customer = await this.ensureCustomerExists(customerId);
    await this.ensureWarehouseExists(warehouseId);
    const defaults = await this.resolveDefaultsFromCustomerCity(customer.city ?? undefined);

    const requestedDestinationCityId = parseOptionalId(dto.destinationCityId, 'destinationCityId');
    const resolvedDestinationCityId =
      requestedDestinationCityId ?? defaults.destinationCityId ?? null;
    if (resolvedDestinationCityId !== null) {
      await this.ensureCityExists(resolvedDestinationCityId);
    }

    const resolvedSla = resolvedDestinationCityId
      ? await this.findCitySlaByCityId(resolvedDestinationCityId)
      : null;
    const resolvedStdLeadTimeDays = dto.stdLeadTimeDays ?? resolvedSla?.stdLeadTimeDays ?? 0;
    const resolvedStdReturnDoDays = dto.stdReturnDoDays ?? resolvedSla?.stdReturnDoDays ?? 0;

    const detailPayload = normalizeAndValidateDetails(dto.details);
    const itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));

    let created;
    try {
      created = await this.prisma.$transaction(async (tx) => {
        await this.inventoryService.ensureBatchAvailability(
          detailPayload,
          tx,
          undefined,
          warehouseId,
        );

        const header = await tx.deliveryOrder.create({
          data: {
            doNumber,
            doDate: new Date(dto.doDate),
            doReceivedDate: new Date(dto.doReceivedDate),
            customerId,
            warehouseId,
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
            createdBy: auditActor ?? null,
            updatedBy: auditActor ?? null,
          },
        });

        for (let index = 0; index < detailPayload.length; index += 1) {
          const detail = detailPayload[index];
          const item = itemMap.get(detail.itemId)!;

          const createdDetail = await tx.deliveryOrderDetail.create({
            data: {
              doId: header.id,
              lineNo: index + 1,
              itemId: detail.itemId,
              qtyPcs: detail.qtyPcs ?? 0,
              qtyKg: detail.qtyKg,
              itemCodeSnapshot: item.code,
              itemNameSnapshot: item.name,
              uomCodeSnapshot: item.uom.code,
              notes: detail.notes ?? null,
              createdBy: auditActor ?? null,
              updatedBy: auditActor ?? null,
            },
            select: { id: true },
          });

          await tx.outboundDetailBatch.create({
            data: {
              outboundDetailId: createdDetail.id,
              lineNo: 1,
              batchOut: detail.batchNumber,
              qtyPcs: detail.qtyPcs ?? 0,
              qtyKg: detail.qtyKg,
              notes: detail.notes ?? null,
              createdBy: auditActor ?? null,
              updatedBy: auditActor ?? null,
            },
          });
        }

        await this.inventoryService.syncOutboundInventoryLedger(tx, header.id, actorId);

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

    return this.findOne(created.id, actorId);
  }

  async findAll(query: QueryOutboundDto, actorId?: string | number) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.DeliveryOrderWhereInput = { deletedAt: null };
    const scopedWarehouseId = await this.resolveWarehouseFilterForActor(actorId, query.warehouseId);

    if (typeof scopedWarehouseId === 'number') {
      where.warehouseId = scopedWarehouseId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.customerId?.trim()) {
      where.customerId = parseId(query.customerId, 'customerId');
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
        { warehouse: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    let items: Array<any> = [];
    let total = 0;
    try {
      const result = await this.prisma.$transaction([
        this.prisma.deliveryOrder.findMany({
          where,
          include: {
            customer: { select: { id: true, code: true, name: true, type: true } },
            warehouse: { select: { id: true, name: true, locationName: true } },
            destinationCity: { select: { id: true, name: true, postalCode: true } },
            _count: { select: { details: { where: { deletedAt: null } } } },
            details: {
              where: { deletedAt: null },
              select: {
                qtyKg: true,
                batches: {
                  where: { deletedAt: null },
                  select: { id: true },
                },
              },
            },
          },
          orderBy: [{ createdAt: 'desc' }],
          skip,
          take: limit,
        }),
        this.prisma.deliveryOrder.count({ where }),
      ]);
      [items, total] = result;
    } catch (error) {
      if (isMissingWarehouseColumnError(error)) {
        throw new BadRequestException(
          'Schema database outbound belum update. Jalankan migration terbaru (warehouse_id pada m2_outbound).',
        );
      }
      throw error;
    }

    const data = items.map((item) => {
      const totalItemTypes = item._count?.details ?? 0;
      const totalBatches = item.details.reduce(
        (sum: number, detail: { batches: Array<unknown> }) => sum + detail.batches.length,
        0,
      );
      const totalKg = item.details.reduce((sum: number, detail: { qtyKg?: number | string }) => {
        const qtyKg = Number(detail.qtyKg ?? 0);
        return sum + (Number.isFinite(qtyKg) ? qtyKg : 0);
      }, 0);

      return {
        ...item,
        totalItemTypes,
        totalBatches,
        totalKg,
      };
    });

    return {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: number, actorId?: string | number) {
    const scopedWarehouseId = await this.resolveWarehouseFilterForActor(actorId);
    const item = await this.prisma.deliveryOrder.findFirst({
      where: {
        id,
        deletedAt: null,
        warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
      },
      include: {
        customer: { select: { id: true, code: true, name: true, type: true } },
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
          orderBy: [{ lineNo: 'asc' }],
          include: {
            batches: {
              where: { deletedAt: null },
              orderBy: [{ lineNo: 'asc' }],
            },
            item: {
              select: {
                id: true,
                code: true,
                name: true,
                category: true,
                itemType: true,
                uom: { select: { id: true, code: true, name: true, type: true } },
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

  async update(id: number, dto: UpdateOutboundDto, actorId?: string | number) {
    const auditActor = normalizeAuditActor(actorId);
    const scopedWarehouseId = await this.resolveWarehouseFilterForActor(actorId);
    const existing = await this.prisma.deliveryOrder.findFirst({
      where: {
        id,
        deletedAt: null,
        warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
      },
      select: { id: true, doNumber: true, warehouseId: true },
    });
    if (!existing) {
      throw new NotFoundException('outbound not found');
    }

    if (typeof dto.doNumber !== 'undefined') {
      const normalizedDoNumber = normalizeRequiredDoNumber(dto.doNumber);
      dto.doNumber = normalizedDoNumber;
      if (normalizedDoNumber !== existing.doNumber) {
        await this.ensureDoNumberAvailable(normalizedDoNumber, id);
      }
    }

    if (dto.customerId) {
      const customerId = parseId(dto.customerId, 'customerId');
      dto.customerId = String(customerId);
      await this.ensureCustomerExists(customerId);
    }

    const effectiveWarehouseId = await this.resolveInputWarehouseForActor(
      actorId,
      dto.warehouseId,
      existing.warehouseId ?? undefined,
    );
    await this.ensureWarehouseExists(effectiveWarehouseId);

    if (typeof dto.destinationCityId !== 'undefined') {
      const destinationCityId = parseOptionalId(dto.destinationCityId, 'destinationCityId');
      if (destinationCityId !== undefined) {
        await this.ensureCityExists(destinationCityId);
      }
      dto.destinationCityId =
        typeof destinationCityId === 'number' ? String(destinationCityId) : undefined;
    }

    const detailsProvided = Array.isArray(dto.details);
    let detailPayload: NormalizedOutboundDetail[] = [];
    let itemMap = new Map<
      number,
      { id: number; code: string; name: string; uom: { code: string } }
    >();

    if (detailsProvided) {
      detailPayload = normalizeAndValidateDetails(dto.details as CreateOutboundDetailDto[]);
      itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        if (detailsProvided) {
          await this.inventoryService.ensureBatchAvailability(
            detailPayload,
            tx,
            id,
            effectiveWarehouseId,
          );
        }

        await tx.deliveryOrder.update({
          where: { id },
          data: {
            doNumber: dto.doNumber,
            doDate: dto.doDate ? new Date(dto.doDate) : undefined,
            doReceivedDate: dto.doReceivedDate ? new Date(dto.doReceivedDate) : undefined,
            customerId: dto.customerId ? parseId(dto.customerId, 'customerId') : undefined,
            warehouseId: effectiveWarehouseId,
            destinationCityId:
              typeof dto.destinationCityId !== 'undefined'
                ? dto.destinationCityId
                  ? parseId(dto.destinationCityId, 'destinationCityId')
                  : null
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
            updatedBy: auditActor ?? null,
          },
        });

        if (detailsProvided) {
          const existingDetailRows = await tx.deliveryOrderDetail.findMany({
            where: { doId: id },
            select: { id: true },
          });
          const existingDetailIds = existingDetailRows.map((row) => row.id);
          if (existingDetailIds.length > 0) {
            await tx.outboundDetailBatch.deleteMany({
              where: { outboundDetailId: { in: existingDetailIds } },
            });
          }
          await tx.deliveryOrderDetail.deleteMany({ where: { doId: id } });

          for (let index = 0; index < detailPayload.length; index += 1) {
            const detail = detailPayload[index];
            const item = itemMap.get(detail.itemId)!;

            const createdDetail = await tx.deliveryOrderDetail.create({
              data: {
                doId: id,
                lineNo: index + 1,
                itemId: detail.itemId,
                qtyPcs: detail.qtyPcs ?? 0,
                qtyKg: detail.qtyKg,
                itemCodeSnapshot: item.code,
                itemNameSnapshot: item.name,
                uomCodeSnapshot: item.uom.code,
                notes: detail.notes ?? null,
                createdBy: auditActor ?? null,
                updatedBy: auditActor ?? null,
              },
              select: { id: true },
            });

            await tx.outboundDetailBatch.create({
              data: {
                outboundDetailId: createdDetail.id,
                lineNo: 1,
                batchOut: detail.batchNumber,
                qtyPcs: detail.qtyPcs ?? 0,
                qtyKg: detail.qtyKg,
                notes: detail.notes ?? null,
                createdBy: auditActor ?? null,
                updatedBy: auditActor ?? null,
              },
            });
          }
        }

        await this.inventoryService.syncOutboundInventoryLedger(tx, id, actorId);
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

    return this.findOne(id, actorId);
  }

  async remove(id: number, actorId?: string | number) {
    const auditActor = normalizeAuditActor(actorId);
    const scopedWarehouseId = await this.resolveWarehouseFilterForActor(actorId);
    const existing = await this.prisma.deliveryOrder.findFirst({
      where: {
        id,
        deletedAt: null,
        warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
      },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('outbound not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.deliveryOrder.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: auditActor ?? null,
          status: 'COMPLETED',
          updatedBy: auditActor ?? null,
        },
      });
      await tx.outboundDetailBatch.updateMany({
        where: {
          deletedAt: null,
          outboundDetail: {
            doId: id,
            deletedAt: null,
          },
        },
        data: {
          deletedAt: new Date(),
          deletedBy: auditActor ?? null,
          updatedBy: auditActor ?? null,
        },
      });
      await tx.deliveryOrderDetail.updateMany({
        where: { doId: id, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedBy: auditActor ?? null,
          updatedBy: auditActor ?? null,
        },
      });

      await this.inventoryService.syncOutboundInventoryLedger(tx, id, actorId);
    });

    return { success: true, message: 'outbound deleted' };
  }

  // ---------------------------------------------------------------------------
  // Private helpers (require Prisma — kept in main service)
  // ---------------------------------------------------------------------------

  private async ensureDoNumberAvailable(doNumber: string, exceptId?: number) {
    const duplicate = await this.prisma.deliveryOrder.findFirst({
      where: {
        doNumber,
        NOT: exceptId ? { id: exceptId } : undefined,
      },
      select: { id: true, deletedAt: true },
    });

    if (duplicate) {
      throwDuplicate({
        fieldLabel: 'DO number',
        value: doNumber,
        isSoftDeleted: Boolean(duplicate.deletedAt),
      });
    }
  }

  private async ensureCustomerExists(customerId: number) {
    const customer = await this.prisma.masterDataContact.findFirst({
      where: {
        id: customerId,
        type: 'customer',
        deletedAt: null,
      },
      select: { id: true, city: true },
    });

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    return customer;
  }

  private async ensureWarehouseExists(warehouseId: number) {
    const warehouse = await this.prisma.masterDataWarehouse.findFirst({
      where: { id: warehouseId, deletedAt: null },
      select: { id: true },
    });

    if (!warehouse) {
      throw new BadRequestException('Warehouse not found');
    }
  }

  private async resolveDefaultsFromCustomerCity(customerCity?: string) {
    const normalizedCityName = String(customerCity ?? '').trim();
    if (!normalizedCityName) {
      return { destinationCityId: null as number | null };
    }

    const matchedCity = await this.prisma.masterDataCity.findFirst({
      where: {
        name: {
          equals: normalizedCityName,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
      select: { id: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    return { destinationCityId: matchedCity?.id ?? null };
  }

  private async findCitySlaByCityId(cityId: number) {
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

  private async ensureCityExists(cityId: number) {
    const city = await this.prisma.masterDataCity.findFirst({
      where: { id: cityId, deletedAt: null },
      select: { id: true },
    });

    if (!city) {
      throw new BadRequestException('Destination city not found');
    }
  }

  private async getActiveItems(itemIds: number[]) {
    const uniqueItemIds = [...new Set(itemIds)];

    const items = await this.prisma.masterDataItem.findMany({
      where: {
        id: { in: uniqueItemIds },
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        code: true,
        name: true,
        uom: { select: { id: true, code: true } },
      },
    });

    if (items.length !== uniqueItemIds.length) {
      throw new BadRequestException('One or more items are not found or inactive');
    }

    return new Map(
      items.map((item) => [
        item.id,
        {
          id: item.id,
          code: item.code,
          name: item.name,
          uomId: item.uom.id,
          uom: { code: item.uom.code },
        },
      ]),
    );
  }

  private async resolveWarehouseForActor(tx: Prisma.TransactionClient, actorId?: string | number) {
    const parsedActorId = this.parseOptionalActorUserId(actorId);
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
    const parsedActorId = this.parseOptionalActorUserId(actorId);
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

  private parseOptionalActorUserId(actorId?: string | number): number | undefined {
    if (typeof actorId === 'undefined' || actorId === null) {
      return undefined;
    }
    const normalized = String(actorId).trim();
    if (!normalized) {
      return undefined;
    }
    const parsed = Number(normalized);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return undefined;
    }
    return parsed;
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

  private async resolveInputWarehouseForActor(
    actorId?: string | number,
    requestedWarehouseId?: string,
    fallbackWarehouseId?: number,
  ): Promise<number> {
    const actor = await this.getActorWarehouseAccess(actorId);

    if (actor.canAccessAllWarehouses) {
      if (requestedWarehouseId?.trim()) {
        return parseId(requestedWarehouseId, 'warehouseId');
      }
      if (typeof fallbackWarehouseId === 'number' && fallbackWarehouseId > 0) {
        return fallbackWarehouseId;
      }
      if (typeof actor.warehouseId === 'number' && actor.warehouseId > 0) {
        return actor.warehouseId;
      }
      throw new BadRequestException('warehouseId is required');
    }

    if (typeof actor.warehouseId === 'number' && actor.warehouseId > 0) {
      return actor.warehouseId;
    }

    throw new BadRequestException('Warehouse untuk user login belum terdaftar');
  }

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
}
