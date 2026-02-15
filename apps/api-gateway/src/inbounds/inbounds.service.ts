import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInboundBatchDto } from './dto/create-inbound-batch.dto';
import { CreateInboundDetailDto } from './dto/create-inbound-detail.dto';
import { CreateInboundDto } from './dto/create-inbound.dto';
import { QueryInboundDto } from './dto/query-inbound.dto';
import { UpdateInboundDto } from './dto/update-inbound.dto';

@Injectable()
export class InboundsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInboundDto, actorId?: string) {
    await this.ensureSupplierExists(dto.supplierId);
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
          supplierId: dto.supplierId,
          warehouseId: effectiveWarehouseId,
          notes: dto.notes ?? null,
          status: 'POSTED',
          createdBy: actorId ?? null,
          updatedBy: actorId ?? null,
        },
      });

      for (const [index, detail] of detailPayload.entries()) {
        const item = itemMap.get(detail.itemId)!;
        await tx.inboundDetail.create({
          data: {
            inboundId: header.uuid,
            lineNo: index + 1,
            itemId: detail.itemId,
            qty: detail.qty,
            uomInput: detail.uomInput ?? null,
            itemCodeSnapshot: item.code,
            itemNameSnapshot: item.name,
            notes: detail.notes ?? null,
            createdBy: actorId ?? null,
            updatedBy: actorId ?? null,
            batches: {
              create: detail.batches.map((batch, batchIndex) => ({
                lineNo: batchIndex + 1,
                batchIn: batch.batchIn,
                qty: batch.qty,
                expiredDate: batch.expiredDate ? new Date(batch.expiredDate) : null,
                notes: batch.notes ?? null,
                createdBy: actorId ?? null,
                updatedBy: actorId ?? null,
              })),
            },
          },
        });
      }

      return header;
    });

    return this.findOne(created.uuid);
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
      where.supplierId = query.supplierId.trim();
    }

    if (query.warehouseId?.trim()) {
      where.warehouseId = query.warehouseId.trim();
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
          supplier: { select: { uuid: true, code: true, name: true, type: true } },
          warehouse: {
            select: {
              uuid: true,
              name: true,
              locationName: true,
              city: { select: { uuid: true, name: true, postalCode: true } },
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

  async findOne(uuid: string) {
    const item = await this.prisma.inbound.findFirst({
      where: { uuid, deletedAt: null },
      include: {
        supplier: { select: { uuid: true, code: true, name: true, type: true } },
        warehouse: {
          select: {
            uuid: true,
            name: true,
            locationName: true,
            addressDetail: true,
            city: {
              select: {
                uuid: true,
                name: true,
                postalCode: true,
                province: { select: { uuid: true, name: true, isoCode: true } },
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
                uuid: true,
                code: true,
                name: true,
                category: true,
                itemType: true,
                uom: { select: { uuid: true, code: true, name: true, type: true } },
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

  async update(uuid: string, dto: UpdateInboundDto, actorId?: string) {
    const existing = await this.prisma.inbound.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true, transactionNo: true },
    });
    if (!existing) {
      throw new NotFoundException('Inbound not found');
    }

    if (dto.transactionNo && dto.transactionNo !== existing.transactionNo) {
      await this.ensureTransactionNoAvailable(dto.transactionNo, uuid);
    }

    if (dto.supplierId) {
      await this.ensureSupplierExists(dto.supplierId);
    }

    const effectiveWarehouseId = await this.resolveWarehouseForActor(actorId);
    dto.warehouseId = effectiveWarehouseId;
    await this.ensureWarehouseExists(effectiveWarehouseId);

    const detailsProvided = Array.isArray(dto.details);
    let detailPayload: NormalizedInboundDetail[] = [];
    let itemMap: Map<string, { code: string; name: string }> = new Map();

    if (detailsProvided) {
      detailPayload = this.normalizeAndValidateDetails(dto.details as CreateInboundDetailDto[]);
      itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.inbound.update({
        where: { uuid },
        data: {
          transactionNo: dto.transactionNo,
          transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : undefined,
          supplierId: dto.supplierId,
          warehouseId: effectiveWarehouseId,
          notes: dto.notes,
          status: dto.status,
          updatedBy: actorId ?? null,
        },
      });

      if (detailsProvided) {
        const existingDetails = await tx.inboundDetail.findMany({
          where: { inboundId: uuid },
          select: { uuid: true },
        });
        const detailIds = existingDetails.map((row) => row.uuid);

        if (detailIds.length > 0) {
          await tx.inboundDetailBatch.deleteMany({
            where: { inboundDetailId: { in: detailIds } },
          });
        }

        await tx.inboundDetail.deleteMany({ where: { inboundId: uuid } });

        for (const [index, detail] of detailPayload.entries()) {
          const item = itemMap.get(detail.itemId)!;
          await tx.inboundDetail.create({
            data: {
              inboundId: uuid,
              lineNo: index + 1,
              itemId: detail.itemId,
              qty: detail.qty,
              uomInput: detail.uomInput ?? null,
              itemCodeSnapshot: item.code,
              itemNameSnapshot: item.name,
              notes: detail.notes ?? null,
              createdBy: actorId ?? null,
              updatedBy: actorId ?? null,
              batches: {
                create: detail.batches.map((batch, batchIndex) => ({
                  lineNo: batchIndex + 1,
                  batchIn: batch.batchIn,
                  qty: batch.qty,
                  expiredDate: batch.expiredDate ? new Date(batch.expiredDate) : null,
                  notes: batch.notes ?? null,
                  createdBy: actorId ?? null,
                  updatedBy: actorId ?? null,
                })),
              },
            },
          });
        }
      }
    });

    return this.findOne(uuid);
  }

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.inbound.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true },
    });
    if (!existing) {
      throw new NotFoundException('Inbound not found');
    }

    await this.prisma.$transaction([
      this.prisma.inbound.update({
        where: { uuid },
        data: {
          deletedAt: new Date(),
          deletedBy: actorId ?? null,
          status: 'CANCELLED',
          updatedBy: actorId ?? null,
        },
      }),
      this.prisma.inboundDetail.updateMany({
        where: { inboundId: uuid, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedBy: actorId ?? null,
          updatedBy: actorId ?? null,
        },
      }),
      this.prisma.inboundDetailBatch.updateMany({
        where: {
          inboundDetail: { inboundId: uuid },
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
          deletedBy: actorId ?? null,
          updatedBy: actorId ?? null,
        },
      }),
    ]);

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

  private async ensureTransactionNoAvailable(transactionNo: string, exceptUuid?: string) {
    const duplicate = await this.prisma.inbound.findFirst({
      where: {
        transactionNo,
        NOT: exceptUuid ? { uuid: exceptUuid } : undefined,
      },
      select: { uuid: true, deletedAt: true },
    });

    if (duplicate) {
      throwDuplicate({
        fieldLabel: 'Inbound transaction number',
        value: transactionNo,
        isSoftDeleted: Boolean(duplicate.deletedAt),
      });
    }
  }

  private async ensureSupplierExists(supplierId: string) {
    const supplier = await this.prisma.masterDataContact.findFirst({
      where: {
        uuid: supplierId,
        type: 'supplier',
        deletedAt: null,
      },
      select: { uuid: true },
    });

    if (!supplier) {
      throw new BadRequestException('Supplier not found');
    }
  }

  private async ensureWarehouseExists(warehouseId: string) {
    const warehouse = await this.prisma.masterDataWarehouse.findFirst({
      where: { uuid: warehouseId, deletedAt: null },
      select: { uuid: true },
    });

    if (!warehouse) {
      throw new BadRequestException('Warehouse not found');
    }
  }

  private async resolveWarehouseForActor(actorId?: string) {
    if (!actorId) {
      throw new BadRequestException('User login tidak ditemukan');
    }

    const actor = await this.prisma.user.findFirst({
      where: {
        uuid: actorId,
        deletedAt: null,
      },
      select: {
        warehouseId: true,
      },
    });
    const mappedWarehouseId = String(actor?.warehouseId ?? '').trim();
    if (mappedWarehouseId && mappedWarehouseId !== 'null' && mappedWarehouseId !== 'undefined') {
      return mappedWarehouseId;
    }

    const ownedWarehouse = await this.prisma.masterDataWarehouse.findFirst({
      where: {
        deletedAt: null,
        createdBy: actorId,
      },
      select: { uuid: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    if (!ownedWarehouse) {
      throw new BadRequestException('Warehouse untuk user login belum terdaftar');
    }

    return ownedWarehouse.uuid;
  }

  private normalizeAndValidateDetails(
    details: CreateInboundDetailDto[],
  ): NormalizedInboundDetail[] {
    if (!details.length) {
      throw new BadRequestException('At least one detail row is required');
    }

    const seenItemIds = new Set<string>();

    return details.map((rawDetail) => {
      const itemId = rawDetail.itemId.trim();
      if (!itemId) {
        throw new BadRequestException('Detail itemId is required');
      }

      if (seenItemIds.has(itemId)) {
        throw new BadRequestException(`Duplicate item in detail: ${itemId}`);
      }
      seenItemIds.add(itemId);

      const batches = this.normalizeAndValidateBatches(rawDetail.batches);
      const qtyFromBatches = batches.reduce((total, batch) => total + batch.qty, 0);
      const detailQty = Number(rawDetail.qty);

      if (Math.abs(detailQty - qtyFromBatches) > 0.0001) {
        throw new BadRequestException(
          `Detail qty must equal sum of batch qty for item ${itemId}. Detail qty=${detailQty}, batch total=${qtyFromBatches}`,
        );
      }

      return {
        itemId,
        qty: detailQty,
        uomInput: rawDetail.uomInput == null ? undefined : Number(rawDetail.uomInput),
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

      return {
        batchIn,
        qty: Number(rawBatch.qty),
        expiredDate: rawBatch.expiredDate,
        notes: rawBatch.notes?.trim() || undefined,
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
      },
    });

    if (items.length !== uniqueItemIds.length) {
      throw new BadRequestException('One or more items are not found or inactive');
    }

    return new Map(items.map((item) => [item.uuid, item]));
  }
}

type NormalizedInboundBatch = {
  batchIn: string;
  qty: number;
  expiredDate?: string;
  notes?: string;
};

type NormalizedInboundDetail = {
  itemId: string;
  qty: number;
  uomInput?: number;
  notes?: string;
  batches: NormalizedInboundBatch[];
};
