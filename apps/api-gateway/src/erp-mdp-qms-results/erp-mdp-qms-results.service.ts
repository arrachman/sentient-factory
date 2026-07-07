import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQmsResultDto } from './dto/create-result.dto';
import { QueryQmsResultDto } from './dto/query-result.dto';
import { UpdateQmsResultDto } from './dto/update-result.dto';

const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpQmsResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQmsResultDto, actorId?: string) {
    const parent = await this.prisma.mdpQmsInspection.findFirst({
      where: { id: BigInt(dto.inspectionId), deletedAt: null },
      select: { id: true },
    });
    if (!parent) throw new NotFoundException('Inspection not found');
    const actor = actorId ? BigInt(actorId) : null;
    const created = await this.prisma.mdpQmsInspectionResult.create({
      data: {
        inspectionId: BigInt(dto.inspectionId),
        characteristicId: toBig(dto.characteristicId),
        measuredValue: dto.measuredValue,
        status: dto.status as any,
        notes: dto.notes,
        createdById: actor,
        updatedById: actor,
      },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryQmsResultDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpQmsInspectionResultWhereInput = { deletedAt: null };
    if (query.inspectionId) where.inspectionId = BigInt(query.inspectionId);
    if (query.status) where.status = query.status;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpQmsInspectionResult.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { characteristic: { select: { id: true, name: true, sequence: true } } },
      }),
      this.prisma.mdpQmsInspectionResult.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpQmsInspectionResult.findFirst({
      where: { id, deletedAt: null },
      include: { characteristic: { select: { id: true, name: true, sequence: true } } },
    });
    if (!item) throw new NotFoundException('Result not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateQmsResultDto, actorId?: string) {
    const existing = await this.prisma.mdpQmsInspectionResult.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Result not found');
    const updated = await this.prisma.mdpQmsInspectionResult.update({
      where: { id },
      data: {
        characteristicId: dto.characteristicId !== undefined ? toBig(dto.characteristicId) : undefined,
        measuredValue: dto.measuredValue,
        status: dto.status as any,
        notes: dto.notes,
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpQmsInspectionResult.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Result not found');
    await this.prisma.mdpQmsInspectionResult.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Result deleted' };
  }
}
