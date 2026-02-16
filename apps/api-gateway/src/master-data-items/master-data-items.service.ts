import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { CreateMasterDataItemDto } from './dto/create-master-data-item.dto';
import { QueryMasterDataItemDto } from './dto/query-master-data-item.dto';
import { UpdateMasterDataItemDto } from './dto/update-master-data-item.dto';

@Injectable()
export class MasterDataItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataItemDto, actorId?: string) {
    const uomId = Number(dto.uomId);
    if (!Number.isInteger(uomId)) {
      throw new BadRequestException('UOM ID is invalid');
    }

    const existing = await this.prisma.masterDataItem.findFirst({
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

    const uom = await this.prisma.masterDataUom.findFirst({
      where: { id: uomId, deletedAt: null },
      select: { id: true },
    });
    if (!uom) {
      throw new BadRequestException('UOM not found or inactive');
    }

    let created;
    try {
      created = await this.prisma.masterDataItem.create({
        data: {
          code: dto.code,
          name: dto.name,
          category: dto.category,
          uomId,
          itemType: dto.itemType,
          isActive: dto.isActive ?? true,
          createdBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
        include: {
          uom: { select: { id: true, code: true, name: true, type: true } },
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'm1_item_code_key'])) {
        throwDuplicate({ fieldLabel: 'Item code', value: dto.code });
      }
      throw error;
    }

    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataItemDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MasterDataItemWhereInput = {
      deletedAt: null,
    };

    if (query.category?.trim()) {
      where.category = { equals: query.category.trim(), mode: 'insensitive' };
    }

    if (query.itemType?.trim()) {
      where.itemType = { equals: query.itemType.trim(), mode: 'insensitive' };
    }

    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
        { itemType: { contains: q, mode: 'insensitive' } },
        { uom: { code: { contains: q, mode: 'insensitive' } } },
        { uom: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.masterDataItem.findMany({
        where,
        include: {
          uom: { select: { id: true, code: true, name: true, type: true } },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.masterDataItem.count({ where }),
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
    const item = await this.prisma.masterDataItem.findFirst({
      where: { id, deletedAt: null },
      include: {
        uom: { select: { id: true, code: true, name: true, type: true } },
      },
    });
    if (!item) {
      throw new NotFoundException('Master data item not found');
    }
    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateMasterDataItemDto, actorId?: string) {
    const existing = await this.prisma.masterDataItem.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Master data item not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.masterDataItem.findFirst({
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

    const nextUomId = dto.uomId ? Number(dto.uomId) : undefined;
    if (dto.uomId) {
      if (!Number.isInteger(nextUomId)) {
        throw new BadRequestException('UOM ID is invalid');
      }
      const uom = await this.prisma.masterDataUom.findFirst({
        where: { id: nextUomId, deletedAt: null },
        select: { id: true },
      });
      if (!uom) {
        throw new BadRequestException('UOM not found or inactive');
      }
    }

    let updated;
    try {
      updated = await this.prisma.masterDataItem.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          category: dto.category,
          uomId: nextUomId,
          itemType: dto.itemType,
          isActive: dto.isActive,
          updatedBy: toAuditUserId(actorId),
        },
        include: {
          uom: { select: { id: true, code: true, name: true, type: true } },
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'm1_item_code_key'])) {
        throwDuplicate({ fieldLabel: 'Item code', value: dto.code ?? existing.code });
      }
      throw error;
    }

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string) {
    const existing = await this.prisma.masterDataItem.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data item not found');
    }

    await this.prisma.masterDataItem.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: toAuditUserId(actorId),
      },
    });

    return { success: true, message: 'Master data item deleted' };
  }
}
