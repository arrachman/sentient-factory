import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { QueryAssetDto } from './dto/query-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

const CODE_TARGETS = ['code', 'eam_assets_code_key'];

@Injectable()
export class ErpMdpAssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssetDto, actorId?: string) {
    const existing = await this.prisma.mdpAsset.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Asset code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpAsset.create({
        data: {
          code: dto.code,
          name: dto.name,
          erpFixedAssetId: dto.erpFixedAssetId ? BigInt(dto.erpFixedAssetId) : null,
          isActive: dto.isActive ?? true,
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS)) {
        throwDuplicate({ fieldLabel: 'Asset code', value: dto.code });
      }
      throw error;
    }
  }

  async findAll(query: QueryAssetDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpAssetWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { equals: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpAsset.findMany({ where, orderBy: [{ [sortBy]: sortDir }], skip, take: limit }),
      this.prisma.mdpAsset.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpAsset.findFirst({ where: { id, deletedAt: null } });
    if (!item) throw new NotFoundException('Asset not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateAssetDto, actorId?: string) {
    const existing = await this.prisma.mdpAsset.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Asset not found');

    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpAsset.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup) {
        throwDuplicate({
          fieldLabel: 'Asset code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
      }
    }

    const actor = actorId ? BigInt(actorId) : null;
    try {
      const updated = await this.prisma.mdpAsset.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          erpFixedAssetId:
            dto.erpFixedAssetId !== undefined
              ? dto.erpFixedAssetId
                ? BigInt(dto.erpFixedAssetId)
                : null
              : undefined,
          isActive: dto.isActive,
          updatedById: actor,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS)) {
        throwDuplicate({ fieldLabel: 'Asset code', value: dto.code ?? existing.code });
      }
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpAsset.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Asset not found');
    await this.prisma.mdpAsset.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Asset deleted' };
  }
}
