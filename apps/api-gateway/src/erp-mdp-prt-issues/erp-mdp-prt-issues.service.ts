import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrtIssueDto } from './dto/create-issue.dto';
import { QueryPrtIssueDto } from './dto/query-issue.dto';
import { UpdatePrtIssueDto } from './dto/update-issue.dto';

const CODE_TARGETS = ['code', 'prt_issues_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpPrtIssuesService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreatePrtIssueDto | UpdatePrtIssueDto, partial: boolean) {
    const d: Prisma.MdpPrtIssueUncheckedCreateInput | Prisma.MdpPrtIssueUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      type: dto.type as any,
      severity: dto.severity as any,
      status: dto.status as any,
      source: dto.source,
      description: dto.description,
      resolution: dto.resolution,
      notes: dto.notes,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('assetId', dto.assetId);
    setBig('workCenterId', dto.workCenterId);
    setBig('productionOrderId', dto.productionOrderId);
    setBig('reportedById', dto.reportedById);
    setBig('assignedToId', dto.assignedToId);
    if (!partial || dto.raisedAt !== undefined) (d as any).raisedAt = dto.raisedAt ? new Date(dto.raisedAt) : undefined;
    if (!partial || dto.resolvedAt !== undefined) (d as any).resolvedAt = dto.resolvedAt ? new Date(dto.resolvedAt) : null;
    return d;
  }

  async create(dto: CreatePrtIssueDto, actorId?: string) {
    const existing = await this.prisma.mdpPrtIssue.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Issue code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpPrtIssue.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpPrtIssueUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Issue code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryPrtIssueDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpPrtIssueWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    if (query.severity) where.severity = query.severity;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpPrtIssue.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpPrtIssue.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpPrtIssue.findFirst({
      where: { id, deletedAt: null },
      include: { escalations: { where: { deletedAt: null } } },
    });
    if (!item) throw new NotFoundException('Issue not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdatePrtIssueDto, actorId?: string) {
    const existing = await this.prisma.mdpPrtIssue.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Issue not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpPrtIssue.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Issue code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpPrtIssue.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpPrtIssueUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Issue code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpPrtIssue.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Issue not found');
    await this.prisma.mdpPrtIssue.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Issue deleted' };
  }
}
