import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMntSparePartDto } from './dto/create-spare-part.dto';
import { QueryMntSparePartDto } from './dto/query-spare-part.dto';
import { UpdateMntSparePartDto } from './dto/update-spare-part.dto';

@Injectable()
export class ErpMdpMntSparePartsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMntSparePartDto, actorId?: string) {
    const parent = await this.prisma.mdpMntWorkOrder.findFirst({
      where: { id: BigInt(dto.workOrderId), deletedAt: null },
      select: { id: true },
    });
    if (!parent) throw new NotFoundException('Work order not found');
    const actor = actorId ? BigInt(actorId) : null;
    const created = await this.prisma.mdpMntSparePart.create({
      data: {
        workOrderId: BigInt(dto.workOrderId),
        itemId: BigInt(dto.itemId),
        qty: dto.qty,
        uomCode: dto.uomCode,
        postingStatus: dto.postingStatus as any,
        notes: dto.notes,
        createdById: actor,
        updatedById: actor,
      },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryMntSparePartDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpMntSparePartWhereInput = { deletedAt: null };
    if (query.workOrderId) where.workOrderId = BigInt(query.workOrderId);
    if (query.postingStatus) where.postingStatus = query.postingStatus;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpMntSparePart.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpMntSparePart.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpMntSparePart.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Spare part not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateMntSparePartDto, actorId?: string) {
    const existing = await this.prisma.mdpMntSparePart.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Spare part not found');
    const updated = await this.prisma.mdpMntSparePart.update({
      where: { id },
      data: {
        itemId: dto.itemId !== undefined ? BigInt(dto.itemId) : undefined,
        qty: dto.qty,
        uomCode: dto.uomCode,
        postingStatus: dto.postingStatus as any,
        notes: dto.notes,
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpMntSparePart.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Spare part not found');
    await this.prisma.mdpMntSparePart.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Spare part deleted' };
  }
}
