import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataItemDto } from './dto/create-master-data-item.dto';
import { QueryMasterDataItemDto } from './dto/query-master-data-item.dto';
import { UpdateMasterDataItemDto } from './dto/update-master-data-item.dto';

@Injectable()
export class MasterDataItemsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataItemDto, actorId?: string) {
    const existing = await this.prisma.masterDataItem.findFirst({
      where: { code: dto.code },
      select: { uuid: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Item code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const uom = await this.prisma.masterDataUom.findFirst({
      where: { uuid: dto.uomId, deletedAt: null },
      select: { uuid: true },
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
          uomId: dto.uomId,
          itemType: dto.itemType,
          isActive: dto.isActive ?? true,
          createdBy: actorId ?? null,
          updatedBy: actorId ?? null,
        },
        include: {
          uom: { select: { uuid: true, code: true, name: true, type: true } },
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
          uom: { select: { uuid: true, code: true, name: true, type: true } },
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

  async findOne(uuid: string) {
    const item = await this.prisma.masterDataItem.findFirst({
      where: { uuid, deletedAt: null },
      include: {
        uom: { select: { uuid: true, code: true, name: true, type: true } },
      },
    });
    if (!item) {
      throw new NotFoundException('Master data item not found');
    }
    return { success: true, data: item };
  }

  async update(uuid: string, dto: UpdateMasterDataItemDto, actorId?: string) {
    const existing = await this.prisma.masterDataItem.findFirst({
      where: { uuid, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Master data item not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.masterDataItem.findFirst({
        where: { code: dto.code, NOT: { uuid } },
        select: { uuid: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Item code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    if (dto.uomId) {
      const uom = await this.prisma.masterDataUom.findFirst({
        where: { uuid: dto.uomId, deletedAt: null },
        select: { uuid: true },
      });
      if (!uom) {
        throw new BadRequestException('UOM not found or inactive');
      }
    }

    let updated;
    try {
      updated = await this.prisma.masterDataItem.update({
        where: { uuid },
        data: {
          code: dto.code,
          name: dto.name,
          category: dto.category,
          uomId: dto.uomId,
          itemType: dto.itemType,
          isActive: dto.isActive,
          updatedBy: actorId ?? null,
        },
        include: {
          uom: { select: { uuid: true, code: true, name: true, type: true } },
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

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.masterDataItem.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data item not found');
    }

    await this.prisma.masterDataItem.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
        deletedBy: actorId ?? null,
      },
    });

    return { success: true, message: 'Master data item deleted' };
  }
}
