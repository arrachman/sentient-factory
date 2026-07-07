import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { QueryOperationDto } from './dto/query-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

const ORDER_SELECT = { select: { id: true, code: true } } as const;
const WORK_CENTER_SELECT = { select: { id: true, code: true, name: true } } as const;

/**
 * Routing steps of a production order, each run at a work center. Sequenced.
 * goodQty/scrapQty are manual-entry fields for the MVP (no auto-rollup from logs).
 */
@Injectable()
export class ErpMdpOperationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertOrder(productionOrderId: string) {
    const order = await this.prisma.mdpProductionOrder.findFirst({
      where: { id: BigInt(productionOrderId), deletedAt: null },
      select: { id: true },
    });
    if (!order) throw new NotFoundException(`Production order '${productionOrderId}' not found`);
    return order.id;
  }

  private async assertWorkCenter(workCenterId: string) {
    const wc = await this.prisma.mdpWorkCenter.findFirst({
      where: { id: BigInt(workCenterId), deletedAt: null },
      select: { id: true },
    });
    if (!wc) throw new NotFoundException(`Work center '${workCenterId}' not found`);
    return wc.id;
  }

  async create(dto: CreateOperationDto, actorId?: string) {
    const orderId = await this.assertOrder(dto.productionOrderId);
    const workCenterId = await this.assertWorkCenter(dto.workCenterId);
    const actor = actorId ? BigInt(actorId) : null;

    const created = await this.prisma.mdpOperation.create({
      data: {
        productionOrderId: orderId,
        sequence: dto.sequence,
        name: dto.name,
        workCenterId,
        status: dto.status ?? undefined,
        plannedQty: dto.plannedQty,
        goodQty: dto.goodQty ?? 0,
        scrapQty: dto.scrapQty ?? 0,
        startedAt: dto.startedAt ? new Date(dto.startedAt) : null,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
        createdById: actor,
        updatedById: actor,
      },
      include: { productionOrder: ORDER_SELECT, workCenter: WORK_CENTER_SELECT },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryOperationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpOperationWhereInput = { deletedAt: null };
    if (query.productionOrderId) where.productionOrderId = BigInt(query.productionOrderId);
    if (query.workCenterId) where.workCenterId = BigInt(query.workCenterId);
    if (query.status) where.status = query.status;

    const sortBy = query.sortBy ?? 'sequence';
    const sortDir = query.sortDir ?? 'asc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpOperation.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { productionOrder: ORDER_SELECT, workCenter: WORK_CENTER_SELECT },
      }),
      this.prisma.mdpOperation.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpOperation.findFirst({
      where: { id, deletedAt: null },
      include: { productionOrder: ORDER_SELECT, workCenter: WORK_CENTER_SELECT },
    });
    if (!item) throw new NotFoundException('Operation not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateOperationDto, actorId?: string) {
    const existing = await this.prisma.mdpOperation.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Operation not found');

    const workCenterId = dto.workCenterId
      ? await this.assertWorkCenter(dto.workCenterId)
      : undefined;
    const actor = actorId ? BigInt(actorId) : null;

    const updated = await this.prisma.mdpOperation.update({
      where: { id },
      data: {
        sequence: dto.sequence,
        name: dto.name,
        workCenterId,
        status: dto.status,
        plannedQty: dto.plannedQty,
        goodQty: dto.goodQty,
        scrapQty: dto.scrapQty,
        startedAt:
          dto.startedAt !== undefined
            ? dto.startedAt
              ? new Date(dto.startedAt)
              : null
            : undefined,
        completedAt:
          dto.completedAt !== undefined
            ? dto.completedAt
              ? new Date(dto.completedAt)
              : null
            : undefined,
        updatedById: actor,
      },
      include: { productionOrder: ORDER_SELECT, workCenter: WORK_CENTER_SELECT },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpOperation.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Operation not found');
    await this.prisma.mdpOperation.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Operation deleted' };
  }
}
