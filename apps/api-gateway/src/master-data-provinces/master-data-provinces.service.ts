import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataProvinceDto } from './dto/create-master-data-province.dto';
import { QueryMasterDataProvinceDto } from './dto/query-master-data-province.dto';
import { UpdateMasterDataProvinceDto } from './dto/update-master-data-province.dto';

@Injectable()
export class MasterDataProvincesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataProvinceDto, actorId?: string) {
    const existingIso = await this.prisma.masterDataProvince.findFirst({
      where: { isoCode: dto.isoCode, deletedAt: null },
      select: { uuid: true },
    });
    if (existingIso) {
      throw new BadRequestException(`Province ISO code '${dto.isoCode}' already exists`);
    }

    const created = await this.prisma.masterDataProvince.create({
      data: {
        name: dto.name,
        isoCode: dto.isoCode,
        createdBy: actorId ?? null,
        updatedBy: actorId ?? null,
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataProvinceDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MasterDataProvinceWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { isoCode: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.masterDataProvince.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.masterDataProvince.count({ where }),
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
    const item = await this.prisma.masterDataProvince.findFirst({
      where: { uuid, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Master data province not found');
    }
    return { success: true, data: item };
  }

  async update(uuid: string, dto: UpdateMasterDataProvinceDto, actorId?: string) {
    const existing = await this.prisma.masterDataProvince.findFirst({
      where: { uuid, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Master data province not found');
    }

    if (dto.isoCode && dto.isoCode !== existing.isoCode) {
      const duplicate = await this.prisma.masterDataProvince.findFirst({
        where: { isoCode: dto.isoCode, deletedAt: null, NOT: { uuid } },
        select: { uuid: true },
      });
      if (duplicate) {
        throw new BadRequestException(`Province ISO code '${dto.isoCode}' already exists`);
      }
    }

    const updated = await this.prisma.masterDataProvince.update({
      where: { uuid },
      data: {
        name: dto.name,
        isoCode: dto.isoCode,
        updatedBy: actorId ?? null,
      },
    });

    return { success: true, data: updated };
  }

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.masterDataProvince.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data province not found');
    }

    await this.prisma.masterDataProvince.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
        deletedBy: actorId ?? null,
      },
    });

    return { success: true, message: 'Master data province deleted' };
  }
}
