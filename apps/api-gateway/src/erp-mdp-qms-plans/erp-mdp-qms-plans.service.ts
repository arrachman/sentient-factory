import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQmsPlanDto } from './dto/create-plan.dto';
import { QueryQmsPlanDto } from './dto/query-plan.dto';
import { UpdateQmsPlanDto } from './dto/update-plan.dto';

const CODE_TARGETS = ['code', 'qms_inspection_plans_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpQmsPlansService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateQmsPlanDto | UpdateQmsPlanDto, partial: boolean) {
    const d: Prisma.MdpQmsInspectionPlanUncheckedCreateInput | Prisma.MdpQmsInspectionPlanUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      type: dto.type as any,
      description: dto.description,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('itemId', dto.itemId);
    setBig('operationId', dto.operationId);

    return d;
  }

  async create(dto: CreateQmsPlanDto, actorId?: string) {
    const existing = await this.prisma.mdpQmsInspectionPlan.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Inspection plan code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpQmsInspectionPlan.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpQmsInspectionPlanUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Inspection plan code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryQmsPlanDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpQmsInspectionPlanWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }


    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpQmsInspectionPlan.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpQmsInspectionPlan.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpQmsInspectionPlan.findFirst({
      where: { id, deletedAt: null },
      include: { characteristics: { where: { deletedAt: null }, orderBy: { sequence: 'asc' } } },
    });
    if (!item) throw new NotFoundException('Inspection plan not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateQmsPlanDto, actorId?: string) {
    const existing = await this.prisma.mdpQmsInspectionPlan.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Inspection plan not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpQmsInspectionPlan.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Inspection plan code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpQmsInspectionPlan.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpQmsInspectionPlanUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Inspection plan code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpQmsInspectionPlan.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Inspection plan not found');
    await this.prisma.mdpQmsInspectionPlan.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Inspection plan deleted' };
  }
}
