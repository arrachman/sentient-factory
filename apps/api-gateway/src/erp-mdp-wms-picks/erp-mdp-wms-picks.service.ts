import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWmsPickDto } from './dto/create-wms-pick.dto';
import { QueryWmsPickDto } from './dto/query-wms-pick.dto';
import { UpdateWmsPickDto } from './dto/update-wms-pick.dto';

const toBig = (v?: string | null) => (v ? BigInt(v) : null);
const HU_INCLUDE = { handlingUnit: { select: { id: true, code: true } } } as const;

@Injectable()
export class ErpMdpWmsPicksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWmsPickDto, actorId?: string) {
    const task = await this.prisma.mdpWmsTask.findFirst({
      where: { id: BigInt(dto.taskId), deletedAt: null },
      select: { id: true },
    });
    if (!task) throw new NotFoundException('Task not found');

    const actor = actorId ? BigInt(actorId) : null;
    const created = await this.prisma.mdpWmsPick.create({
      data: {
        taskId: BigInt(dto.taskId),
        itemId: BigInt(dto.itemId),
        qtyRequested: dto.qtyRequested,
        qtyPicked: dto.qtyPicked ?? 0,
        sourceBinId: toBig(dto.sourceBinId),
        handlingUnitId: toBig(dto.handlingUnitId),
        status: dto.status,
        notes: dto.notes,
        createdById: actor,
        updatedById: actor,
      },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryWmsPickDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpWmsPickWhereInput = { deletedAt: null };
    if (query.taskId) where.taskId = BigInt(query.taskId);
    if (query.status) where.status = query.status;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpWmsPick.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: HU_INCLUDE,
      }),
      this.prisma.mdpWmsPick.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpWmsPick.findFirst({
      where: { id, deletedAt: null },
      include: HU_INCLUDE,
    });
    if (!item) throw new NotFoundException('Pick not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateWmsPickDto, actorId?: string) {
    const existing = await this.prisma.mdpWmsPick.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Pick not found');
    const updated = await this.prisma.mdpWmsPick.update({
      where: { id },
      data: {
        itemId: dto.itemId !== undefined ? BigInt(dto.itemId) : undefined,
        qtyRequested: dto.qtyRequested,
        qtyPicked: dto.qtyPicked,
        sourceBinId: dto.sourceBinId !== undefined ? toBig(dto.sourceBinId) : undefined,
        handlingUnitId: dto.handlingUnitId !== undefined ? toBig(dto.handlingUnitId) : undefined,
        status: dto.status,
        notes: dto.notes,
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpWmsPick.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Pick not found');
    await this.prisma.mdpWmsPick.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Pick deleted' };
  }
}
