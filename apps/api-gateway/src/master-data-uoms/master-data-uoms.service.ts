import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { CreateMasterDataUomDto } from './dto/create-master-data-uom.dto';
import { QueryMasterDataUomDto } from './dto/query-master-data-uom.dto';
import { UpdateMasterDataUomDto } from './dto/update-master-data-uom.dto';

@Injectable()
export class MasterDataUomsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataUomDto, actorId?: string) {
    const existing = await this.prisma.masterDataUom.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'UOM code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    let created;
    try {
      created = await this.prisma.masterDataUom.create({
        data: {
          code: dto.code,
          name: dto.name,
          type: dto.type,
          createdBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'm1_uom_code_key'])) {
        throwDuplicate({ fieldLabel: 'UOM code', value: dto.code });
      }
      throw error;
    }

    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataUomDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MasterDataUomWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { type: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.masterDataUom.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.masterDataUom.count({ where }),
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
    const item = await this.prisma.masterDataUom.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Master data UOM not found');
    }
    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateMasterDataUomDto, actorId?: string) {
    const existing = await this.prisma.masterDataUom.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Master data UOM not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.masterDataUom.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'UOM code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    let updated;
    try {
      updated = await this.prisma.masterDataUom.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          type: dto.type,
          updatedBy: toAuditUserId(actorId),
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'm1_uom_code_key'])) {
        throwDuplicate({ fieldLabel: 'UOM code', value: dto.code ?? existing.code });
      }
      throw error;
    }

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string) {
    const existing = await this.prisma.masterDataUom.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data UOM not found');
    }

    await this.prisma.masterDataUom.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: toAuditUserId(actorId),
      },
    });

    return { success: true, message: 'Master data UOM deleted' };
  }
}
