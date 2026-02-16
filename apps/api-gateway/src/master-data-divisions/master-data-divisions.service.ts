import { Injectable, NotFoundException } from '@nestjs/common';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataDivisionDto } from './dto/create-master-data-division.dto';
import { QueryMasterDataDivisionDto } from './dto/query-master-data-division.dto';
import { UpdateMasterDataDivisionDto } from './dto/update-master-data-division.dto';

@Injectable()
export class MasterDataDivisionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataDivisionDto, actorId?: string | number) {
    const existing = await this.prisma.masterDataDivision.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });

    if (existing) {
      throwDuplicate({
        fieldLabel: 'Division code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const created = await this.prisma.masterDataDivision.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description ?? null,
        isActive: dto.isActive,
        createdBy: this.toActor(actorId),
        updatedBy: this.toActor(actorId),
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataDivisionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null as Date | null,
      ...(query.search?.trim()
        ? {
            OR: [
              { code: { contains: query.search.trim(), mode: 'insensitive' as const } },
              { name: { contains: query.search.trim(), mode: 'insensitive' as const } },
              { description: { contains: query.search.trim(), mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.masterDataDivision.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.masterDataDivision.count({ where }),
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
    const item = await this.prisma.masterDataDivision.findFirst({
      where: { id, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException('Master data division not found');
    }

    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateMasterDataDivisionDto, actorId?: string | number) {
    const existing = await this.prisma.masterDataDivision.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, code: true },
    });

    if (!existing) {
      throw new NotFoundException('Master data division not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.masterDataDivision.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Division code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    const updated = await this.prisma.masterDataDivision.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive,
        updatedBy: this.toActor(actorId),
      },
    });

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string | number) {
    const existing = await this.prisma.masterDataDivision.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Master data division not found');
    }

    await this.prisma.masterDataDivision.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: this.toActor(actorId),
        updatedBy: this.toActor(actorId),
      },
    });

    return { success: true, message: 'Master data division deleted' };
  }

  private toActor(actorId?: string | number): number | null {
    return toAuditUserId(actorId);
  }
}
