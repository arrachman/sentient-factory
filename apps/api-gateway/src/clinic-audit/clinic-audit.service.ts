import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type QueryAuditDto = {
  page?: number;
  limit?: number;
  entityType?: string;
  action?: string;
  userId?: number;
};

@Injectable()
export class ClinicAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryAuditDto) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 50, 200);
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {
      entityType: { startsWith: 'clinic.' }, // hanya audit clinic-* (bukan ERP)
    };
    if (query.entityType) where.entityType = query.entityType;
    if (query.action) where.action = query.action;
    if (query.userId) where.userId = Number(query.userId);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
