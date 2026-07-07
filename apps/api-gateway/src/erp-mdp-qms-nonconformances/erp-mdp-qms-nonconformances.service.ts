import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQmsNonconformanceDto } from './dto/create-nonconformance.dto';
import { QueryQmsNonconformanceDto } from './dto/query-nonconformance.dto';
import { UpdateQmsNonconformanceDto } from './dto/update-nonconformance.dto';

const CODE_TARGETS = ['code', 'qms_nonconformances_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpQmsNonconformancesService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateQmsNonconformanceDto | UpdateQmsNonconformanceDto, partial: boolean) {
    const d: Prisma.MdpQmsNonconformanceUncheckedCreateInput | Prisma.MdpQmsNonconformanceUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      description: dto.description,
      severity: dto.severity as any,
      status: dto.status as any,
      disposition: dto.disposition as any,
      sourceType: dto.sourceType,
      qtyAffected: dto.qtyAffected,
      erpReferenceType: dto.erpReferenceType,
      notes: dto.notes,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('itemId', dto.itemId);
    setBig('productionOrderId', dto.productionOrderId);
    setBig('inspectionId', dto.inspectionId);
    setBig('erpReferenceId', dto.erpReferenceId);
    setBig('detectedById', dto.detectedById);
    if (!partial || dto.detectedAt !== undefined) (d as any).detectedAt = dto.detectedAt ? new Date(dto.detectedAt) : undefined;
    if (!partial || dto.closedAt !== undefined) (d as any).closedAt = dto.closedAt ? new Date(dto.closedAt) : null;
    return d;
  }

  async create(dto: CreateQmsNonconformanceDto, actorId?: string) {
    const existing = await this.prisma.mdpQmsNonconformance.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Nonconformance code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpQmsNonconformance.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpQmsNonconformanceUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Nonconformance code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryQmsNonconformanceDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpQmsNonconformanceWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.severity) where.severity = query.severity;
    if (query.disposition) where.disposition = query.disposition;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpQmsNonconformance.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpQmsNonconformance.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpQmsNonconformance.findFirst({
      where: { id, deletedAt: null },
      include: { inspection: { select: { id: true, code: true } }, capaActions: { where: { deletedAt: null } } },
    });
    if (!item) throw new NotFoundException('Nonconformance not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateQmsNonconformanceDto, actorId?: string) {
    const existing = await this.prisma.mdpQmsNonconformance.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Nonconformance not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpQmsNonconformance.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Nonconformance code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpQmsNonconformance.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpQmsNonconformanceUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Nonconformance code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpQmsNonconformance.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Nonconformance not found');
    await this.prisma.mdpQmsNonconformance.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Nonconformance deleted' };
  }
}
