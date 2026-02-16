import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { CreateMasterDataCityDto } from './dto/create-master-data-city.dto';
import { QueryMasterDataCityDto } from './dto/query-master-data-city.dto';
import { UpdateMasterDataCityDto } from './dto/update-master-data-city.dto';

@Injectable()
export class MasterDataCitiesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataCityDto, actorId?: string) {
    const provinceId = Number(dto.provinceId);
    if (!Number.isInteger(provinceId)) {
      throw new BadRequestException('Province ID is invalid');
    }

    const province = await this.prisma.masterDataProvince.findFirst({
      where: { id: provinceId, deletedAt: null },
      select: { id: true },
    });
    if (!province) {
      throw new BadRequestException('Province not found');
    }

    const existing = await this.prisma.masterDataCity.findFirst({
      where: {
        provinceId,
        name: dto.name,
        postalCode: dto.postalCode,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (existing) {
      throwDuplicate({ fieldLabel: 'City with same province, name, and postal code' });
    }

    const created = await this.prisma.masterDataCity.create({
      data: {
        provinceId,
        name: dto.name,
        postalCode: dto.postalCode,
        createdBy: toAuditUserId(actorId),
        updatedBy: toAuditUserId(actorId),
      },
      include: {
        province: { select: { id: true, name: true, isoCode: true } },
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
      const provinceId = Number(query.provinceId.trim());
      if (Number.isInteger(provinceId)) {
        where.provinceId = provinceId;
      }
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
          province: { select: { id: true, name: true, isoCode: true } },
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

  async findOne(id: number) {
    const item = await this.prisma.masterDataCity.findFirst({
      where: { id, deletedAt: null },
      include: {
        province: { select: { id: true, name: true, isoCode: true } },
      },
    });
    if (!item) {
      throw new NotFoundException('Master data city not found');
    }
    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateMasterDataCityDto, actorId?: string) {
    const existing = await this.prisma.masterDataCity.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Master data city not found');
    }

    const nextProvinceId = dto.provinceId ? Number(dto.provinceId) : existing.provinceId;
    const nextName = dto.name ?? existing.name;
    const nextPostalCode = dto.postalCode ?? existing.postalCode;

    if (dto.provinceId) {
      if (!Number.isInteger(nextProvinceId)) {
        throw new BadRequestException('Province ID is invalid');
      }
      const province = await this.prisma.masterDataProvince.findFirst({
        where: { id: nextProvinceId, deletedAt: null },
        select: { id: true },
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
        NOT: { id },
      },
      select: { id: true },
    });
    if (duplicate) {
      throwDuplicate({ fieldLabel: 'City with same province, name, and postal code' });
    }

    const updated = await this.prisma.masterDataCity.update({
      where: { id },
      data: {
        provinceId: dto.provinceId ? nextProvinceId : undefined,
        name: dto.name,
        postalCode: dto.postalCode,
        updatedBy: toAuditUserId(actorId),
      },
      include: {
        province: { select: { id: true, name: true, isoCode: true } },
      },
    });

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string) {
    const existing = await this.prisma.masterDataCity.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data city not found');
    }

    await this.prisma.masterDataCity.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: toAuditUserId(actorId),
      },
    });

    return { success: true, message: 'Master data city deleted' };
  }
}
