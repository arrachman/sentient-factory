import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAuditLogDto, actorId?: string) {
    if (dto.userId) {
      await this.ensureUserExists(dto.userId);
    }

    const created = await this.prisma.auditLog.create({
      data: {
        userId: dto.userId ?? null,
        action: dto.action,
        entityType: dto.entityType,
        entityId: dto.entityId ?? null,
        oldData: this.normalizeJsonInput(dto.oldData),
        newData: this.normalizeJsonInput(dto.newData),
        ipAddress: dto.ipAddress ?? null,
        userAgent: dto.userAgent ?? null,
        createdBy: toAuditUserId(actorId),
        updatedBy: toAuditUserId(actorId),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    return { success: true, data: this.serializeItem(created) };
  }

  async findAll(query: QueryAuditLogDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {
      deletedAt: null,
    };

    if (query.userId) {
      where.userId = query.userId;
    }
    if (query.action?.trim()) {
      where.action = { contains: query.action.trim(), mode: 'insensitive' };
    }
    if (query.entityType?.trim()) {
      where.entityType = { contains: query.entityType.trim(), mode: 'insensitive' };
    }
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { action: { contains: q, mode: 'insensitive' } },
        { entityType: { contains: q, mode: 'insensitive' } },
        { entityId: { contains: q, mode: 'insensitive' } },
        { ipAddress: { contains: q, mode: 'insensitive' } },
        { userAgent: { contains: q, mode: 'insensitive' } },
        { user: { is: { email: { contains: q, mode: 'insensitive' } } } },
        { user: { is: { username: { contains: q, mode: 'insensitive' } } } },
        { user: { is: { fullName: { contains: q, mode: 'insensitive' } } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              fullName: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      success: true,
      data: items.map((item) => this.serializeItem(item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: number) {
    const item = await this.prisma.auditLog.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
    if (!item) {
      throw new NotFoundException('Audit log not found');
    }
    return { success: true, data: this.serializeItem(item) };
  }

  async update(id: number, dto: UpdateAuditLogDto, actorId?: string) {
    const existing = await this.prisma.auditLog.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Audit log not found');
    }

    if (dto.userId) {
      await this.ensureUserExists(dto.userId);
    }

    const updated = await this.prisma.auditLog.update({
      where: { id },
      data: {
        userId: dto.userId,
        action: dto.action,
        entityType: dto.entityType,
        entityId: dto.entityId,
        oldData: this.normalizeJsonInput(dto.oldData),
        newData: this.normalizeJsonInput(dto.newData),
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
        updatedBy: toAuditUserId(actorId),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    return { success: true, data: this.serializeItem(updated) };
  }

  async remove(id: number, actorId?: string) {
    const existing = await this.prisma.auditLog.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Audit log not found');
    }

    await this.prisma.auditLog.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: toAuditUserId(actorId),
        updatedBy: toAuditUserId(actorId),
      },
    });

    return { success: true, message: 'Audit log deleted' };
  }

  private async ensureUserExists(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  private normalizeJsonInput(value: unknown) {
    if (value === undefined) {
      return undefined;
    }
    if (value === null) {
      return Prisma.DbNull;
    }
    return value as Prisma.InputJsonValue;
  }

  private serializeItem(item: {
    user?: {
      fullName?: string | null;
      username?: string | null;
      email?: string | null;
    } | null;
    [key: string]: unknown;
  }) {
    return {
      ...item,
      userName: item.user?.fullName ?? item.user?.username ?? null,
      userEmail: item.user?.email ?? null,
    };
  }
}
