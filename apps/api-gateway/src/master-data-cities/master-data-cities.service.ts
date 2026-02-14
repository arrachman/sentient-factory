import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataCityDto } from './dto/create-master-data-city.dto';
import { QueryMasterDataCityDto } from './dto/query-master-data-city.dto';
import { UpdateMasterDataCityDto } from './dto/update-master-data-city.dto';

@Injectable()
export class MasterDataCitiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataCityDto, actorId?: string) {
    const province = await this.prisma.masterDataProvince.findFirst({
      where: { uuid: dto.provinceId, deletedAt: null },
      select: { uuid: true },
    });
    if (!province) {
      throw new BadRequestException('Province not found');
    }

    const existing = await this.prisma.masterDataCity.findFirst({
      where: {
        provinceId: dto.provinceId,
        name: dto.name,
        postalCode: dto.postalCode,
        deletedAt: null,
      },
      select: { uuid: true },
    });
    if (existing) {
      throwDuplicate({ fieldLabel: 'City with same province, name, and postal code' });
    }

    const created = await this.prisma.masterDataCity.create({
      data: {
        provinceId: dto.provinceId,
        name: dto.name,
        postalCode: dto.postalCode,
        createdBy: actorId ?? null,
        updatedBy: actorId ?? null,
      },
      include: {
        province: { select: { uuid: true, name: true, isoCode: true } },
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataCityDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MasterDataCityWhereInput = { deletedAt: null };

    if (query.provinceId?.trim()) {
      where.provinceId = query.provinceId.trim();
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { postalCode: { contains: q, mode: 'insensitive' } },
        { province: { name: { contains: q, mode: 'insensitive' } } },
        { province: { isoCode: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.masterDataCity.findMany({
        where,
        include: {
          province: { select: { uuid: true, name: true, isoCode: true } },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.masterDataCity.count({ where }),
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
    const item = await this.prisma.masterDataCity.findFirst({
      where: { uuid, deletedAt: null },
      include: {
        province: { select: { uuid: true, name: true, isoCode: true } },
      },
    });
    if (!item) {
      throw new NotFoundException('Master data city not found');
    }
    return { success: true, data: item };
  }

  async update(uuid: string, dto: UpdateMasterDataCityDto, actorId?: string) {
    const existing = await this.prisma.masterDataCity.findFirst({
      where: { uuid, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Master data city not found');
    }

    const nextProvinceId = dto.provinceId ?? existing.provinceId;
    const nextName = dto.name ?? existing.name;
    const nextPostalCode = dto.postalCode ?? existing.postalCode;

    if (dto.provinceId) {
      const province = await this.prisma.masterDataProvince.findFirst({
        where: { uuid: dto.provinceId, deletedAt: null },
        select: { uuid: true },
      });
      if (!province) {
        throw new BadRequestException('Province not found');
      }
    }

    const duplicate = await this.prisma.masterDataCity.findFirst({
      where: {
        provinceId: nextProvinceId,
        name: nextName,
        postalCode: nextPostalCode,
        deletedAt: null,
        NOT: { uuid },
      },
      select: { uuid: true },
    });
    if (duplicate) {
      throwDuplicate({ fieldLabel: 'City with same province, name, and postal code' });
    }

    const updated = await this.prisma.masterDataCity.update({
      where: { uuid },
      data: {
        provinceId: dto.provinceId,
        name: dto.name,
        postalCode: dto.postalCode,
        updatedBy: actorId ?? null,
      },
      include: {
        province: { select: { uuid: true, name: true, isoCode: true } },
      },
    });

    return { success: true, data: updated };
  }

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.masterDataCity.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data city not found');
    }

    await this.prisma.masterDataCity.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
        deletedBy: actorId ?? null,
      },
    });

    return { success: true, message: 'Master data city deleted' };
  }
}
