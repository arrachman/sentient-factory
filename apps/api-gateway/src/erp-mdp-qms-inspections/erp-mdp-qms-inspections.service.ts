import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQmsInspectionDto } from './dto/create-inspection.dto';
import { QueryQmsInspectionDto } from './dto/query-inspection.dto';
import { UpdateQmsInspectionDto } from './dto/update-inspection.dto';

const CODE_TARGETS = ['code', 'qms_inspections_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpQmsInspectionsService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateQmsInspectionDto | UpdateQmsInspectionDto, partial: boolean) {
    const d: Prisma.MdpQmsInspectionUncheckedCreateInput | Prisma.MdpQmsInspectionUncheckedUpdateInput = {
      code: dto.code,
      type: dto.type as any,
      lotCode: dto.lotCode,
      lotSize: dto.lotSize,
      sampleSize: dto.sampleSize,
      result: dto.result as any,
      notes: dto.notes,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('planId', dto.planId);
    setBig('itemId', dto.itemId);
    setBig('productionOrderId', dto.productionOrderId);
    setBig('inspectedById', dto.inspectedById);
    if (!partial || dto.inspectedAt !== undefined) (d as any).inspectedAt = dto.inspectedAt ? new Date(dto.inspectedAt) : undefined;
    return d;
  }

  async create(dto: CreateQmsInspectionDto, actorId?: string) {
    const existing = await this.prisma.mdpQmsInspection.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Inspection code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpQmsInspection.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpQmsInspectionUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Inspection code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryQmsInspectionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpQmsInspectionWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { lotCode: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.result) where.result = query.result;
    if (query.type) where.type = query.type;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpQmsInspection.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { plan: { select: { id: true, code: true, name: true } } },
      }),
      this.prisma.mdpQmsInspection.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpQmsInspection.findFirst({
      where: { id, deletedAt: null },
      include: { plan: { select: { id: true, code: true, name: true } }, results: { where: { deletedAt: null } } },
    });
    if (!item) throw new NotFoundException('Inspection not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateQmsInspectionDto, actorId?: string) {
    const existing = await this.prisma.mdpQmsInspection.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Inspection not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpQmsInspection.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Inspection code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpQmsInspection.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpQmsInspectionUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Inspection code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpQmsInspection.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Inspection not found');
    await this.prisma.mdpQmsInspection.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Inspection deleted' };
  }
}
