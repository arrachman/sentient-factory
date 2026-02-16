import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { CreateInboundBatchDto } from './dto/create-inbound-batch.dto';
import { CreateInboundDetailDto } from './dto/create-inbound-detail.dto';
import { CreateInboundDto } from './dto/create-inbound.dto';
import { QueryInboundDto } from './dto/query-inbound.dto';
import { UpdateInboundDto } from './dto/update-inbound.dto';

@Injectable()
export class InboundsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInboundDto, actorId?: string | number) {
    const supplierId = this.parseId(dto.supplierId, 'Supplier ID');
    await this.ensureSupplierExists(supplierId);
    const effectiveWarehouseId = await this.resolveWarehouseForActor(actorId);
    await this.ensureWarehouseExists(effectiveWarehouseId);

    const detailPayload = this.normalizeAndValidateDetails(dto.details);
    const itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));

    const created = await this.prisma.$transaction(async (tx) => {
      const transactionNo = await this.resolveTransactionNo(tx, dto.transactionNo);
      const header = await tx.inbound.create({
        data: {
          transactionNo,
          transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : new Date(),
          supplierId,
          warehouseId: effectiveWarehouseId,
          notes: dto.notes ?? null,
          status: 'POSTED',
          createdBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
      });

      for (const [index, detail] of detailPayload.entries()) {
        const item = itemMap.get(detail.itemId)!;
        await tx.inboundDetail.create({
          data: {
            inboundId: header.id,
            lineNo: index + 1,
            itemId: detail.itemId,
            qty: detail.qty,
            uomInput: detail.uomInput ?? null,
            itemCodeSnapshot: item.code,
            itemNameSnapshot: item.name,
            notes: detail.notes ?? null,
            createdBy: toAuditUserId(actorId),
            updatedBy: toAuditUserId(actorId),
            batches: {
              create: detail.batches.map((batch, batchIndex) => ({
                lineNo: batchIndex + 1,
                batchIn: batch.batchIn,
                qty: batch.qty,
                expiredDate: batch.expiredDate ? new Date(batch.expiredDate) : null,
                notes: batch.notes ?? null,
                createdBy: toAuditUserId(actorId),
                updatedBy: toAuditUserId(actorId),
              })),
            },
          },
        });
      }

      await this.syncInboundInventoryLedger(tx, header.id, actorId);

      return header;
    });

    return this.findOne(created.id);
  }

  async findAll(query: QueryInboundDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.InboundWhereInput = { deletedAt: null };

    if (query.status) {
      where.status = query.status;
    }

    if (query.supplierId?.trim()) {
      const supplierId = this.parseId(query.supplierId.trim(), 'Supplier ID');
      where.supplierId = supplierId;
    }

    if (query.warehouseId?.trim()) {
      const warehouseId = this.parseId(query.warehouseId.trim(), 'Warehouse ID');
      where.warehouseId = warehouseId;
    }

    if (query.transactionDateFrom || query.transactionDateTo) {
      where.transactionDate = {
        gte: query.transactionDateFrom ? new Date(query.transactionDateFrom) : undefined,
        lte: query.transactionDateTo ? new Date(query.transactionDateTo) : undefined,
      };
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { transactionNo: { contains: q, mode: 'insensitive' } },
        { notes: { contains: q, mode: 'insensitive' } },
        { supplier: { code: { contains: q, mode: 'insensitive' } } },
        { supplier: { name: { contains: q, mode: 'insensitive' } } },
        { warehouse: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.inbound.findMany({
        where,
        include: {
          supplier: { select: { id: true, code: true, name: true, type: true } },
          warehouse: {
            select: {
              id: true,
              name: true,
              locationName: true,
              city: { select: { id: true, name: true, postalCode: true } },
            },
          },
          _count: { select: { details: { where: { deletedAt: null } } } },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.inbound.count({ where }),
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

  async findOne(id: number) {
    const item = await this.prisma.inbound.findFirst({
      where: { id, deletedAt: null },
      include: {
        supplier: { select: { id: true, code: true, name: true, type: true } },
        warehouse: {
          select: {
            id: true,
            name: true,
            locationName: true,
            addressDetail: true,
            city: {
              select: {
                id: true,
                name: true,
                postalCode: true,
                province: { select: { id: true, name: true, isoCode: true } },
              },
            },
          },
        },
        details: {
          where: { deletedAt: null },
          orderBy: [{ lineNo: 'asc' }],
          include: {
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
            batches: {
              where: { deletedAt: null },
              orderBy: [{ lineNo: 'asc' }],
            },
          },
        },
      },
    });
    if (!item) {
      throw new NotFoundException('Inbound not found');
    }

    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateInboundDto, actorId?: string | number) {
    const existing = await this.prisma.inbound.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, transactionNo: true },
    });
    if (!existing) {
      throw new NotFoundException('Inbound not found');
    }

    if (dto.transactionNo && dto.transactionNo !== existing.transactionNo) {
      await this.ensureTransactionNoAvailable(dto.transactionNo, id);
    }

    if (dto.supplierId) {
      await this.ensureSupplierExists(this.parseId(dto.supplierId, 'Supplier ID'));
    }

    const effectiveWarehouseId = await this.resolveWarehouseForActor(actorId);
    await this.ensureWarehouseExists(effectiveWarehouseId);

    const detailsProvided = Array.isArray(dto.details);
    let detailPayload: NormalizedInboundDetail[] = [];
    let itemMap: Map<number, { id: number; code: string; name: string; uomId: number }> = new Map();

    if (detailsProvided) {
      detailPayload = this.normalizeAndValidateDetails(dto.details as CreateInboundDetailDto[]);
      itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.inbound.update({
        where: { id },
        data: {
          transactionNo: dto.transactionNo,
          transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : undefined,
          supplierId: dto.supplierId ? this.parseId(dto.supplierId, 'Supplier ID') : undefined,
          warehouseId: effectiveWarehouseId,
          notes: dto.notes,
          status: dto.status,
          updatedBy: toAuditUserId(actorId),
        },
      });

      if (detailsProvided) {
        const existingDetails = await tx.inboundDetail.findMany({
          where: { inboundId: id },
          select: { id: true },
        });
        const detailIds = existingDetails.map((row) => row.id);

        if (detailIds.length > 0) {
          await tx.inboundDetailBatch.deleteMany({
            where: { inboundDetailId: { in: detailIds } },
          });
        }

        await tx.inboundDetail.deleteMany({ where: { inboundId: id } });

        for (const [index, detail] of detailPayload.entries()) {
          const item = itemMap.get(detail.itemId)!;
          await tx.inboundDetail.create({
            data: {
              inboundId: id,
              lineNo: index + 1,
              itemId: detail.itemId,
              qty: detail.qty,
              uomInput: detail.uomInput ?? null,
              itemCodeSnapshot: item.code,
              itemNameSnapshot: item.name,
              notes: detail.notes ?? null,
              createdBy: toAuditUserId(actorId),
              updatedBy: toAuditUserId(actorId),
              batches: {
                create: detail.batches.map((batch, batchIndex) => ({
                  lineNo: batchIndex + 1,
                  batchIn: batch.batchIn,
                  qty: batch.qty,
                  expiredDate: batch.expiredDate ? new Date(batch.expiredDate) : null,
                  notes: batch.notes ?? null,
                  createdBy: toAuditUserId(actorId),
                  updatedBy: toAuditUserId(actorId),
                })),
              },
            },
          });
        }
      }

      await this.syncInboundInventoryLedger(tx, id, actorId);
    });

    return this.findOne(id);
  }

  async remove(id: number, actorId?: string | number) {
    const existing = await this.prisma.inbound.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Inbound not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.inbound.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: toAuditUserId(actorId),
          status: 'CANCELLED',
          updatedBy: toAuditUserId(actorId),
        },
      });
      await tx.inboundDetail.updateMany({
        where: { inboundId: id, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
      });
      await tx.inboundDetailBatch.updateMany({
        where: {
          inboundDetail: { inboundId: id },
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
          deletedBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
      });

      await this.syncInboundInventoryLedger(tx, id, actorId);
    });

    return { success: true, message: 'Inbound deleted' };
  }

  private async resolveTransactionNo(tx: Prisma.TransactionClient, transactionNo?: string) {
    const candidate = transactionNo?.trim();
    if (candidate) {
      await this.ensureTransactionNoAvailable(candidate);
      return candidate;
    }

    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const datePart = `${y}${m}${d}`;

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const countToday = await tx.inbound.count({
      where: {
        transactionDate: {
          gte: start,
          lte: end,
        },
      },
    });

    return `INB-${datePart}-${String(countToday + 1).padStart(4, '0')}`;
  }

  private async ensureTransactionNoAvailable(transactionNo: string, exceptId?: number) {
    const duplicate = await this.prisma.inbound.findFirst({
      where: {
        transactionNo,
        NOT: exceptId ? { id: exceptId } : undefined,
      },
      select: { id: true, deletedAt: true },
    });

    if (duplicate) {
      throwDuplicate({
        fieldLabel: 'Inbound transaction number',
        value: transactionNo,
        isSoftDeleted: Boolean(duplicate.deletedAt),
      });
    }
  }

  private async ensureSupplierExists(supplierId: number) {
    const supplier = await this.prisma.masterDataContact.findFirst({
      where: {
        id: supplierId,
        type: 'supplier',
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!supplier) {
      throw new BadRequestException('Supplier not found');
    }
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

  private async resolveWarehouseForActor(actorId?: string | number) {
    if (!actorId) {
      throw new BadRequestException('User login tidak ditemukan');
    }
    const actorUserId = this.parseActorId(actorId);

    const actor = await this.prisma.user.findFirst({
      where: {
        id: actorUserId,
        deletedAt: null,
      },
      select: {
        warehouseId: true,
      },
    });
    const mappedWarehouseId = actor?.warehouseId;
    if (mappedWarehouseId && mappedWarehouseId > 0) {
      return mappedWarehouseId;
    }

    const ownedWarehouse = await this.prisma.masterDataWarehouse.findFirst({
      where: {
        deletedAt: null,
        createdBy: toAuditUserId(actorId),
      },
      select: { id: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    if (!ownedWarehouse) {
      throw new BadRequestException('Warehouse untuk user login belum terdaftar');
    }

    return ownedWarehouse.id;
  }

  private normalizeAndValidateDetails(
    details: CreateInboundDetailDto[],
  ): NormalizedInboundDetail[] {
    if (!details.length) {
      throw new BadRequestException('At least one detail row is required');
    }

    const seenItemIds = new Set<number>();

    return details.map((rawDetail) => {
      const itemId = this.parseId(rawDetail.itemId, 'Detail itemId');

      if (seenItemIds.has(itemId)) {
        throw new BadRequestException(`Duplicate item in detail: ${itemId}`);
      }
      seenItemIds.add(itemId);

      const batches = this.normalizeAndValidateBatches(rawDetail.batches);
      const qtyFromBatches = batches.reduce((total, batch) => total + batch.qty, 0);
      const detailQty = Number(rawDetail.qty);
      const detailUomInput = Number(rawDetail.uomInput);

      if (!Number.isFinite(detailQty) || detailQty <= 0) {
        throw new BadRequestException(`Detail qty for item ${itemId} must be greater than 0`);
      }

      if (!Number.isInteger(detailUomInput) || detailUomInput < 0) {
        throw new BadRequestException(
          `Detail uomInput for item ${itemId} must be an integer and cannot be negative`,
        );
      }

      if (Math.abs(detailQty - qtyFromBatches) > 0.0001) {
        throw new BadRequestException(
          `Detail qty must equal sum of batch qty for item ${itemId}. Detail qty=${detailQty}, batch total=${qtyFromBatches}`,
        );
      }

      return {
        itemId,
        qty: detailQty,
        uomInput: detailUomInput,
        notes: rawDetail.notes?.trim() || undefined,
        batches,
      };
    });
  }

  private normalizeAndValidateBatches(batches: CreateInboundBatchDto[]): NormalizedInboundBatch[] {
    if (!batches.length) {
      throw new BadRequestException('At least one batch row is required for each detail');
    }

    const seenBatchNumbers = new Set<string>();

    return batches.map((rawBatch) => {
      const batchIn = rawBatch.batchIn.trim();
      if (!batchIn) {
        throw new BadRequestException('Batch number is required');
      }

      const batchKey = batchIn.toLowerCase();
      if (seenBatchNumbers.has(batchKey)) {
        throw new BadRequestException(`Duplicate batch number in one detail: ${batchIn}`);
      }
      seenBatchNumbers.add(batchKey);

      const qty = Number(rawBatch.qty);
      if (!Number.isFinite(qty) || qty <= 0) {
        throw new BadRequestException(`Batch qty must be greater than 0 for batch ${batchIn}`);
      }

      return {
        batchIn,
        qty,
        expiredDate: rawBatch.expiredDate,
        notes: rawBatch.notes?.trim() || undefined,
      };
    });
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
        uom: {
          select: {
            id: true,
          },
        },
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
        },
      ]),
    );
  }

  private async syncInboundInventoryLedger(
    tx: Prisma.TransactionClient,
    inboundId: number,
    actorId?: string | number,
  ) {
    const now = new Date();
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
        warehouse: {
          select: {
            id: true,
          },
        },
        status: true,
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
                batchIn: true,
                qty: true,
                expiredDate: true,
              },
            },
          },
        },
      },
    });

    if (!inbound || inbound.deletedAt || inbound.status !== 'POSTED') {
      return;
    }

    const actorUserId = await this.resolveActorUserId(tx, actorId);

    for (const detail of inbound.details) {
      for (const batch of detail.batches) {
        const batchNumber = String(batch.batchIn ?? '').trim();
        if (!batchNumber) {
          continue;
        }

        const inventoryBatch = await tx.inventoryBatch.upsert({
          where: {
            itemId_batchNumber: {
              itemId: detail.item.id,
              batchNumber,
            },
          },
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

  private async resolveActorUserId(tx: Prisma.TransactionClient, actorId?: string | number) {
    if (actorId === undefined || actorId === null || actorId === '') {
      return undefined;
    }
    const normalizedActorId = this.parseActorId(actorId);

    const actor = await tx.user.findFirst({
      where: {
        id: normalizedActorId,
        deletedAt: null,
      },
      select: { id: true },
    });

    return actor?.id;
  }

  private parseId(value: string | number, fieldLabel: string): number {
    return parseIntStrict(String(value), fieldLabel);
  }

  private parseActorId(value: string | number): number {
    return parseIntStrict(String(value), 'User ID');
  }
}

type NormalizedInboundBatch = {
  batchIn: string;
  qty: number;
  expiredDate?: string;
  notes?: string;
};

type NormalizedInboundDetail = {
  itemId: number;
  qty: number;
  uomInput?: number;
  notes?: string;
  batches: NormalizedInboundBatch[];
};

// Keep parsing centralized to avoid string-vs-number drift.
function parseIntStrict(value: string, fieldLabel: string): number {
  const parsed = Number(String(value ?? '').trim());
  if (!Number.isInteger(parsed)) {
    throw new BadRequestException(`${fieldLabel} is invalid`);
  }
  return parsed;
}
