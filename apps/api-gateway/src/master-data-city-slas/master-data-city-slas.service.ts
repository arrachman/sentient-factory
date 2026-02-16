import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { CreateMasterDataCitySlaDto } from './dto/create-master-data-city-sla.dto';
import { QueryMasterDataCitySlaDto } from './dto/query-master-data-city-sla.dto';
import { UpdateMasterDataCitySlaDto } from './dto/update-master-data-city-sla.dto';

@Injectable()
export class MasterDataCitySlasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataCitySlaDto, actorId?: string) {
    const cityId = this.parseCityId(dto.cityId);
    await this.ensureCityExists(cityId);

    const existing = await this.prisma.masterDataCitySla.findFirst({
      where: { cityId, deletedAt: null },
      select: { id: true },
    });
    if (existing) {
      throwDuplicate({ fieldLabel: 'SLA for this city' });
    }

    const created = await this.prisma.masterDataCitySla.create({
      data: {
        cityId,
        stdLeadTimeDays: dto.stdLeadTimeDays,
        stdReturnDoDays: dto.stdReturnDoDays,
        createdBy: toAuditUserId(actorId),
        updatedBy: toAuditUserId(actorId),
      },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            postalCode: true,
            province: { select: { id: true, name: true, isoCode: true } },
          },
        },
      },
    });

    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataCitySlaDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MasterDataCitySlaWhereInput = {
      deletedAt: null,
      city: {
        deletedAt: null,
        province: {
          deletedAt: null,
        },
      },
    };

    if (query.cityId?.trim()) {
      const cityId = Number(query.cityId.trim());
      if (Number.isInteger(cityId)) {
        where.cityId = cityId;
      }
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { city: { name: { contains: q, mode: 'insensitive' } } },
        { city: { postalCode: { contains: q, mode: 'insensitive' } } },
        { city: { province: { name: { contains: q, mode: 'insensitive' } } } },
        { city: { province: { isoCode: { contains: q, mode: 'insensitive' } } } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.masterDataCitySla.findMany({
        where,
        include: {
          city: {
            select: {
              id: true,
              name: true,
              postalCode: true,
              province: { select: { id: true, name: true, isoCode: true } },
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.masterDataCitySla.count({ where }),
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
    const item = await this.prisma.masterDataCitySla.findFirst({
      where: { id, deletedAt: null },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            postalCode: true,
            province: { select: { id: true, name: true, isoCode: true } },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Master data city SLA not found');
    }

    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateMasterDataCitySlaDto, actorId?: string) {
    const existing = await this.prisma.masterDataCitySla.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, cityId: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data city SLA not found');
    }

    const nextCityId = dto.cityId ? this.parseCityId(dto.cityId) : existing.cityId;
    await this.ensureCityExists(nextCityId);

    if (nextCityId !== existing.cityId) {
      const duplicate = await this.prisma.masterDataCitySla.findFirst({
        where: {
          cityId: nextCityId,
          deletedAt: null,
          NOT: { id },
        },
        select: { id: true },
      });
      if (duplicate) {
        throwDuplicate({ fieldLabel: 'SLA for this city' });
      }
    }

    const updated = await this.prisma.masterDataCitySla.update({
      where: { id },
      data: {
        cityId: dto.cityId ? nextCityId : undefined,
        stdLeadTimeDays: dto.stdLeadTimeDays,
        stdReturnDoDays: dto.stdReturnDoDays,
        updatedBy: toAuditUserId(actorId),
      },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            postalCode: true,
            province: { select: { id: true, name: true, isoCode: true } },
          },
        },
      },
    });

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string) {
    const existing = await this.prisma.masterDataCitySla.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data city SLA not found');
    }

    await this.prisma.masterDataCitySla.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: toAuditUserId(actorId),
      },
    });

    return { success: true, message: 'Master data city SLA deleted' };
  }

  private parseCityId(cityId: string): number {
    const parsed = Number(cityId);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException('City ID is invalid');
    }
    return parsed;
  }

  private async ensureCityExists(cityId: number) {
    const city = await this.prisma.masterDataCity.findFirst({
      where: { id: cityId, deletedAt: null },
      select: { id: true },
    });
    if (!city) {
      throw new BadRequestException('City not found');
    }
  }
}
