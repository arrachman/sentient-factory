import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLmsCourseDto } from './dto/create-course.dto';
import { QueryLmsCourseDto } from './dto/query-course.dto';
import { UpdateLmsCourseDto } from './dto/update-course.dto';

const CODE_TARGETS = ['code', 'lms_courses_code_key'];

@Injectable()
export class ErpMdpLmsCoursesService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateLmsCourseDto | UpdateLmsCourseDto, _partial: boolean) {
    const d: Prisma.MdpLmsCourseUncheckedCreateInput | Prisma.MdpLmsCourseUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      category: dto.category as any,
      status: dto.status as any,
      description: dto.description,
      durationHours: dto.durationHours,
      isMandatory: dto.isMandatory,
      validityMonths: dto.validityMonths,
    } as any;

    return d;
  }

  async create(dto: CreateLmsCourseDto, actorId?: string) {
    const existing = await this.prisma.mdpLmsCourse.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Course code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpLmsCourse.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpLmsCourseUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Course code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryLmsCourseDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpLmsCourseWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpLmsCourse.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpLmsCourse.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpLmsCourse.findFirst({
      where: { id, deletedAt: null },
      include: {
        enrollments: { where: { deletedAt: null } },
        competencies: { where: { deletedAt: null } },
      },
    });
    if (!item) throw new NotFoundException('Course not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateLmsCourseDto, actorId?: string) {
    const existing = await this.prisma.mdpLmsCourse.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Course not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpLmsCourse.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Course code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpLmsCourse.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpLmsCourseUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Course code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpLmsCourse.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Course not found');
    await this.prisma.mdpLmsCourse.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Course deleted' };
  }
}
