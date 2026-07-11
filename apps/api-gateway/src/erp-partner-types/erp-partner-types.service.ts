import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { BulkErpPartnerTypeDto, BulkStatusErpPartnerTypeDto } from './dto/bulk-erp-partner-type.dto';
import { CreateErpPartnerTypeDto } from './dto/create-erp-partner-type.dto';
import { QueryErpPartnerTypeDto } from './dto/query-erp-partner-type.dto';
import { UpdateErpPartnerTypeDto } from './dto/update-erp-partner-type.dto';

const PROTECTED_CODES = ['CUST', 'SUP', 'SLS'];

@Injectable()
export class ErpPartnerTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateErpPartnerTypeDto, actorId?: string) {
    const existing = await this.prisma.erpPartnerType.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Partner type code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const actorBigInt = actorId ? BigInt(actorId) : null;

    let created;
    try {
      created = await this.prisma.erpPartnerType.create({
        data: {
          code: dto.code,
          name: dto.name,
          kind: dto.kind,
          isActive: dto.isActive ?? true,
          createdById: actorBigInt,
          updatedById: actorBigInt,
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'md_partner_types_code_key'])) {
        throwDuplicate({ fieldLabel: 'Partner type code', value: dto.code });
      }
      throw error;
    }

    return { success: true, data: created };
  }

  async findAll(query: QueryErpPartnerTypeDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ErpPartnerTypeWhereInput = { deletedAt: null };

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { equals: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (query.kind !== undefined) {
      where.kind = query.kind;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.erpPartnerType.findMany({
        where,
        orderBy: [{ [query.sortBy ?? 'createdAt']: query.sortDir ?? 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.erpPartnerType.count({ where }),
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
    const item = await this.prisma.erpPartnerType.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('ERP Partner Type not found');
    }
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateErpPartnerTypeDto, actorId?: string) {
    const existing = await this.prisma.erpPartnerType.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('ERP Partner Type not found');
    }

    if (PROTECTED_CODES.includes(existing.code) && dto.code && dto.code !== existing.code) {
      throw new BadRequestException(`Cannot change the code of a protected partner type.`);
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.erpPartnerType.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Partner type code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    const actorBigInt = actorId ? BigInt(actorId) : null;

    let updated;
    try {
      updated = await this.prisma.erpPartnerType.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          kind: dto.kind,
          isActive: dto.isActive,
          updatedById: actorBigInt,
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'md_partner_types_code_key'])) {
        throwDuplicate({ fieldLabel: 'Partner type code', value: dto.code ?? existing.code });
      }
      throw error;
    }

    return { success: true, data: updated };
  }

  async bulkUpdateStatus(dto: BulkStatusErpPartnerTypeDto, actorId?: string) {
    const ids = dto.ids.map((id) => BigInt(id));
    const actorBigInt = actorId ? BigInt(actorId) : null;
    const { count } = await this.prisma.erpPartnerType.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { isActive: dto.isActive, updatedById: actorBigInt, updatedAt: new Date() },
    });
    return { success: true, affected: count };
  }

  async bulkDelete(dto: BulkErpPartnerTypeDto, actorId?: string) {
    const ids = dto.ids.map((id) => BigInt(id));

    // Exclude protected types from deletion
    const toDelete = await this.prisma.erpPartnerType.findMany({
      where: {
        id: { in: ids },
        code: { notIn: PROTECTED_CODES },
        deletedAt: null,
      },
      select: { id: true }
    });

    const deleteIds = toDelete.map(t => t.id);

    if (deleteIds.length === 0) {
      return { success: true, affected: 0 };
    }

    await this.assertNoPartnerUsage(deleteIds);
    const actorBigInt = actorId ? BigInt(actorId) : null;
    const { count } = await this.prisma.erpPartnerType.updateMany({
      where: { id: { in: deleteIds } },
      data: { deletedAt: new Date(), updatedById: actorBigInt, updatedAt: new Date() },
    });
    return { success: true, affected: count };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.erpPartnerType.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('ERP Partner Type not found');
    }

    if (PROTECTED_CODES.includes(existing.code)) {
      throw new BadRequestException('Cannot delete a protected partner type.');
    }

    await this.assertNoPartnerUsage([id]);
    const actorBigInt = actorId ? BigInt(actorId) : null;

    await this.prisma.erpPartnerType.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedById: actorBigInt,
      },
    });

    return { success: true, message: 'ERP Partner Type deleted' };
  }

  private async assertNoPartnerUsage(ids: bigint[]) {
    const used = await this.prisma.erpPartner.count({
      where: { partnerTypeId: { in: ids }, deletedAt: null },
    });
    if (used > 0) {
      throw new BadRequestException('Partner type is still used by active partners');
    }
  }
}
