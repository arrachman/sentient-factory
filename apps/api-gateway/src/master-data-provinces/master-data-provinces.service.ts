import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { CreateMasterDataProvinceDto } from './dto/create-master-data-province.dto';
import { QueryMasterDataProvinceDto } from './dto/query-master-data-province.dto';
import { UpdateMasterDataProvinceDto } from './dto/update-master-data-province.dto';

@Injectable()
export class MasterDataProvincesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataProvinceDto, actorId?: string) {
    const existingIso = await this.prisma.masterDataProvince.findFirst({
      where: { isoCode: dto.isoCode },
      select: { id: true, deletedAt: true },
    });
    if (existingIso) {
      throwDuplicate({
        fieldLabel: 'Province ISO code',
        value: dto.isoCode,
        isSoftDeleted: Boolean(existingIso.deletedAt),
      });
    }

    let created;
    try {
      created = await this.prisma.masterDataProvince.create({
        data: {
          name: dto.name,
          isoCode: dto.isoCode,
          createdBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['isoCode', 'iso_code', 'm1_province_iso_code_key'])) {
        throwDuplicate({ fieldLabel: 'Province ISO code', value: dto.isoCode });
      }
      throw error;
    }

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

  async findOne(id: number) {
    const item = await this.prisma.masterDataProvince.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Master data province not found');
    }
    return { success: true, data: item };
  }

  async update(id: number, dto: UpdateMasterDataProvinceDto, actorId?: string) {
    const existing = await this.prisma.masterDataProvince.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Master data province not found');
    }

    if (dto.isoCode && dto.isoCode !== existing.isoCode) {
      const duplicate = await this.prisma.masterDataProvince.findFirst({
        where: { isoCode: dto.isoCode, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Province ISO code',
          value: dto.isoCode,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    let updated;
    try {
      updated = await this.prisma.masterDataProvince.update({
        where: { id },
        data: {
          name: dto.name,
          isoCode: dto.isoCode,
          updatedBy: toAuditUserId(actorId),
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['isoCode', 'iso_code', 'm1_province_iso_code_key'])) {
        throwDuplicate({ fieldLabel: 'Province ISO code', value: dto.isoCode ?? existing.isoCode });
      }
      throw error;
    }

    return { success: true, data: updated };
  }

  async remove(id: number, actorId?: string) {
    const existing = await this.prisma.masterDataProvince.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data province not found');
    }

    await this.prisma.masterDataProvince.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: toAuditUserId(actorId),
      },
    });

    return { success: true, message: 'Master data province deleted' };
  }
}
