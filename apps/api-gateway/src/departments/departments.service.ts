import { Injectable, NotFoundException } from '@nestjs/common';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { QueryDepartmentDto } from './dto/query-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDepartmentDto, actorId?: string | number) {
    const existing = await this.prisma.department.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });

    if (existing) {
      throwDuplicate({
        fieldLabel: 'Department code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const created = await this.prisma.department.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description ?? null,
        parentId: dto.parentId ?? null,
        createdBy: this.toActor(actorId),
        updatedBy: this.toActor(actorId),
      },
      include: {
        parent: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryDepartmentDto) {
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
      this.prisma.department.findMany({
        where,
        include: {
          parent: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.department.count({ where }),
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
    const item = await this.prisma.department.findFirst({
      where: { id, deletedAt: null },
      include: {
        parent: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Department not found');
    }

    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateDepartmentDto, actorId?: string | number) {
    const existing = await this.prisma.department.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, code: true },
    });

    if (!existing) {
      throw new NotFoundException('Department not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.department.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Department code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    const updated = await this.prisma.department.update({
      where: { id },
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId,
        updatedBy: this.toActor(actorId),
      },
      include: {
        parent: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string | number) {
    const existing = await this.prisma.department.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Department not found');
    }

    await this.prisma.department.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: this.toActor(actorId),
        updatedBy: this.toActor(actorId),
      },
    });

    return { success: true, message: 'Department deleted' };
  }

  private toActor(actorId?: string | number): number | null {
    return toAuditUserId(actorId);
  }

  private async ensureParentExists(parentId: number) {
    const parent = await this.prisma.department.findFirst({
      where: { id: parentId, deletedAt: null },
      select: { id: true },
    });

    if (!parent) {
      throw new NotFoundException('Parent department not found');
    }
  }
}
