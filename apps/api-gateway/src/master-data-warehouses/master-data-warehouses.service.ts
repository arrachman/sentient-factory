import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { CreateMasterDataWarehouseDto } from './dto/create-master-data-warehouse.dto';
import { QueryMasterDataWarehouseDto } from './dto/query-master-data-warehouse.dto';
import { UpdateMasterDataWarehouseDto } from './dto/update-master-data-warehouse.dto';

@Injectable()
export class MasterDataWarehousesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataWarehouseDto, actorId?: string) {
    const cityId = Number(dto.cityId);
    if (!Number.isInteger(cityId)) {
      throw new BadRequestException('City ID is invalid');
    }
    const city = await this.prisma.masterDataCity.findFirst({
      where: { id: cityId, deletedAt: null },
      select: { id: true },
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
        createdBy: toAuditUserId(actorId),
        updatedBy: toAuditUserId(actorId),
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
        { locationName: { contains: q, mode: 'insensitive' } },
        { addressDetail: { contains: q, mode: 'insensitive' } },
        { city: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.masterDataWarehouse.findMany({
        where,
        include: {
          city: { select: { id: true, name: true, postalCode: true } },
        },
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

  async findOne(id: number) {
    const item = await this.prisma.masterDataWarehouse.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Master data warehouse not found');
    }
    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateMasterDataWarehouseDto, actorId?: string) {
    const existing = await this.prisma.masterDataWarehouse.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data warehouse not found');
    }

    let nextCityId: number | undefined;
    if (typeof dto.cityId !== 'undefined') {
      nextCityId = Number(dto.cityId);
      if (!Number.isInteger(nextCityId)) {
        throw new BadRequestException('City ID is invalid');
      }
      const city = await this.prisma.masterDataCity.findFirst({
        where: { id: nextCityId, deletedAt: null },
        select: { id: true },
      });
      if (!city) {
        throw new BadRequestException('City not found');
      }
    }

    const updated = await this.prisma.masterDataWarehouse.update({
      where: { id },
      data: {
        name: dto.name,
        cityId: nextCityId,
        locationName: dto.locationName,
        addressDetail: dto.addressDetail,
        updatedBy: toAuditUserId(actorId),
      },
    });

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string) {
    const existing = await this.prisma.masterDataWarehouse.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data warehouse not found');
    }

    await this.prisma.masterDataWarehouse.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: toAuditUserId(actorId),
      },
    });

    return { success: true, message: 'Master data warehouse deleted' };
  }
}
