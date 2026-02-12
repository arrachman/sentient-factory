import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataUomDto } from './dto/create-master-data-uom.dto';
import { QueryMasterDataUomDto } from './dto/query-master-data-uom.dto';
import { UpdateMasterDataUomDto } from './dto/update-master-data-uom.dto';

@Injectable()
export class MasterDataUomsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataUomDto, actorId?: string) {
    const existing = await this.prisma.masterDataUom.findFirst({
      where: { code: dto.code, deletedAt: null },
      select: { uuid: true },
    });
    if (existing) {
      throw new BadRequestException(`UOM code '${dto.code}' already exists`);
    }

    const created = await this.prisma.masterDataUom.create({
      data: {
        code: dto.code,
        name: dto.name,
        type: dto.type,
        createdBy: actorId ?? null,
        updatedBy: actorId ?? null,
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataUomDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MasterDataUomWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { type: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.masterDataUom.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.masterDataUom.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(uuid: string) {
    const item = await this.prisma.masterDataUom.findFirst({
      where: { uuid, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Master data UOM not found');
    }
    return { success: true, data: item };
  }

  async update(uuid: string, dto: UpdateMasterDataUomDto, actorId?: string) {
    const existing = await this.prisma.masterDataUom.findFirst({
      where: { uuid, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Master data UOM not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.masterDataUom.findFirst({
        where: { code: dto.code, deletedAt: null, NOT: { uuid } },
        select: { uuid: true },
      });
      if (duplicate) {
        throw new BadRequestException(`UOM code '${dto.code}' already exists`);
      }
    }

    const updated = await this.prisma.masterDataUom.update({
      where: { uuid },
      data: {
        code: dto.code,
        name: dto.name,
        type: dto.type,
        updatedBy: actorId ?? null,
      },
    });

    return { success: true, data: updated };
  }

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.masterDataUom.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data UOM not found');
    }

    await this.prisma.masterDataUom.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
        deletedBy: actorId ?? null,
      },
    });

    return { success: true, message: 'Master data UOM deleted' };
  }
}
