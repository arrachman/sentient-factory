import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWmsHandlingUnitDto } from './dto/create-wms-handling-unit.dto';
import { QueryWmsHandlingUnitDto } from './dto/query-wms-handling-unit.dto';
import { UpdateWmsHandlingUnitDto } from './dto/update-wms-handling-unit.dto';

const CODE_TARGETS = ['code', 'wms_handling_units_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpWmsHandlingUnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWmsHandlingUnitDto, actorId?: string) {
    const existing = await this.prisma.mdpWmsHandlingUnit.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Handling unit code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpWmsHandlingUnit.create({
        data: {
          code: dto.code,
          status: dto.status,
          currentBinId: toBig(dto.currentBinId),
          notes: dto.notes,
          isActive: dto.isActive ?? true,
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Handling unit code', value: dto.code });
      throw error;
    }
  }

  async findAll(query: QueryWmsHandlingUnitDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpWmsHandlingUnitWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { notes: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpWmsHandlingUnit.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpWmsHandlingUnit.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpWmsHandlingUnit.findFirst({ where: { id, deletedAt: null } });
    if (!item) throw new NotFoundException('Handling unit not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateWmsHandlingUnitDto, actorId?: string) {
    const existing = await this.prisma.mdpWmsHandlingUnit.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Handling unit not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpWmsHandlingUnit.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Handling unit code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpWmsHandlingUnit.update({
        where: { id },
        data: {
          code: dto.code,
          status: dto.status,
          currentBinId: dto.currentBinId !== undefined ? toBig(dto.currentBinId) : undefined,
          notes: dto.notes,
          isActive: dto.isActive,
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Handling unit code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpWmsHandlingUnit.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Handling unit not found');
    await this.prisma.mdpWmsHandlingUnit.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Handling unit deleted' };
  }
}
