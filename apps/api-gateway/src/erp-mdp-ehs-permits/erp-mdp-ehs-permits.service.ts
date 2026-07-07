import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEhsPermitDto } from './dto/create-permit.dto';
import { QueryEhsPermitDto } from './dto/query-permit.dto';
import { UpdateEhsPermitDto } from './dto/update-permit.dto';

const CODE_TARGETS = ['code', 'ehs_permits_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpEhsPermitsService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateEhsPermitDto | UpdateEhsPermitDto, partial: boolean) {
    const d: Prisma.MdpEhsPermitUncheckedCreateInput | Prisma.MdpEhsPermitUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      type: dto.type as any,
      status: dto.status as any,
      location: dto.location,
      description: dto.description,
      notes: dto.notes,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('assetId', dto.assetId);
    setBig('workCenterId', dto.workCenterId);
    setBig('requestedById', dto.requestedById);
    setBig('approvedById', dto.approvedById);
    if (!partial || dto.validFrom !== undefined) (d as any).validFrom = dto.validFrom ? new Date(dto.validFrom) : null;
    if (!partial || dto.validTo !== undefined) (d as any).validTo = dto.validTo ? new Date(dto.validTo) : null;
    return d;
  }

  async create(dto: CreateEhsPermitDto, actorId?: string) {
    const existing = await this.prisma.mdpEhsPermit.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Permit code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpEhsPermit.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpEhsPermitUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Permit code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryEhsPermitDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpEhsPermitWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpEhsPermit.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpEhsPermit.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpEhsPermit.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Permit not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateEhsPermitDto, actorId?: string) {
    const existing = await this.prisma.mdpEhsPermit.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Permit not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpEhsPermit.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Permit code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpEhsPermit.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpEhsPermitUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Permit code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpEhsPermit.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Permit not found');
    await this.prisma.mdpEhsPermit.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Permit deleted' };
  }
}
