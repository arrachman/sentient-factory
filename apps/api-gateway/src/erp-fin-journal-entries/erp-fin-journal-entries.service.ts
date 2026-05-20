import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateJournalEntryDto,
  CreateJournalLineDto,
} from './dto/create-journal-entry.dto';
import { QueryJournalEntryDto } from './dto/query-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';

function toBigInt(v?: string | null): bigint | null {
  if (v === undefined || v === null || v === '') return null;
  return BigInt(v);
}

function mapLine(line: CreateJournalLineDto) {
  return {
    accountId: BigInt(line.accountId),
    currencyId: BigInt(line.currencyId),
    exchangeRate: new Prisma.Decimal(line.exchangeRate),
    debit: new Prisma.Decimal(line.debit),
    credit: new Prisma.Decimal(line.credit),
    debitFx: line.debitFx ? new Prisma.Decimal(line.debitFx) : null,
    creditFx: line.creditFx ? new Prisma.Decimal(line.creditFx) : null,
    notes: line.notes ?? null,
    costCenterId: toBigInt(line.costCenterId),
    divisionId: toBigInt(line.divisionId),
    subdivisionId: toBigInt(line.subdivisionId),
    projectId: toBigInt(line.projectId),
    lineNo: line.lineNo,
  };
}

@Injectable()
export class ErpFinJournalEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateJournalEntryDto, actorId?: string) {
    const actorBigInt = actorId ? BigInt(actorId) : null;

    const created = await this.prisma.erpFinJournalEntry.create({
      data: {
        docNumber: dto.docNumber,
        autoNumber: dto.autoNumber ?? null,
        journalType: dto.journalType,
        branchId: BigInt(dto.branchId),
        locationId: toBigInt(dto.locationId),
        source: dto.source ?? null,
        entryDate: new Date(dto.entryDate),
        fiscalPeriodId: BigInt(dto.fiscalPeriodId),
        partnerId: toBigInt(dto.partnerId),
        contactPerson: dto.contactPerson ?? null,
        description: dto.description,
        notes: dto.notes ?? null,
        currencyId: BigInt(dto.currencyId),
        exchangeRate: new Prisma.Decimal(dto.exchangeRate),
        status: dto.status ?? 'DRAFT',
        postingStatus: dto.postingStatus ?? 'UNPOSTED',
        legacyCode: dto.legacyCode ?? null,
        createdById: actorBigInt,
        updatedById: actorBigInt,
        lines: dto.lines.length
          ? { create: dto.lines.map(mapLine) }
          : undefined,
      },
      include: { lines: true },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryJournalEntryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ErpFinJournalEntryWhereInput = { deletedAt: null };

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { docNumber: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (query.journalType) where.journalType = query.journalType;
    if (query.status) where.status = query.status;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.erpFinJournalEntry.findMany({
        where,
        orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        include: { lines: true },
      }),
      this.prisma.erpFinJournalEntry.count({ where }),
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
    const item = await this.prisma.erpFinJournalEntry.findFirst({
      where: { id, deletedAt: null },
      include: { lines: { orderBy: { lineNo: 'asc' } } },
    });
    if (!item) {
      throw new NotFoundException('Journal entry not found');
    }
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateJournalEntryDto, actorId?: string) {
    const existing = await this.prisma.erpFinJournalEntry.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Journal entry not found');
    }

    const actorBigInt = actorId ? BigInt(actorId) : null;

    const data: Prisma.ErpFinJournalEntryUpdateInput = {
      updatedById: actorBigInt,
    };
    if (dto.docNumber !== undefined) data.docNumber = dto.docNumber;
    if (dto.autoNumber !== undefined) data.autoNumber = dto.autoNumber;
    if (dto.journalType !== undefined) data.journalType = dto.journalType;
    if (dto.branchId !== undefined) data.branchId = BigInt(dto.branchId);
    if (dto.locationId !== undefined) data.locationId = toBigInt(dto.locationId);
    if (dto.source !== undefined) data.source = dto.source;
    if (dto.entryDate !== undefined) data.entryDate = new Date(dto.entryDate);
    if (dto.fiscalPeriodId !== undefined)
      data.fiscalPeriodId = BigInt(dto.fiscalPeriodId);
    if (dto.partnerId !== undefined) data.partnerId = toBigInt(dto.partnerId);
    if (dto.contactPerson !== undefined) data.contactPerson = dto.contactPerson;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.currencyId !== undefined) data.currencyId = BigInt(dto.currencyId);
    if (dto.exchangeRate !== undefined)
      data.exchangeRate = new Prisma.Decimal(dto.exchangeRate);
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.postingStatus !== undefined) data.postingStatus = dto.postingStatus;
    if (dto.legacyCode !== undefined) data.legacyCode = dto.legacyCode;

    // Replace lines if provided (skeleton — simple delete+recreate)
    if (dto.lines !== undefined) {
      await this.prisma.erpFinJournalLine.deleteMany({
        where: { journalEntryId: id },
      });
    }

    const updated = await this.prisma.erpFinJournalEntry.update({
      where: { id },
      data: {
        ...data,
        lines:
          dto.lines && dto.lines.length
            ? { create: dto.lines.map(mapLine) }
            : undefined,
      },
      include: { lines: { orderBy: { lineNo: 'asc' } } },
    });

    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.erpFinJournalEntry.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Journal entry not found');
    }

    await this.prisma.erpFinJournalEntry.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });

    return { success: true, message: 'Journal entry deleted' };
  }
}
