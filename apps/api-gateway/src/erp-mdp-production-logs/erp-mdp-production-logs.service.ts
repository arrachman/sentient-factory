import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductionLogDto } from './dto/create-production-log.dto';
import { QueryProductionLogDto } from './dto/query-production-log.dto';
import { UpdateProductionLogDto } from './dto/update-production-log.dto';

const ORDER_SELECT = { select: { id: true, code: true } } as const;
const REASON_SELECT = { select: { id: true, code: true, name: true } } as const;

/**
 * Production logs are the MES execution record ERP ingests (good/scrap per
 * reporting event). On any mutation we recompute the parent order's
 * producedGoodQty/producedScrapQty rollup cache (catalog MES-4: store + recompute).
 */
@Injectable()
export class ErpMdpProductionLogsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertOrder(productionOrderId: string) {
    const order = await this.prisma.mdpProductionOrder.findFirst({
      where: { id: BigInt(productionOrderId), deletedAt: null },
      select: { id: true },
    });
    if (!order) throw new NotFoundException(`Production order '${productionOrderId}' not found`);
    return order.id;
  }

  private async assertOptionalRefs(dto: CreateProductionLogDto | UpdateProductionLogDto) {
    if (dto.operationId) {
      const op = await this.prisma.mdpOperation.findFirst({
        where: { id: BigInt(dto.operationId), deletedAt: null },
        select: { id: true },
      });
      if (!op) throw new NotFoundException(`Operation '${dto.operationId}' not found`);
    }
    if (dto.shiftId) {
      const shift = await this.prisma.mdpShift.findFirst({
        where: { id: BigInt(dto.shiftId), deletedAt: null },
        select: { id: true },
      });
      if (!shift) throw new NotFoundException(`Shift '${dto.shiftId}' not found`);
    }
    if (dto.scrapReasonId) {
      const reason = await this.prisma.mdpReasonCode.findFirst({
        where: { id: BigInt(dto.scrapReasonId), deletedAt: null },
        select: { id: true },
      });
      if (!reason) throw new NotFoundException(`Reason code '${dto.scrapReasonId}' not found`);
    }
  }

  private async recomputeOrderRollup(tx: Prisma.TransactionClient, productionOrderId: bigint) {
    const agg = await tx.mdpProductionLog.aggregate({
      where: { productionOrderId, deletedAt: null },
      _sum: { goodQty: true, scrapQty: true },
    });
    await tx.mdpProductionOrder.update({
      where: { id: productionOrderId },
      data: {
        producedGoodQty: agg._sum.goodQty ?? 0,
        producedScrapQty: agg._sum.scrapQty ?? 0,
      },
    });
  }

  async create(dto: CreateProductionLogDto, actorId?: string) {
    const orderId = await this.assertOrder(dto.productionOrderId);
    await this.assertOptionalRefs(dto);

    const actor = actorId ? BigInt(actorId) : null;
    const created = await this.prisma.$transaction(async (tx) => {
      const log = await tx.mdpProductionLog.create({
        data: {
          productionOrderId: orderId,
          operationId: dto.operationId ? BigInt(dto.operationId) : null,
          shiftId: dto.shiftId ? BigInt(dto.shiftId) : null,
          operatorId: dto.operatorId ? BigInt(dto.operatorId) : null,
          goodQty: dto.goodQty ?? 0,
          scrapQty: dto.scrapQty ?? 0,
          reworkQty: dto.reworkQty ?? 0,
          scrapReasonId: dto.scrapReasonId ? BigInt(dto.scrapReasonId) : null,
          startedAt: new Date(dto.startedAt),
          endedAt: dto.endedAt ? new Date(dto.endedAt) : null,
          notes: dto.notes,
          createdById: actor,
          updatedById: actor,
        },
        include: { scrapReason: REASON_SELECT },
      });
      await this.recomputeOrderRollup(tx, orderId);
      return log;
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryProductionLogDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpProductionLogWhereInput = { deletedAt: null };
    if (query.productionOrderId) where.productionOrderId = BigInt(query.productionOrderId);
    if (query.operationId) where.operationId = BigInt(query.operationId);
    if (query.postingStatus) where.postingStatus = query.postingStatus;

    const sortBy = query.sortBy ?? 'startedAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpProductionLog.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { scrapReason: REASON_SELECT, productionOrder: ORDER_SELECT },
      }),
      this.prisma.mdpProductionLog.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpProductionLog.findFirst({
      where: { id, deletedAt: null },
      include: { scrapReason: REASON_SELECT, productionOrder: ORDER_SELECT },
    });
    if (!item) throw new NotFoundException('Production log not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateProductionLogDto, actorId?: string) {
    const existing = await this.prisma.mdpProductionLog.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, productionOrderId: true },
    });
    if (!existing) throw new NotFoundException('Production log not found');
    await this.assertOptionalRefs(dto);

    const actor = actorId ? BigInt(actorId) : null;
    const updated = await this.prisma.$transaction(async (tx) => {
      const log = await tx.mdpProductionLog.update({
        where: { id },
        data: {
          operationId:
            dto.operationId !== undefined
              ? dto.operationId
                ? BigInt(dto.operationId)
                : null
              : undefined,
          shiftId:
            dto.shiftId !== undefined ? (dto.shiftId ? BigInt(dto.shiftId) : null) : undefined,
          operatorId:
            dto.operatorId !== undefined
              ? dto.operatorId
                ? BigInt(dto.operatorId)
                : null
              : undefined,
          goodQty: dto.goodQty,
          scrapQty: dto.scrapQty,
          reworkQty: dto.reworkQty,
          scrapReasonId:
            dto.scrapReasonId !== undefined
              ? dto.scrapReasonId
                ? BigInt(dto.scrapReasonId)
                : null
              : undefined,
          startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
          endedAt:
            dto.endedAt !== undefined ? (dto.endedAt ? new Date(dto.endedAt) : null) : undefined,
          notes: dto.notes,
          updatedById: actor,
        },
        include: { scrapReason: REASON_SELECT },
      });
      await this.recomputeOrderRollup(tx, existing.productionOrderId);
      return log;
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpProductionLog.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, productionOrderId: true },
    });
    if (!existing) throw new NotFoundException('Production log not found');
    await this.prisma.$transaction(async (tx) => {
      await tx.mdpProductionLog.update({
        where: { id },
        data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
      });
      await this.recomputeOrderRollup(tx, existing.productionOrderId);
    });
    return { success: true, message: 'Production log deleted' };
  }
}
