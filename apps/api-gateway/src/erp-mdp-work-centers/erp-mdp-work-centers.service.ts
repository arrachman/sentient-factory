import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkCenterDto } from './dto/create-work-center.dto';
import { QueryWorkCenterDto } from './dto/query-work-center.dto';
import { UpdateWorkCenterDto } from './dto/update-work-center.dto';

@Injectable()
export class ErpMdpWorkCentersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWorkCenterDto, actorId?: string) {
    const existing = await this.prisma.mdpWorkCenter.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Work center code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpWorkCenter.create({
        data: {
          code: dto.code,
          name: dto.name,
          assetId: dto.assetId ? BigInt(dto.assetId) : null,
          idealCycleSeconds: dto.idealCycleSeconds ?? null,
          isActive: dto.isActive ?? true,
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'eam_work_centers_code_key'])) {
        throwDuplicate({ fieldLabel: 'Work center code', value: dto.code });
      }
      throw error;
    }
  }

  async findAll(query: QueryWorkCenterDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpWorkCenterWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { equals: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpWorkCenter.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpWorkCenter.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpWorkCenter.findFirst({ where: { id, deletedAt: null } });
    if (!item) throw new NotFoundException('Work center not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateWorkCenterDto, actorId?: string) {
    const existing = await this.prisma.mdpWorkCenter.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Work center not found');

    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpWorkCenter.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup) {
        throwDuplicate({
          fieldLabel: 'Work center code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
      }
    }

    const actor = actorId ? BigInt(actorId) : null;
    try {
      const updated = await this.prisma.mdpWorkCenter.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          assetId: dto.assetId !== undefined ? (dto.assetId ? BigInt(dto.assetId) : null) : undefined,
          idealCycleSeconds: dto.idealCycleSeconds,
          isActive: dto.isActive,
          updatedById: actor,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'eam_work_centers_code_key'])) {
        throwDuplicate({ fieldLabel: 'Work center code', value: dto.code ?? existing.code });
      }
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpWorkCenter.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Work center not found');
    await this.prisma.mdpWorkCenter.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Work center deleted' };
  }
}
