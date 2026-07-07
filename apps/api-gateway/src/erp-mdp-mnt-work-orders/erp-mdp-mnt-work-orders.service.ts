import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMntWorkOrderDto } from './dto/create-work-order.dto';
import { QueryMntWorkOrderDto } from './dto/query-work-order.dto';
import { UpdateMntWorkOrderDto } from './dto/update-work-order.dto';

const CODE_TARGETS = ['code', 'mnt_work_orders_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpMntWorkOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateMntWorkOrderDto | UpdateMntWorkOrderDto, partial: boolean) {
    const d: Prisma.MdpMntWorkOrderUncheckedCreateInput | Prisma.MdpMntWorkOrderUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      type: dto.type as any,
      status: dto.status as any,
      priority: dto.priority as any,
      description: dto.description,
      downtimeMinutes: dto.downtimeMinutes,
      notes: dto.notes,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('assetId', dto.assetId);
    setBig('workCenterId', dto.workCenterId);
    setBig('pmScheduleId', dto.pmScheduleId);
    setBig('failureCodeId', dto.failureCodeId);
    setBig('reportedById', dto.reportedById);
    setBig('assignedToId', dto.assignedToId);
    if (!partial || dto.scheduledStartAt !== undefined) (d as any).scheduledStartAt = dto.scheduledStartAt ? new Date(dto.scheduledStartAt) : null;
    if (!partial || dto.scheduledEndAt !== undefined) (d as any).scheduledEndAt = dto.scheduledEndAt ? new Date(dto.scheduledEndAt) : null;
    if (!partial || dto.actualStartAt !== undefined) (d as any).actualStartAt = dto.actualStartAt ? new Date(dto.actualStartAt) : null;
    if (!partial || dto.actualEndAt !== undefined) (d as any).actualEndAt = dto.actualEndAt ? new Date(dto.actualEndAt) : null;
    return d;
  }

  async create(dto: CreateMntWorkOrderDto, actorId?: string) {
    const existing = await this.prisma.mdpMntWorkOrder.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Work order code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpMntWorkOrder.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpMntWorkOrderUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Work order code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryMntWorkOrderDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpMntWorkOrderWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    if (query.priority) where.priority = query.priority;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpMntWorkOrder.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { pmSchedule: { select: { id: true, code: true } }, failureCode: { select: { id: true, code: true } } },
      }),
      this.prisma.mdpMntWorkOrder.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpMntWorkOrder.findFirst({
      where: { id, deletedAt: null },
      include: { pmSchedule: { select: { id: true, code: true, name: true } }, failureCode: { select: { id: true, code: true, name: true } }, spareParts: { where: { deletedAt: null } } },
    });
    if (!item) throw new NotFoundException('Work order not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateMntWorkOrderDto, actorId?: string) {
    const existing = await this.prisma.mdpMntWorkOrder.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Work order not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpMntWorkOrder.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Work order code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpMntWorkOrder.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpMntWorkOrderUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Work order code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpMntWorkOrder.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Work order not found');
    await this.prisma.mdpMntWorkOrder.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Work order deleted' };
  }
}
