import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpItemDto } from './dto/create-erp-item.dto';
import { QueryErpItemDto } from './dto/query-erp-item.dto';
import { UpdateErpItemDto } from './dto/update-erp-item.dto';

const ITEM_INCLUDE = {
  category: { select: { id: true, code: true, name: true } },
  baseUnit: { select: { id: true, code: true, name: true } },
} as const;

@Injectable()
export class ErpItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateErpItemDto, actorId?: string) {
    const existing = await this.prisma.erpItem.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Item code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    let created;
    try {
      created = await this.prisma.erpItem.create({
        data: {
          code: dto.code,
          name: dto.name,
          type: dto.itemType,
          categoryId: BigInt(dto.categoryId),
          baseUnitId: BigInt(dto.unitId),
          barcode: dto.barcode ?? null,
          standardCost: dto.standardCost ? new Prisma.Decimal(dto.standardCost) : undefined,
          purchasePrice: dto.purchasePrice ? new Prisma.Decimal(dto.purchasePrice) : undefined,
          salePrice: dto.salePrice ? new Prisma.Decimal(dto.salePrice) : undefined,
          minStock: dto.minStock ? new Prisma.Decimal(dto.minStock) : undefined,
          maxStock: dto.maxStock ? new Prisma.Decimal(dto.maxStock) : undefined,
          reorderQty: dto.reorderQty ? new Prisma.Decimal(dto.reorderQty) : undefined,
          tracksSerial: dto.tracksSerial ?? false,
          tracksBatch: dto.tracksBatch ?? false,
          tracksBin: dto.tracksBin ?? false,
          inventoryAccountId: dto.inventoryAccountId ? BigInt(dto.inventoryAccountId) : null,
          salesAccountId: dto.salesAccountId ? BigInt(dto.salesAccountId) : null,
          cogsAccountId: dto.cogsAccountId ? BigInt(dto.cogsAccountId) : null,
          isActive: dto.isActive ?? true,
          createdById: actorId ? BigInt(actorId) : null,
          updatedById: actorId ? BigInt(actorId) : null,
        },
        include: ITEM_INCLUDE,
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'md_items_code_key'])) {
        throwDuplicate({ fieldLabel: 'Item code', value: dto.code });
      }
      throw error;
    }

    return { success: true, data: created };
  }

  async findAll(query: QueryErpItemDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ErpItemWhereInput = { deletedAt: null };

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { barcode: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (query.itemType !== undefined) {
      where.type = query.itemType;
    }

    if (query.categoryId !== undefined) {
      where.categoryId = BigInt(query.categoryId);
    }

    if (query.unitId !== undefined) {
      where.baseUnitId = BigInt(query.unitId);
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.erpItem.findMany({
        where,
        include: ITEM_INCLUDE,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.erpItem.count({ where }),
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

  async findOne(id: bigint) {
    const item = await this.prisma.erpItem.findFirst({
      where: { id, deletedAt: null },
      include: ITEM_INCLUDE,
    });
    if (!item) {
      throw new NotFoundException('ERP item not found');
    }
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateErpItemDto, actorId?: string) {
    const existing = await this.prisma.erpItem.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('ERP item not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.erpItem.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Item code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    let updated;
    try {
      updated = await this.prisma.erpItem.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          type: dto.itemType,
          categoryId: dto.categoryId ? BigInt(dto.categoryId) : undefined,
          baseUnitId: dto.unitId ? BigInt(dto.unitId) : undefined,
          barcode: dto.barcode,
          standardCost: dto.standardCost ? new Prisma.Decimal(dto.standardCost) : undefined,
          purchasePrice: dto.purchasePrice ? new Prisma.Decimal(dto.purchasePrice) : undefined,
          salePrice: dto.salePrice ? new Prisma.Decimal(dto.salePrice) : undefined,
          minStock: dto.minStock ? new Prisma.Decimal(dto.minStock) : undefined,
          maxStock: dto.maxStock ? new Prisma.Decimal(dto.maxStock) : undefined,
          reorderQty: dto.reorderQty ? new Prisma.Decimal(dto.reorderQty) : undefined,
          tracksSerial: dto.tracksSerial,
          tracksBatch: dto.tracksBatch,
          tracksBin: dto.tracksBin,
          inventoryAccountId: dto.inventoryAccountId !== undefined
            ? (dto.inventoryAccountId ? BigInt(dto.inventoryAccountId) : null)
            : undefined,
          salesAccountId: dto.salesAccountId !== undefined
            ? (dto.salesAccountId ? BigInt(dto.salesAccountId) : null)
            : undefined,
          cogsAccountId: dto.cogsAccountId !== undefined
            ? (dto.cogsAccountId ? BigInt(dto.cogsAccountId) : null)
            : undefined,
          isActive: dto.isActive,
          updatedById: actorId ? BigInt(actorId) : null,
        },
        include: ITEM_INCLUDE,
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'md_items_code_key'])) {
        throwDuplicate({ fieldLabel: 'Item code', value: dto.code ?? existing.code });
      }
      throw error;
    }

    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.erpItem.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('ERP item not found');
    }

    await this.prisma.erpItem.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });

    return { success: true, message: 'ERP item deleted' };
  }
}
