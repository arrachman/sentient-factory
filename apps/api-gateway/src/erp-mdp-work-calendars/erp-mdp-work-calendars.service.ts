import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkCalendarDto } from './dto/create-work-calendar.dto';
import { QueryWorkCalendarDto } from './dto/query-work-calendar.dto';
import { UpdateWorkCalendarDto } from './dto/update-work-calendar.dto';

const CODE_TARGETS = ['code', 'mdp_work_calendars_code_key'];

const toBig = (v?: string | null) => (v ? BigInt(v) : null);
const toDate = (v?: string | null) => (v ? new Date(v) : null);

@Injectable()
export class ErpMdpWorkCalendarsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWorkCalendarDto, actorId?: string) {
    const existing = await this.prisma.mdpWorkCalendar.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Work calendar code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpWorkCalendar.create({
        data: {
          code: dto.code,
          name: dto.name,
          description: dto.description,
          workCenterId: toBig(dto.workCenterId),
          shiftId: toBig(dto.shiftId),
          plannedMinutesPerDay: dto.plannedMinutesPerDay,
          workingDaysPerWeek: dto.workingDaysPerWeek ?? 7,
          effectiveFrom: toDate(dto.effectiveFrom),
          effectiveTo: toDate(dto.effectiveTo),
          isActive: dto.isActive ?? true,
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS)) {
        throwDuplicate({ fieldLabel: 'Work calendar code', value: dto.code });
      }
      throw error;
    }
  }

  async findAll(query: QueryWorkCalendarDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpWorkCalendarWhereInput = { deletedAt: null };
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
      this.prisma.mdpWorkCalendar.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpWorkCalendar.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpWorkCalendar.findFirst({ where: { id, deletedAt: null } });
    if (!item) throw new NotFoundException('Work calendar not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateWorkCalendarDto, actorId?: string) {
    const existing = await this.prisma.mdpWorkCalendar.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Work calendar not found');

    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpWorkCalendar.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup) {
        throwDuplicate({
          fieldLabel: 'Work calendar code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
      }
    }

    const actor = actorId ? BigInt(actorId) : null;
    try {
      const updated = await this.prisma.mdpWorkCalendar.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          description: dto.description,
          workCenterId: dto.workCenterId !== undefined ? toBig(dto.workCenterId) : undefined,
          shiftId: dto.shiftId !== undefined ? toBig(dto.shiftId) : undefined,
          plannedMinutesPerDay: dto.plannedMinutesPerDay,
          workingDaysPerWeek: dto.workingDaysPerWeek,
          effectiveFrom: dto.effectiveFrom !== undefined ? toDate(dto.effectiveFrom) : undefined,
          effectiveTo: dto.effectiveTo !== undefined ? toDate(dto.effectiveTo) : undefined,
          isActive: dto.isActive,
          updatedById: actor,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS)) {
        throwDuplicate({ fieldLabel: 'Work calendar code', value: dto.code ?? existing.code });
      }
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpWorkCalendar.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Work calendar not found');
    await this.prisma.mdpWorkCalendar.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Work calendar deleted' };
  }
}
