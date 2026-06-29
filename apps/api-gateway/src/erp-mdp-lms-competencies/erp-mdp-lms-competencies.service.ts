import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLmsCompetencyDto } from './dto/create-competency.dto';
import { QueryLmsCompetencyDto } from './dto/query-competency.dto';
import { UpdateLmsCompetencyDto } from './dto/update-competency.dto';

const CODE_TARGETS = ['code', 'lms_competencies_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpLmsCompetenciesService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateLmsCompetencyDto | UpdateLmsCompetencyDto, partial: boolean) {
    const d: Prisma.MdpLmsCompetencyUncheckedCreateInput | Prisma.MdpLmsCompetencyUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      category: dto.category,
      description: dto.description,
      level: dto.level,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('requiredCourseId', dto.requiredCourseId);

    return d;
  }

  async create(dto: CreateLmsCompetencyDto, actorId?: string) {
    const existing = await this.prisma.mdpLmsCompetency.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Competency code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpLmsCompetency.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpLmsCompetencyUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Competency code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryLmsCompetencyDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpLmsCompetencyWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }


    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpLmsCompetency.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpLmsCompetency.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpLmsCompetency.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Competency not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateLmsCompetencyDto, actorId?: string) {
    const existing = await this.prisma.mdpLmsCompetency.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Competency not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpLmsCompetency.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Competency code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpLmsCompetency.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpLmsCompetencyUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Competency code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpLmsCompetency.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Competency not found');
    await this.prisma.mdpLmsCompetency.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Competency deleted' };
  }
}
