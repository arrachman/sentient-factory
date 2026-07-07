import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { QueryProductionOrderDto } from './dto/query-production-order.dto';
import { UpdateProductionOrderDto } from './dto/update-production-order.dto';

const WORK_CENTER_SELECT = { select: { id: true, code: true, name: true } } as const;

@Injectable()
export class ErpMdpProductionOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertWorkCenter(workCenterId?: string) {
    if (!workCenterId) return;
    const wc = await this.prisma.mdpWorkCenter.findFirst({
      where: { id: BigInt(workCenterId), deletedAt: null },
      select: { id: true },
    });
    if (!wc) throw new NotFoundException(`Work center '${workCenterId}' not found`);
  }

  async create(dto: CreateProductionOrderDto, actorId?: string) {
    await this.assertWorkCenter(dto.workCenterId);

    const existing = await this.prisma.mdpProductionOrder.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Production order code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpProductionOrder.create({
        data: {
          code: dto.code,
          itemId: BigInt(dto.itemId),
          erpWorkOrderId: dto.erpWorkOrderId ? BigInt(dto.erpWorkOrderId) : null,
          workCenterId: dto.workCenterId ? BigInt(dto.workCenterId) : null,
          plannedQty: dto.plannedQty,
          uomCode: dto.uomCode,
          status: dto.status ?? undefined,
          plannedStartAt: dto.plannedStartAt ? new Date(dto.plannedStartAt) : null,
          plannedEndAt: dto.plannedEndAt ? new Date(dto.plannedEndAt) : null,
          branchId: dto.branchId ? BigInt(dto.branchId) : null,
          notes: dto.notes,
          createdById: actor,
          updatedById: actor,
        },
        include: { workCenter: WORK_CENTER_SELECT },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'mes_production_orders_code_key'])) {
        throwDuplicate({ fieldLabel: 'Production order code', value: dto.code });
      }
      throw error;
    }
  }

  async findAll(query: QueryProductionOrderDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpProductionOrderWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      where.code = { contains: query.search.trim(), mode: 'insensitive' };
    }
    if (query.status) where.status = query.status;
    if (query.workCenterId) where.workCenterId = BigInt(query.workCenterId);

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpProductionOrder.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { workCenter: WORK_CENTER_SELECT },
      }),
      this.prisma.mdpProductionOrder.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpProductionOrder.findFirst({
      where: { id, deletedAt: null },
      include: { workCenter: WORK_CENTER_SELECT, operations: true },
    });
    if (!item) throw new NotFoundException('Production order not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateProductionOrderDto, actorId?: string) {
    const existing = await this.prisma.mdpProductionOrder.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Production order not found');

    await this.assertWorkCenter(dto.workCenterId);

    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpProductionOrder.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup) {
        throwDuplicate({
          fieldLabel: 'Production order code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
      }
    }

    const actor = actorId ? BigInt(actorId) : null;
    try {
      const updated = await this.prisma.mdpProductionOrder.update({
        where: { id },
        data: {
          code: dto.code,
          itemId: dto.itemId ? BigInt(dto.itemId) : undefined,
          erpWorkOrderId:
            dto.erpWorkOrderId !== undefined
              ? dto.erpWorkOrderId
                ? BigInt(dto.erpWorkOrderId)
                : null
              : undefined,
          workCenterId:
            dto.workCenterId !== undefined
              ? dto.workCenterId
                ? BigInt(dto.workCenterId)
                : null
              : undefined,
          plannedQty: dto.plannedQty,
          uomCode: dto.uomCode,
          status: dto.status,
          plannedStartAt:
            dto.plannedStartAt !== undefined
              ? dto.plannedStartAt
                ? new Date(dto.plannedStartAt)
                : null
              : undefined,
          plannedEndAt:
            dto.plannedEndAt !== undefined
              ? dto.plannedEndAt
                ? new Date(dto.plannedEndAt)
                : null
              : undefined,
          branchId:
            dto.branchId !== undefined ? (dto.branchId ? BigInt(dto.branchId) : null) : undefined,
          notes: dto.notes,
          updatedById: actor,
        },
        include: { workCenter: WORK_CENTER_SELECT },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'mes_production_orders_code_key'])) {
        throwDuplicate({ fieldLabel: 'Production order code', value: dto.code ?? existing.code });
      }
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpProductionOrder.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Production order not found');
    await this.prisma.mdpProductionOrder.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Production order deleted' };
  }
}
