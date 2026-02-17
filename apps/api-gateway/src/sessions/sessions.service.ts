import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { QuerySessionDto } from './dto/query-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSessionDto, actorId?: string) {
    const userId = this.parseUserId(dto.userId);
    await this.ensureUserExists(userId);

    const expiresAt = this.parseExpiresAt(dto.expiresAt);

    let created;
    try {
      created = await this.prisma.session.create({
        data: {
          userId,
          token: dto.token,
          expiresAt,
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
    } catch (error) {
      if (isUniqueViolation(error, ['token'])) {
        throwDuplicate({ fieldLabel: 'Session token', value: dto.token });
      }
      throw error;
    }

    return { success: true, data: created };
  }

  async findAll(query: QuerySessionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.SessionWhereInput = {
      deletedAt: null,
    };

    if (query.userId?.trim()) {
      where.userId = this.parseUserId(query.userId);
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { token: { contains: q, mode: 'insensitive' } },
        { ipAddress: { contains: q, mode: 'insensitive' } },
        { userAgent: { contains: q, mode: 'insensitive' } },
        { user: { email: { contains: q, mode: 'insensitive' } } },
        { user: { username: { contains: q, mode: 'insensitive' } } },
        { user: { fullName: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.session.findMany({
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
      this.prisma.session.count({ where }),
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
    const item = await this.prisma.session.findFirst({
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
      throw new NotFoundException('Session not found');
    }

    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateSessionDto, actorId?: string) {
    const existing = await this.prisma.session.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, token: true },
    });
    if (!existing) {
      throw new NotFoundException('Session not found');
    }

    const nextUserId = dto.userId ? this.parseUserId(dto.userId) : undefined;
    if (nextUserId !== undefined) {
      await this.ensureUserExists(nextUserId);
    }

    const nextExpiresAt = dto.expiresAt ? this.parseExpiresAt(dto.expiresAt) : undefined;

    let updated;
    try {
      updated = await this.prisma.session.update({
        where: { id },
        data: {
          userId: nextUserId,
          token: dto.token,
          expiresAt: nextExpiresAt,
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
    } catch (error) {
      if (isUniqueViolation(error, ['token'])) {
        throwDuplicate({ fieldLabel: 'Session token', value: dto.token ?? existing.token });
      }
      throw error;
    }

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string) {
    const existing = await this.prisma.session.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Session not found');
    }

    await this.prisma.session.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: toAuditUserId(actorId),
      },
    });

    return {
      success: true,
      message: 'Session deleted',
    };
  }

  private parseUserId(userId: string): number {
    const parsed = Number(userId);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException('User ID is invalid');
    }
    return parsed;
  }

  private parseExpiresAt(expiresAt: string): Date {
    const parsed = new Date(expiresAt);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('expiresAt must be a valid date-time');
    }
    return parsed;
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
  }
}
