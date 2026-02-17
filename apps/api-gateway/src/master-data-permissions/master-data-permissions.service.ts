import { Injectable, NotFoundException } from '@nestjs/common';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataPermissionDto } from './dto/create-master-data-permission.dto';
import { QueryMasterDataPermissionDto } from './dto/query-master-data-permission.dto';
import { UpdateMasterDataPermissionDto } from './dto/update-master-data-permission.dto';

@Injectable()
export class MasterDataPermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataPermissionDto, actorId?: string | number) {
    const normalizedName = dto.name.trim();
    const existing = await this.prisma.permission.findFirst({
      where: { name: normalizedName },
      select: { id: true, deletedAt: true },
    });

    if (existing) {
      throwDuplicate({
        fieldLabel: 'Permission name',
        value: normalizedName,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const created = await this.prisma.permission.create({
      data: {
        name: normalizedName,
        module: dto.module.trim(),
        action: dto.action.trim(),
        description: dto.description?.trim() || null,
        createdBy: this.toActor(actorId),
        updatedBy: this.toActor(actorId),
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataPermissionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const q = query.search?.trim();

    const where = {
      deletedAt: null as Date | null,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' as const } },
              { module: { contains: q, mode: 'insensitive' as const } },
              { action: { contains: q, mode: 'insensitive' as const } },
              { description: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.permission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.permission.count({ where }),
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
    const item = await this.prisma.permission.findFirst({
      where: { id, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException('Master data permission not found');
    }

    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateMasterDataPermissionDto, actorId?: string | number) {
    const existing = await this.prisma.permission.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, name: true },
    });

    if (!existing) {
      throw new NotFoundException('Master data permission not found');
    }

    const nextName = dto.name?.trim();
    if (nextName && nextName !== existing.name) {
      const duplicate = await this.prisma.permission.findFirst({
        where: { name: nextName, NOT: { id } },
        select: { id: true, deletedAt: true },
      });

      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Permission name',
          value: nextName,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    const updated = await this.prisma.permission.update({
      where: { id },
      data: {
        name: nextName,
        module: dto.module?.trim(),
        action: dto.action?.trim(),
        description: dto.description?.trim() ?? dto.description,
        updatedBy: this.toActor(actorId),
      },
    });

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string | number) {
    const existing = await this.prisma.permission.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Master data permission not found');
    }

    await this.prisma.permission.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: this.toActor(actorId),
        updatedBy: this.toActor(actorId),
      },
    });

    return { success: true, message: 'Master data permission deleted' };
  }

  private toActor(actorId?: string | number): number | null {
    return toAuditUserId(actorId);
  }
}
