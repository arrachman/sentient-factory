import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataWarehouseDto } from './dto/create-master-data-warehouse.dto';
import { QueryMasterDataWarehouseDto } from './dto/query-master-data-warehouse.dto';
import { UpdateMasterDataWarehouseDto } from './dto/update-master-data-warehouse.dto';

@Injectable()
export class MasterDataWarehousesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataWarehouseDto, actorId?: string) {
    const cityId = dto.cityId.trim();
    const city = await this.prisma.masterDataCity.findFirst({
      where: { uuid: cityId, deletedAt: null },
      select: { uuid: true },
    });
    if (!city) {
      throw new BadRequestException('City not found');
    }

    const created = await this.prisma.masterDataWarehouse.create({
      data: {
        name: dto.name,
        cityId,
        locationName: dto.locationName,
        addressDetail: dto.addressDetail,
        createdBy: actorId ?? null,
        updatedBy: actorId ?? null,
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataWarehouseDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MasterDataWarehouseWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { cityId: { contains: q, mode: 'insensitive' } },
        { locationName: { contains: q, mode: 'insensitive' } },
        { addressDetail: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.masterDataWarehouse.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.masterDataWarehouse.count({ where }),
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
    const item = await this.prisma.masterDataWarehouse.findFirst({
      where: { uuid, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Master data warehouse not found');
    }
    return { success: true, data: item };
  }

  async update(uuid: string, dto: UpdateMasterDataWarehouseDto, actorId?: string) {
    const existing = await this.prisma.masterDataWarehouse.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data warehouse not found');
    }

    if (typeof dto.cityId !== 'undefined') {
      const cityId = dto.cityId.trim();
      if (!cityId) {
        throw new BadRequestException('City is required');
      }
      const city = await this.prisma.masterDataCity.findFirst({
        where: { uuid: cityId, deletedAt: null },
        select: { uuid: true },
      });
      if (!city) {
        throw new BadRequestException('City not found');
      }
      dto.cityId = cityId;
    }

    const updated = await this.prisma.masterDataWarehouse.update({
      where: { uuid },
      data: {
        name: dto.name,
        cityId: dto.cityId,
        locationName: dto.locationName,
        addressDetail: dto.addressDetail,
        updatedBy: actorId ?? null,
      },
    });

    return { success: true, data: updated };
  }

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.masterDataWarehouse.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data warehouse not found');
    }

    await this.prisma.masterDataWarehouse.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
        deletedBy: actorId ?? null,
      },
    });

    return { success: true, message: 'Master data warehouse deleted' };
  }
}
