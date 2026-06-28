import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMntPmScheduleDto } from './dto/create-pm-schedule.dto';
import { QueryMntPmScheduleDto } from './dto/query-pm-schedule.dto';
import { UpdateMntPmScheduleDto } from './dto/update-pm-schedule.dto';

const CODE_TARGETS = ['code', 'mnt_pm_schedules_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpMntPmSchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateMntPmScheduleDto | UpdateMntPmScheduleDto, partial: boolean) {
    const d: Prisma.MdpMntPmScheduleUncheckedCreateInput | Prisma.MdpMntPmScheduleUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      triggerType: dto.triggerType as any,
      intervalDays: dto.intervalDays,
      meterType: dto.meterType,
      meterInterval: dto.meterInterval,
      taskDescription: dto.taskDescription,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('assetId', dto.assetId);
    setBig('workCenterId', dto.workCenterId);
    if (!partial || dto.lastServiceAt !== undefined) (d as any).lastServiceAt = dto.lastServiceAt ? new Date(dto.lastServiceAt) : null;
    if (!partial || dto.nextDueAt !== undefined) (d as any).nextDueAt = dto.nextDueAt ? new Date(dto.nextDueAt) : null;
    return d;
  }

  async create(dto: CreateMntPmScheduleDto, actorId?: string) {
    const existing = await this.prisma.mdpMntPmSchedule.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'PM schedule code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpMntPmSchedule.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpMntPmScheduleUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'PM schedule code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryMntPmScheduleDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpMntPmScheduleWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.triggerType) where.triggerType = query.triggerType;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpMntPmSchedule.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpMntPmSchedule.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpMntPmSchedule.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('PM schedule not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateMntPmScheduleDto, actorId?: string) {
    const existing = await this.prisma.mdpMntPmSchedule.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('PM schedule not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpMntPmSchedule.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'PM schedule code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpMntPmSchedule.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpMntPmScheduleUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'PM schedule code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpMntPmSchedule.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('PM schedule not found');
    await this.prisma.mdpMntPmSchedule.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'PM schedule deleted' };
  }
}
