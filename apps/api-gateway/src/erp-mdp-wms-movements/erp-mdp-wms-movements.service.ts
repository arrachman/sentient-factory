import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWmsMovementDto } from './dto/create-wms-movement.dto';
import { QueryWmsMovementDto } from './dto/query-wms-movement.dto';
import { UpdateWmsMovementDto } from './dto/update-wms-movement.dto';

const CODE_TARGETS = ['code', 'wms_movements_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);
const toDate = (v?: string | null) => (v ? new Date(v) : undefined);

@Injectable()
export class ErpMdpWmsMovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWmsMovementDto, actorId?: string) {
    const existing = await this.prisma.mdpWmsMovement.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Movement code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpWmsMovement.create({
        data: {
          code: dto.code,
          taskId: toBig(dto.taskId),
          itemId: BigInt(dto.itemId),
          qty: dto.qty,
          uomCode: dto.uomCode,
          fromBinId: toBig(dto.fromBinId),
          toBinId: toBig(dto.toBinId),
          handlingUnitId: toBig(dto.handlingUnitId),
          movedAt: new Date(dto.movedAt),
          movedById: toBig(dto.movedById),
          postingStatus: dto.postingStatus,
          notes: dto.notes,
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Movement code', value: dto.code });
      throw error;
    }
  }

  async findAll(query: QueryWmsMovementDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpWmsMovementWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { notes: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.taskId) where.taskId = BigInt(query.taskId);
    if (query.postingStatus) where.postingStatus = query.postingStatus;

    const sortBy = query.sortBy ?? 'movedAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpWmsMovement.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpWmsMovement.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpWmsMovement.findFirst({ where: { id, deletedAt: null } });
    if (!item) throw new NotFoundException('Movement not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateWmsMovementDto, actorId?: string) {
    const existing = await this.prisma.mdpWmsMovement.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Movement not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpWmsMovement.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Movement code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpWmsMovement.update({
        where: { id },
        data: {
          code: dto.code,
          taskId: dto.taskId !== undefined ? toBig(dto.taskId) : undefined,
          itemId: dto.itemId !== undefined ? BigInt(dto.itemId) : undefined,
          qty: dto.qty,
          uomCode: dto.uomCode,
          fromBinId: dto.fromBinId !== undefined ? toBig(dto.fromBinId) : undefined,
          toBinId: dto.toBinId !== undefined ? toBig(dto.toBinId) : undefined,
          handlingUnitId: dto.handlingUnitId !== undefined ? toBig(dto.handlingUnitId) : undefined,
          movedAt: toDate(dto.movedAt),
          movedById: dto.movedById !== undefined ? toBig(dto.movedById) : undefined,
          postingStatus: dto.postingStatus,
          notes: dto.notes,
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Movement code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpWmsMovement.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Movement not found');
    await this.prisma.mdpWmsMovement.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Movement deleted' };
  }
}
