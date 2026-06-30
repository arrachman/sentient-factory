import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { isPrivileged, normalizeHrDates } from '../hr-attendance/hr-attendance-helpers';
import { CreateHolidayDto, UpdateHolidayDto, QueryHolidayDto } from './dto/holiday.dto';

type AuthUser = { id: number; roles?: string[] };

@Injectable()
export class HrHolidaysService {
  constructor(private prisma: PrismaService) {}

  private requirePrivileged(authUser: AuthUser) {
    if (!isPrivileged(authUser.roles)) {
      throw new ForbiddenException('Hanya admin/manager yang dapat mengubah kalender libur.');
    }
  }

  async list(query: QueryHolidayDto) {
    const yearSql =
      query.year !== undefined
        ? Prisma.sql`AND extract(year from holiday_date) = ${query.year}`
        : Prisma.empty;
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT id, holiday_date AS "holidayDate", name,
             is_recurring AS "isRecurring", region,
             is_active AS "isActive", created_at AS "createdAt"
      FROM public.hr_holidays
      WHERE deleted_at IS NULL ${yearSql}
      ORDER BY holiday_date
    `);
    return { success: true, data: normalizeHrDates(rows) };
  }

  async create(authUser: AuthUser, dto: CreateHolidayDto) {
    this.requirePrivileged(authUser);
    const rows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      INSERT INTO public.hr_holidays
        (holiday_date, name, is_recurring, region, is_active, created_by)
      VALUES (${dto.holidayDate}::date, ${dto.name}, ${dto.isRecurring ?? false},
              ${dto.region ?? null}, ${dto.isActive ?? true}, ${authUser.id})
      RETURNING id
    `);
    return { success: true, data: { id: rows[0]?.id } };
  }

  async update(authUser: AuthUser, id: number, dto: UpdateHolidayDto) {
    this.requirePrivileged(authUser);
    const sets: Prisma.Sql[] = [];
    if (dto.holidayDate !== undefined) sets.push(Prisma.sql`holiday_date = ${dto.holidayDate}::date`);
    if (dto.name !== undefined) sets.push(Prisma.sql`name = ${dto.name}`);
    if (dto.isRecurring !== undefined) sets.push(Prisma.sql`is_recurring = ${dto.isRecurring}`);
    if (dto.region !== undefined) sets.push(Prisma.sql`region = ${dto.region}`);
    if (dto.isActive !== undefined) sets.push(Prisma.sql`is_active = ${dto.isActive}`);
    if (sets.length === 0) return { success: true, data: { id } };
    sets.push(Prisma.sql`updated_at = now()`, Prisma.sql`updated_by = ${authUser.id}`);
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_holidays SET ${Prisma.join(sets, ', ')}
      WHERE id = ${id} AND deleted_at IS NULL
    `);
    if (res === 0) throw new NotFoundException('Hari libur tidak ditemukan.');
    return { success: true, data: { id } };
  }

  async remove(authUser: AuthUser, id: number) {
    this.requirePrivileged(authUser);
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_holidays
      SET deleted_at = now(), deleted_by = ${authUser.id}
      WHERE id = ${id} AND deleted_at IS NULL
    `);
    if (res === 0) throw new NotFoundException('Hari libur tidak ditemukan.');
    return { success: true };
  }
}
