import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWmsTaskDto } from './dto/create-wms-task.dto';
import { QueryWmsTaskDto } from './dto/query-wms-task.dto';
import { UpdateWmsTaskDto } from './dto/update-wms-task.dto';

const CODE_TARGETS = ['code', 'wms_tasks_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpWmsTasksService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateWmsTaskDto | UpdateWmsTaskDto, partial: boolean) {
    const d: Prisma.MdpWmsTaskUncheckedCreateInput | Prisma.MdpWmsTaskUncheckedUpdateInput = {
      code: dto.code,
      type: dto.type as any,
      status: dto.status as any,
      qty: dto.qty,
      uomCode: dto.uomCode,
      erpReferenceType: dto.erpReferenceType,
      priority: dto.priority,
      notes: dto.notes,
    };
    const setBig = (key: keyof typeof d, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('itemId', dto.itemId);
    setBig('sourceBinId', dto.sourceBinId);
    setBig('destBinId', dto.destBinId);
    setBig('productionOrderId', dto.productionOrderId);
    setBig('erpReferenceId', dto.erpReferenceId);
    setBig('assignedToId', dto.assignedToId);
    return d;
  }

  async create(dto: CreateWmsTaskDto, actorId?: string) {
    const existing = await this.prisma.mdpWmsTask.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Task code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpWmsTask.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpWmsTaskUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Task code', value: dto.code });
      throw error;
    }
  }

  async findAll(query: QueryWmsTaskDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpWmsTaskWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { notes: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpWmsTask.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpWmsTask.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpWmsTask.findFirst({
      where: { id, deletedAt: null },
      include: { picks: true, movements: true },
    });
    if (!item) throw new NotFoundException('Task not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateWmsTaskDto, actorId?: string) {
    const existing = await this.prisma.mdpWmsTask.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Task not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpWmsTask.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Task code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpWmsTask.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpWmsTaskUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Task code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpWmsTask.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Task not found');
    await this.prisma.mdpWmsTask.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Task deleted' };
  }
}
