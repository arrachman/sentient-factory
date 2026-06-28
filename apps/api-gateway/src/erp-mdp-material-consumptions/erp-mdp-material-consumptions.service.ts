import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialConsumptionDto } from './dto/create-material-consumption.dto';
import { QueryMaterialConsumptionDto } from './dto/query-material-consumption.dto';
import { UpdateMaterialConsumptionDto } from './dto/update-material-consumption.dto';

const ORDER_SELECT = { select: { id: true, code: true } } as const;

/**
 * Components consumed against a production order. itemId / sourceBinId are
 * cross-app scalar FKs to ERP (md_items / md_storage_bins) — not asserted here
 * (domains decoupled). postingStatus stays PENDING until the ERP-emit worker
 * posts the implied inv_ issue (open decision #3).
 */
@Injectable()
export class ErpMdpMaterialConsumptionsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertOrder(productionOrderId: string) {
    const order = await this.prisma.mdpProductionOrder.findFirst({
      where: { id: BigInt(productionOrderId), deletedAt: null },
      select: { id: true },
    });
    if (!order) throw new NotFoundException(`Production order '${productionOrderId}' not found`);
    return order.id;
  }

  private async assertOperation(operationId?: string) {
    if (!operationId) return;
    const op = await this.prisma.mdpOperation.findFirst({
      where: { id: BigInt(operationId), deletedAt: null },
      select: { id: true },
    });
    if (!op) throw new NotFoundException(`Operation '${operationId}' not found`);
  }

  async create(dto: CreateMaterialConsumptionDto, actorId?: string) {
    const orderId = await this.assertOrder(dto.productionOrderId);
    await this.assertOperation(dto.operationId);
    const actor = actorId ? BigInt(actorId) : null;

    const created = await this.prisma.mdpMaterialConsumption.create({
      data: {
        productionOrderId: orderId,
        operationId: dto.operationId ? BigInt(dto.operationId) : null,
        itemId: BigInt(dto.itemId),
        qty: dto.qty,
        uomCode: dto.uomCode,
        sourceBinId: dto.sourceBinId ? BigInt(dto.sourceBinId) : null,
        consumedAt: new Date(dto.consumedAt),
        createdById: actor,
        updatedById: actor,
      },
      include: { productionOrder: ORDER_SELECT },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryMaterialConsumptionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpMaterialConsumptionWhereInput = { deletedAt: null };
    if (query.productionOrderId) where.productionOrderId = BigInt(query.productionOrderId);
    if (query.operationId) where.operationId = BigInt(query.operationId);
    if (query.postingStatus) where.postingStatus = query.postingStatus;

    const sortBy = query.sortBy ?? 'consumedAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpMaterialConsumption.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { productionOrder: ORDER_SELECT },
      }),
      this.prisma.mdpMaterialConsumption.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpMaterialConsumption.findFirst({
      where: { id, deletedAt: null },
      include: { productionOrder: ORDER_SELECT },
    });
    if (!item) throw new NotFoundException('Material consumption not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateMaterialConsumptionDto, actorId?: string) {
    const existing = await this.prisma.mdpMaterialConsumption.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Material consumption not found');
    await this.assertOperation(dto.operationId);
    const actor = actorId ? BigInt(actorId) : null;

    const updated = await this.prisma.mdpMaterialConsumption.update({
      where: { id },
      data: {
        operationId:
          dto.operationId !== undefined
            ? dto.operationId
              ? BigInt(dto.operationId)
              : null
            : undefined,
        itemId: dto.itemId ? BigInt(dto.itemId) : undefined,
        qty: dto.qty,
        uomCode: dto.uomCode,
        sourceBinId:
          dto.sourceBinId !== undefined
            ? dto.sourceBinId
              ? BigInt(dto.sourceBinId)
              : null
            : undefined,
        consumedAt: dto.consumedAt ? new Date(dto.consumedAt) : undefined,
        updatedById: actor,
      },
      include: { productionOrder: ORDER_SELECT },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpMaterialConsumption.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Material consumption not found');
    await this.prisma.mdpMaterialConsumption.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Material consumption deleted' };
  }
}
