import { Injectable, NotFoundException } from '@nestjs/common';
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
  NormalizedOutboundDetail,
  normalizeAndValidateDetails,
  normalizeAuditActor,
  normalizeRequiredDoNumber,
  parseId,
  parseOptionalId,
} from './outbound-helpers';
import { OutboundBatchService } from './outbound-batch.service';
import { OutboundInventoryService } from './outbound-inventory.service';
import { OutboundQueryService } from './outbound-query.service';
import { OutboundStockReportService } from './outbound-stock-report.service';
import { OutboundValidatorsService } from './outbound-validators.service';

@Injectable()
export class OutboundService {
  constructor(
    private prisma: PrismaService,
    private batchService: OutboundBatchService,
    private inventoryService: OutboundInventoryService,
    private stockReportService: OutboundStockReportService,
    private validators: OutboundValidatorsService,
    private queryService: OutboundQueryService,
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

  async findAll(query: QueryOutboundDto, actorId?: string | number) {
    return this.queryService.findAll(query, actorId);
  }

  async findOne(id: number, actorId?: string | number) {
    return this.queryService.findOne(id, actorId);
  }

  // ---------------------------------------------------------------------------
  // Core CRUD — create / update / remove
  // ---------------------------------------------------------------------------

  async create(dto: CreateOutboundDto, actorId?: string | number) {
    const auditActor = normalizeAuditActor(actorId);
    const doNumber = normalizeRequiredDoNumber(dto.doNumber);
    await this.validators.ensureDoNumberAvailable(doNumber);

    const customerId = parseId(dto.customerId, 'customerId');
    const warehouseId = await this.validators.resolveInputWarehouseForActor(
      actorId,
      dto.warehouseId,
    );
    const customer = await this.validators.ensureCustomerExists(customerId);
    await this.validators.ensureWarehouseExists(warehouseId);
    const defaults = await this.validators.resolveDefaultsFromCustomerCity(
      customer.city ?? undefined,
    );

    const requestedDestinationCityId = parseOptionalId(dto.destinationCityId, 'destinationCityId');
    const resolvedDestinationCityId =
      requestedDestinationCityId ?? defaults.destinationCityId ?? null;
    if (resolvedDestinationCityId !== null) {
      await this.validators.ensureCityExists(resolvedDestinationCityId);
    }

    const resolvedSla = resolvedDestinationCityId
      ? await this.validators.findCitySlaByCityId(resolvedDestinationCityId)
      : null;
    const resolvedStdLeadTimeDays = dto.stdLeadTimeDays ?? resolvedSla?.stdLeadTimeDays ?? 0;
    const resolvedStdReturnDoDays = dto.stdReturnDoDays ?? resolvedSla?.stdReturnDoDays ?? 0;

    const detailPayload = normalizeAndValidateDetails(dto.details);
    const itemMap = await this.validators.getActiveItems(detailPayload.map((d) => d.itemId));

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

        await this.writeDetailRows(tx, header.id, detailPayload, itemMap, auditActor);
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

  async update(id: number, dto: UpdateOutboundDto, actorId?: string | number) {
    const auditActor = normalizeAuditActor(actorId);
    const scopedWarehouseId = await this.validators.resolveWarehouseFilterForActor(actorId);
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
        await this.validators.ensureDoNumberAvailable(normalizedDoNumber, id);
      }
    }

    if (dto.customerId) {
      const customerId = parseId(dto.customerId, 'customerId');
      dto.customerId = String(customerId);
      await this.validators.ensureCustomerExists(customerId);
    }

    const effectiveWarehouseId = await this.validators.resolveInputWarehouseForActor(
      actorId,
      dto.warehouseId,
      existing.warehouseId ?? undefined,
    );
    await this.validators.ensureWarehouseExists(effectiveWarehouseId);

    if (typeof dto.destinationCityId !== 'undefined') {
      const destinationCityId = parseOptionalId(dto.destinationCityId, 'destinationCityId');
      if (destinationCityId !== undefined) {
        await this.validators.ensureCityExists(destinationCityId);
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
      itemMap = await this.validators.getActiveItems(detailPayload.map((d) => d.itemId));
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

          await this.writeDetailRows(tx, id, detailPayload, itemMap, auditActor);
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
    const scopedWarehouseId = await this.validators.resolveWarehouseFilterForActor(actorId);
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
  // Private helpers
  // ---------------------------------------------------------------------------

  private async writeDetailRows(
    tx: Parameters<Parameters<typeof this.prisma.$transaction>[0]>[0],
    doId: number,
    details: NormalizedOutboundDetail[],
    itemMap: Map<number, { id: number; code: string; name: string; uom: { code: string } }>,
    auditActor: number | undefined,
  ) {
    for (let index = 0; index < details.length; index += 1) {
      const detail = details[index];
      const item = itemMap.get(detail.itemId)!;

      const createdDetail = await tx.deliveryOrderDetail.create({
        data: {
          doId,
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
}
