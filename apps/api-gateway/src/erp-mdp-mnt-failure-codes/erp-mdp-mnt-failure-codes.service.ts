import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMntFailureCodeDto } from './dto/create-failure-code.dto';
import { QueryMntFailureCodeDto } from './dto/query-failure-code.dto';
import { UpdateMntFailureCodeDto } from './dto/update-failure-code.dto';

const CODE_TARGETS = ['code', 'mnt_failure_codes_code_key'];

@Injectable()
export class ErpMdpMntFailureCodesService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateMntFailureCodeDto | UpdateMntFailureCodeDto, _partial: boolean) {
    const d:
      | Prisma.MdpMntFailureCodeUncheckedCreateInput
      | Prisma.MdpMntFailureCodeUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      type: dto.type as any,
      description: dto.description,
    } as any;

    return d;
  }

  async create(dto: CreateMntFailureCodeDto, actorId?: string) {
    const existing = await this.prisma.mdpMntFailureCode.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Failure code code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpMntFailureCode.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpMntFailureCodeUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Failure code code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryMntFailureCodeDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpMntFailureCodeWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.type) where.type = query.type;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpMntFailureCode.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpMntFailureCode.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpMntFailureCode.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Failure code not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateMntFailureCodeDto, actorId?: string) {
    const existing = await this.prisma.mdpMntFailureCode.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Failure code not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpMntFailureCode.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Failure code code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpMntFailureCode.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpMntFailureCodeUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Failure code code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpMntFailureCode.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Failure code not found');
    await this.prisma.mdpMntFailureCode.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Failure code deleted' };
  }
}
