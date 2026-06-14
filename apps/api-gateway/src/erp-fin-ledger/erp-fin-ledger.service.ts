import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryLedgerDto } from './dto/query-ledger.dto';

@Injectable()
export class ErpFinLedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryLedgerDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ErpFinLedgerEntryWhereInput = { deletedAt: null };

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { docNumber: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { referenceNo: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.accountId) where.accountId = BigInt(query.accountId);
    if (query.partnerId) where.partnerId = BigInt(query.partnerId);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.erpFinLedgerEntry.findMany({
        where,
        orderBy: [{ entryDate: 'desc' }, { id: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.erpFinLedgerEntry.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.erpFinLedgerEntry.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Ledger entry not found');
    return { success: true, data: item };
  }
}
