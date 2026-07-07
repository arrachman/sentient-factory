import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDowntimeEventDto } from './dto/create-downtime-event.dto';
import { QueryDowntimeEventDto } from './dto/query-downtime-event.dto';
import { UpdateDowntimeEventDto } from './dto/update-downtime-event.dto';

const WORK_CENTER_SELECT = { select: { id: true, code: true, name: true } } as const;
const REASON_SELECT = { select: { id: true, code: true, name: true } } as const;

/**
 * Downtime events feed OEE availability. durationSeconds is derived on close
 * (when endedAt is set); a null endedAt means the stoppage is still ongoing.
 */
@Injectable()
export class ErpMdpDowntimeEventsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertRefs(dto: CreateDowntimeEventDto | UpdateDowntimeEventDto) {
    if (dto.workCenterId) {
      const wc = await this.prisma.mdpWorkCenter.findFirst({
        where: { id: BigInt(dto.workCenterId), deletedAt: null },
        select: { id: true },
      });
      if (!wc) throw new NotFoundException(`Work center '${dto.workCenterId}' not found`);
    }
    if (dto.reasonId) {
      const reason = await this.prisma.mdpReasonCode.findFirst({
        where: { id: BigInt(dto.reasonId), deletedAt: null },
        select: { id: true },
      });
      if (!reason) throw new NotFoundException(`Reason code '${dto.reasonId}' not found`);
    }
    if (dto.productionOrderId) {
      const order = await this.prisma.mdpProductionOrder.findFirst({
        where: { id: BigInt(dto.productionOrderId), deletedAt: null },
        select: { id: true },
      });
      if (!order)
        throw new NotFoundException(`Production order '${dto.productionOrderId}' not found`);
    }
    if (dto.operationId) {
      const op = await this.prisma.mdpOperation.findFirst({
        where: { id: BigInt(dto.operationId), deletedAt: null },
        select: { id: true },
      });
      if (!op) throw new NotFoundException(`Operation '${dto.operationId}' not found`);
    }
    if (dto.assetId) {
      const asset = await this.prisma.mdpAsset.findFirst({
        where: { id: BigInt(dto.assetId), deletedAt: null },
        select: { id: true },
      });
      if (!asset) throw new NotFoundException(`Asset '${dto.assetId}' not found`);
    }
  }

  private deriveDuration(startedAt: Date, endedAt: Date | null): Prisma.Decimal | null {
    if (!endedAt) return null;
    const seconds = (endedAt.getTime() - startedAt.getTime()) / 1000;
    if (seconds < 0) throw new BadRequestException('endedAt must be after startedAt');
    return new Prisma.Decimal(seconds);
  }

  async create(dto: CreateDowntimeEventDto, actorId?: string) {
    await this.assertRefs(dto);
    const startedAt = new Date(dto.startedAt);
    const endedAt = dto.endedAt ? new Date(dto.endedAt) : null;
    const actor = actorId ? BigInt(actorId) : null;

    const created = await this.prisma.mdpDowntimeEvent.create({
      data: {
        workCenterId: BigInt(dto.workCenterId),
        reasonId: BigInt(dto.reasonId),
        productionOrderId: dto.productionOrderId ? BigInt(dto.productionOrderId) : null,
        operationId: dto.operationId ? BigInt(dto.operationId) : null,
        assetId: dto.assetId ? BigInt(dto.assetId) : null,
        type: dto.type ?? undefined,
        startedAt,
        endedAt,
        durationSeconds: this.deriveDuration(startedAt, endedAt),
        reportedById: dto.reportedById ? BigInt(dto.reportedById) : null,
        notes: dto.notes,
        createdById: actor,
        updatedById: actor,
      },
      include: { workCenter: WORK_CENTER_SELECT, reason: REASON_SELECT },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryDowntimeEventDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpDowntimeEventWhereInput = { deletedAt: null };
    if (query.workCenterId) where.workCenterId = BigInt(query.workCenterId);
    if (query.productionOrderId) where.productionOrderId = BigInt(query.productionOrderId);
    if (query.reasonId) where.reasonId = BigInt(query.reasonId);
    if (query.type) where.type = query.type;

    const sortBy = query.sortBy ?? 'startedAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpDowntimeEvent.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { workCenter: WORK_CENTER_SELECT, reason: REASON_SELECT },
      }),
      this.prisma.mdpDowntimeEvent.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpDowntimeEvent.findFirst({
      where: { id, deletedAt: null },
      include: { workCenter: WORK_CENTER_SELECT, reason: REASON_SELECT },
    });
    if (!item) throw new NotFoundException('Downtime event not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateDowntimeEventDto, actorId?: string) {
    const existing = await this.prisma.mdpDowntimeEvent.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Downtime event not found');
    await this.assertRefs(dto);

    const startedAt = dto.startedAt ? new Date(dto.startedAt) : existing.startedAt;
    const endedAt =
      dto.endedAt !== undefined ? (dto.endedAt ? new Date(dto.endedAt) : null) : existing.endedAt;
    const actor = actorId ? BigInt(actorId) : null;

    const updated = await this.prisma.mdpDowntimeEvent.update({
      where: { id },
      data: {
        workCenterId: dto.workCenterId ? BigInt(dto.workCenterId) : undefined,
        reasonId: dto.reasonId ? BigInt(dto.reasonId) : undefined,
        productionOrderId:
          dto.productionOrderId !== undefined
            ? dto.productionOrderId
              ? BigInt(dto.productionOrderId)
              : null
            : undefined,
        operationId:
          dto.operationId !== undefined
            ? dto.operationId
              ? BigInt(dto.operationId)
              : null
            : undefined,
        assetId: dto.assetId !== undefined ? (dto.assetId ? BigInt(dto.assetId) : null) : undefined,
        type: dto.type,
        startedAt: dto.startedAt ? startedAt : undefined,
        endedAt: dto.endedAt !== undefined ? endedAt : undefined,
        durationSeconds: this.deriveDuration(startedAt, endedAt),
        reportedById:
          dto.reportedById !== undefined
            ? dto.reportedById
              ? BigInt(dto.reportedById)
              : null
            : undefined,
        notes: dto.notes,
        updatedById: actor,
      },
      include: { workCenter: WORK_CENTER_SELECT, reason: REASON_SELECT },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpDowntimeEvent.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Downtime event not found');
    await this.prisma.mdpDowntimeEvent.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Downtime event deleted' };
  }
}
