import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQmsCapaActionDto } from './dto/create-capa-action.dto';
import { QueryQmsCapaActionDto } from './dto/query-capa-action.dto';
import { UpdateQmsCapaActionDto } from './dto/update-capa-action.dto';

const CODE_TARGETS = ['code', 'qms_capa_actions_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpQmsCapaActionsService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateQmsCapaActionDto | UpdateQmsCapaActionDto, partial: boolean) {
    const d: Prisma.MdpQmsCapaActionUncheckedCreateInput | Prisma.MdpQmsCapaActionUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      type: dto.type as any,
      status: dto.status as any,
      description: dto.description,
      rootCause: dto.rootCause,
      actionPlan: dto.actionPlan,
      effectiveness: dto.effectiveness,
      notes: dto.notes,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('nonconformanceId', dto.nonconformanceId);
    setBig('assignedToId', dto.assignedToId);
    setBig('verifiedById', dto.verifiedById);
    if (!partial || dto.dueDate !== undefined) (d as any).dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (!partial || dto.completedAt !== undefined) (d as any).completedAt = dto.completedAt ? new Date(dto.completedAt) : null;
    if (!partial || dto.verifiedAt !== undefined) (d as any).verifiedAt = dto.verifiedAt ? new Date(dto.verifiedAt) : null;
    return d;
  }

  async create(dto: CreateQmsCapaActionDto, actorId?: string) {
    const existing = await this.prisma.mdpQmsCapaAction.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'CAPA action code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpQmsCapaAction.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpQmsCapaActionUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'CAPA action code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryQmsCapaActionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpQmsCapaActionWhereInput = { deletedAt: null };
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
      this.prisma.mdpQmsCapaAction.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { nonconformance: { select: { id: true, code: true } } },
      }),
      this.prisma.mdpQmsCapaAction.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpQmsCapaAction.findFirst({
      where: { id, deletedAt: null },
      include: { nonconformance: { select: { id: true, code: true, name: true } } },
    });
    if (!item) throw new NotFoundException('CAPA action not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateQmsCapaActionDto, actorId?: string) {
    const existing = await this.prisma.mdpQmsCapaAction.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('CAPA action not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpQmsCapaAction.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'CAPA action code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpQmsCapaAction.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpQmsCapaActionUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'CAPA action code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpQmsCapaAction.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('CAPA action not found');
    await this.prisma.mdpQmsCapaAction.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'CAPA action deleted' };
  }
}
