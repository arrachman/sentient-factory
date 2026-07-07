import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEhsAuditDto } from './dto/create-audit.dto';
import { QueryEhsAuditDto } from './dto/query-audit.dto';
import { UpdateEhsAuditDto } from './dto/update-audit.dto';

const CODE_TARGETS = ['code', 'ehs_audits_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpEhsAuditsService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateEhsAuditDto | UpdateEhsAuditDto, partial: boolean) {
    const d: Prisma.MdpEhsAuditUncheckedCreateInput | Prisma.MdpEhsAuditUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      type: dto.type as any,
      status: dto.status as any,
      scope: dto.scope,
      score: dto.score,
      findings: dto.findings,
      notes: dto.notes,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('workCenterId', dto.workCenterId);
    setBig('auditorId', dto.auditorId);
    if (!partial || dto.scheduledAt !== undefined) (d as any).scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : null;
    if (!partial || dto.conductedAt !== undefined) (d as any).conductedAt = dto.conductedAt ? new Date(dto.conductedAt) : null;
    return d;
  }

  async create(dto: CreateEhsAuditDto, actorId?: string) {
    const existing = await this.prisma.mdpEhsAudit.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Audit code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpEhsAudit.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpEhsAuditUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Audit code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryEhsAuditDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpEhsAuditWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpEhsAudit.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpEhsAudit.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpEhsAudit.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Audit not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateEhsAuditDto, actorId?: string) {
    const existing = await this.prisma.mdpEhsAudit.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Audit not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpEhsAudit.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Audit code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpEhsAudit.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpEhsAuditUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Audit code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpEhsAudit.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Audit not found');
    await this.prisma.mdpEhsAudit.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Audit deleted' };
  }
}
