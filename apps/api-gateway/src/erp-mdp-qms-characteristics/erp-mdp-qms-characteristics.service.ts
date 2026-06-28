import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQmsCharacteristicDto } from './dto/create-characteristic.dto';
import { QueryQmsCharacteristicDto } from './dto/query-characteristic.dto';
import { UpdateQmsCharacteristicDto } from './dto/update-characteristic.dto';

const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpQmsCharacteristicsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQmsCharacteristicDto, actorId?: string) {
    const parent = await this.prisma.mdpQmsInspectionPlan.findFirst({
      where: { id: BigInt(dto.planId), deletedAt: null },
      select: { id: true },
    });
    if (!parent) throw new NotFoundException('Plan not found');
    const actor = actorId ? BigInt(actorId) : null;
    const created = await this.prisma.mdpQmsInspectionCharacteristic.create({
      data: {
        planId: BigInt(dto.planId),
        sequence: dto.sequence,
        name: dto.name,
        characteristicType: dto.characteristicType as any,
        uomCode: dto.uomCode,
        nominal: dto.nominal,
        lowerLimit: dto.lowerLimit,
        upperLimit: dto.upperLimit,
        notes: dto.notes,
        createdById: actor,
        updatedById: actor,
      },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryQmsCharacteristicDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpQmsInspectionCharacteristicWhereInput = { deletedAt: null };
    if (query.planId) where.planId = BigInt(query.planId);


    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpQmsInspectionCharacteristic.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpQmsInspectionCharacteristic.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpQmsInspectionCharacteristic.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Characteristic not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateQmsCharacteristicDto, actorId?: string) {
    const existing = await this.prisma.mdpQmsInspectionCharacteristic.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Characteristic not found');
    const updated = await this.prisma.mdpQmsInspectionCharacteristic.update({
      where: { id },
      data: {
        sequence: dto.sequence,
        name: dto.name,
        characteristicType: dto.characteristicType as any,
        uomCode: dto.uomCode,
        nominal: dto.nominal,
        lowerLimit: dto.lowerLimit,
        upperLimit: dto.upperLimit,
        notes: dto.notes,
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpQmsInspectionCharacteristic.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Characteristic not found');
    await this.prisma.mdpQmsInspectionCharacteristic.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Characteristic deleted' };
  }
}
