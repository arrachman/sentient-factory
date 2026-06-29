import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  getHrProfileByAppUserId, isPrivileged, normalizeHrDates,
} from '../hr-attendance/hr-attendance-helpers';
import {
  CreateShiftDto, UpdateShiftDto, CreateShiftAssignmentDto, QueryShiftAssignmentDto,
} from './dto/workforce.dto';

type AuthUser = { id: number; roles?: string[] };

@Injectable()
export class ShiftService {
  constructor(private prisma: PrismaService) {}

  private requirePrivileged(a: AuthUser) {
    if (!isPrivileged(a.roles)) throw new ForbiddenException('Hanya admin/manager.');
  }

  async listShifts() {
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT id, code, name, to_char(start_time,'HH24:MI') AS "startTime",
             to_char(end_time,'HH24:MI') AS "endTime", break_minutes AS "breakMinutes",
             is_active AS "isActive"
      FROM public.hr_shifts WHERE deleted_at IS NULL ORDER BY start_time, name`);
    return { success: true, data: normalizeHrDates(rows) };
  }

  async createShift(a: AuthUser, dto: CreateShiftDto) {
    this.requirePrivileged(a);
    const rows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      INSERT INTO public.hr_shifts (code, name, start_time, end_time, break_minutes, is_active, created_by)
      VALUES (${dto.code}, ${dto.name}, ${dto.startTime}::time, ${dto.endTime}::time,
              ${dto.breakMinutes ?? 0}, ${dto.isActive ?? true}, ${a.id}) RETURNING id`);
    return { success: true, data: { id: rows[0]?.id } };
  }

  async updateShift(a: AuthUser, id: number, dto: UpdateShiftDto) {
    this.requirePrivileged(a);
    const sets: Prisma.Sql[] = [];
    if (dto.code !== undefined) sets.push(Prisma.sql`code = ${dto.code}`);
    if (dto.name !== undefined) sets.push(Prisma.sql`name = ${dto.name}`);
    if (dto.startTime !== undefined) sets.push(Prisma.sql`start_time = ${dto.startTime}::time`);
    if (dto.endTime !== undefined) sets.push(Prisma.sql`end_time = ${dto.endTime}::time`);
    if (dto.breakMinutes !== undefined) sets.push(Prisma.sql`break_minutes = ${dto.breakMinutes}`);
    if (dto.isActive !== undefined) sets.push(Prisma.sql`is_active = ${dto.isActive}`);
    if (sets.length === 0) return { success: true, data: { id } };
    sets.push(Prisma.sql`updated_at = now()`, Prisma.sql`updated_by = ${a.id}`);
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_shifts SET ${Prisma.join(sets, ', ')} WHERE id = ${id} AND deleted_at IS NULL`);
    if (res === 0) throw new NotFoundException('Shift tidak ditemukan.');
    return { success: true, data: { id } };
  }

  async deleteShift(a: AuthUser, id: number) {
    this.requirePrivileged(a);
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_shifts SET deleted_at = now(), deleted_by = ${a.id}
      WHERE id = ${id} AND deleted_at IS NULL`);
    if (res === 0) throw new NotFoundException('Shift tidak ditemukan.');
    return { success: true };
  }

  async listAssignments(a: AuthUser, q: QueryShiftAssignmentDto) {
    const privileged = isPrivileged(a.roles);
    let scopeHrUserId: number | null = null;
    const targetAppUserId = q.userId ? (privileged ? q.userId : a.id) : null;
    if (targetAppUserId !== null || !privileged) {
      const p = await getHrProfileByAppUserId(this.prisma, targetAppUserId ?? a.id);
      if (!p) return { success: true, data: [] };
      scopeHrUserId = Number(p.hrUserId);
    }
    const scopeSql = scopeHrUserId !== null ? Prisma.sql`AND sa.user_id = ${scopeHrUserId}` : Prisma.empty;
    const fromSql = q.dateFrom ? Prisma.sql`AND sa.work_date >= ${q.dateFrom}::date` : Prisma.empty;
    const toSql = q.dateTo ? Prisma.sql`AND sa.work_date <= ${q.dateTo}::date` : Prisma.empty;
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT sa.id, sa.user_id AS "userId", sa.shift_id AS "shiftId", sa.work_date AS "workDate",
             sh.code AS "shiftCode", sh.name AS "shiftName",
             to_char(sh.start_time,'HH24:MI') AS "startTime", to_char(sh.end_time,'HH24:MI') AS "endTime",
             hu.employee_code AS "employeeCode", u.full_name AS "fullName", u.username
      FROM public.hr_shift_assignments sa
      JOIN public.hr_shifts sh ON sh.id = sa.shift_id
      JOIN public.hr_users hu ON hu.id = sa.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE sa.deleted_at IS NULL ${scopeSql} ${fromSql} ${toSql}
      ORDER BY sa.work_date DESC, u.full_name LIMIT 500`);
    return { success: true, data: normalizeHrDates(rows) };
  }

  async createAssignment(a: AuthUser, dto: CreateShiftAssignmentDto) {
    this.requirePrivileged(a);
    const profile = await getHrProfileByAppUserId(this.prisma, dto.appUserId);
    if (!profile) throw new BadRequestException('Karyawan tidak terdaftar di HR.');
    const rows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      INSERT INTO public.hr_shift_assignments (user_id, shift_id, work_date, created_by)
      VALUES (${Number(profile.hrUserId)}, ${dto.shiftId}, ${dto.workDate}::date, ${a.id})
      ON CONFLICT (user_id, work_date) WHERE deleted_at IS NULL
        DO UPDATE SET shift_id = EXCLUDED.shift_id, updated_at = now(), updated_by = ${a.id}
      RETURNING id`);
    return { success: true, data: { id: rows[0]?.id } };
  }

  async deleteAssignment(a: AuthUser, id: number) {
    this.requirePrivileged(a);
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_shift_assignments SET deleted_at = now(), deleted_by = ${a.id}
      WHERE id = ${id} AND deleted_at IS NULL`);
    if (res === 0) throw new NotFoundException('Assignment tidak ditemukan.');
    return { success: true };
  }
}
