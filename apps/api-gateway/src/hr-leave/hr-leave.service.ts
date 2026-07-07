import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  getHrProfileByAppUserId,
  resolveHrPrivilege,
  normalizeHrDates,
} from '../hr-attendance/hr-attendance-helpers';
import {
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
  CreateLeaveRequestDto,
  QueryLeaveRequestDto,
} from './dto/leave.dto';

type AuthUser = { id: number; roles?: string[] };

@Injectable()
export class HrLeaveService {
  constructor(private prisma: PrismaService) {}

  private async requirePrivileged(authUser: AuthUser) {
    if (!(await resolveHrPrivilege(this.prisma, authUser))) {
      throw new ForbiddenException('Hanya admin/manager yang dapat melakukan aksi ini.');
    }
  }

  // ─── Leave types ────────────────────────────────────────────────────────────

  async listLeaveTypes() {
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT id, code, name, is_paid AS "isPaid", default_quota_days AS "defaultQuotaDays",
             is_active AS "isActive", created_at AS "createdAt"
      FROM public.hr_leave_types
      WHERE deleted_at IS NULL
      ORDER BY name
    `);
    return { success: true, data: normalizeHrDates(rows) };
  }

  async createLeaveType(authUser: AuthUser, dto: CreateLeaveTypeDto) {
    await this.requirePrivileged(authUser);
    const rows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      INSERT INTO public.hr_leave_types (code, name, is_paid, default_quota_days, is_active, created_by)
      VALUES (${dto.code}, ${dto.name}, ${dto.isPaid ?? true},
              ${dto.defaultQuotaDays ?? null}, ${dto.isActive ?? true}, ${authUser.id})
      RETURNING id
    `);
    return { success: true, data: { id: rows[0]?.id } };
  }

  async updateLeaveType(authUser: AuthUser, id: number, dto: UpdateLeaveTypeDto) {
    await this.requirePrivileged(authUser);
    const sets: Prisma.Sql[] = [];
    if (dto.code !== undefined) sets.push(Prisma.sql`code = ${dto.code}`);
    if (dto.name !== undefined) sets.push(Prisma.sql`name = ${dto.name}`);
    if (dto.isPaid !== undefined) sets.push(Prisma.sql`is_paid = ${dto.isPaid}`);
    if (dto.defaultQuotaDays !== undefined)
      sets.push(Prisma.sql`default_quota_days = ${dto.defaultQuotaDays}`);
    if (dto.isActive !== undefined) sets.push(Prisma.sql`is_active = ${dto.isActive}`);
    if (sets.length === 0) return { success: true, data: { id } };
    sets.push(Prisma.sql`updated_at = now()`, Prisma.sql`updated_by = ${authUser.id}`);
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_leave_types SET ${Prisma.join(sets, ', ')}
      WHERE id = ${id} AND deleted_at IS NULL
    `);
    if (res === 0) throw new NotFoundException('Tipe cuti tidak ditemukan.');
    return { success: true, data: { id } };
  }

  async deleteLeaveType(authUser: AuthUser, id: number) {
    await this.requirePrivileged(authUser);
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_leave_types
      SET deleted_at = now(), deleted_by = ${authUser.id}
      WHERE id = ${id} AND deleted_at IS NULL
    `);
    if (res === 0) throw new NotFoundException('Tipe cuti tidak ditemukan.');
    return { success: true };
  }

  // ─── Leave requests ──────────────────────────────────────────────────────────

  async listLeaveRequests(authUser: AuthUser, query: QueryLeaveRequestDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 25;
    const offset = (page - 1) * limit;
    const privileged = await resolveHrPrivilege(this.prisma, authUser);
    const search = query.search?.trim() ?? '';

    let scopeHrUserId: number | null = null;
    const targetAppUserId = query.userId ? (privileged ? query.userId : authUser.id) : null;
    if (targetAppUserId !== null || !privileged) {
      const profile = await getHrProfileByAppUserId(this.prisma, targetAppUserId ?? authUser.id);
      if (!profile) return { success: true, data: [], meta: { page, limit, total: 0, totalPages: 1 } };
      scopeHrUserId = Number(profile.hrUserId);
    }

    const scopeSql = scopeHrUserId !== null ? Prisma.sql`AND r.user_id = ${scopeHrUserId}` : Prisma.empty;
    const statusSql = query.status ? Prisma.sql`AND r.status = ${query.status}` : Prisma.empty;
    const searchSql =
      search.length > 0
        ? Prisma.sql`AND (lower(coalesce(u.full_name,'')) LIKE lower(${`%${search}%`})
            OR lower(coalesce(hu.employee_code,'')) LIKE lower(${`%${search}%`}))`
        : Prisma.empty;

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT r.id, r.user_id AS "userId", r.leave_type_id AS "leaveTypeId",
             lt.code AS "leaveTypeCode", lt.name AS "leaveTypeName",
             r.start_date AS "startDate", r.end_date AS "endDate", r.total_days AS "totalDays",
             r.reason, r.status, r.review_note AS "reviewNote", r.reviewed_at AS "reviewedAt",
             r.created_at AS "createdAt", hu.employee_code AS "employeeCode",
             u.full_name AS "fullName", u.username
      FROM public.hr_leave_requests r
      JOIN public.hr_leave_types lt ON lt.id = r.leave_type_id
      JOIN public.hr_users hu ON hu.id = r.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE r.deleted_at IS NULL ${scopeSql} ${statusSql} ${searchSql}
      ORDER BY r.created_at DESC, r.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
    const countRows = await this.prisma.$queryRaw<Array<{ total: bigint | number }>>(Prisma.sql`
      SELECT count(*)::bigint AS total
      FROM public.hr_leave_requests r
      JOIN public.hr_users hu ON hu.id = r.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE r.deleted_at IS NULL ${scopeSql} ${statusSql} ${searchSql}
    `);
    const total = Number(countRows[0]?.total ?? 0);
    return {
      success: true,
      data: normalizeHrDates(rows),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async createLeaveRequest(authUser: AuthUser, dto: CreateLeaveRequestDto) {
    const profile = await getHrProfileByAppUserId(this.prisma, authUser.id);
    if (!profile) throw new BadRequestException('Anda belum terdaftar di HR attendance.');
    if (new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new BadRequestException('Tanggal selesai tidak boleh sebelum tanggal mulai.');
    }
    const rows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      INSERT INTO public.hr_leave_requests
        (user_id, leave_type_id, start_date, end_date, total_days, reason, status, created_by)
      VALUES (${Number(profile.hrUserId)}, ${dto.leaveTypeId}, ${dto.startDate}::date,
              ${dto.endDate}::date, (${dto.endDate}::date - ${dto.startDate}::date + 1),
              ${dto.reason ?? null}, 'pending', ${authUser.id})
      RETURNING id
    `);
    return { success: true, data: { id: rows[0]?.id } };
  }

  async reviewLeaveRequest(
    authUser: AuthUser,
    id: number,
    nextStatus: 'approved' | 'rejected' | 'cancelled',
    note?: string,
  ) {
    const rows = await this.prisma.$queryRaw<Array<{ user_id: number; status: string }>>(Prisma.sql`
      SELECT r.user_id, r.status FROM public.hr_leave_requests r
      WHERE r.id = ${id} AND r.deleted_at IS NULL LIMIT 1
    `);
    const row = rows[0];
    if (!row) throw new NotFoundException('Pengajuan cuti tidak ditemukan.');

    if (nextStatus === 'cancelled') {
      // Owner may cancel own request; privileged may cancel any.
      const profile = await getHrProfileByAppUserId(this.prisma, authUser.id);
      const isOwner = profile && Number(profile.hrUserId) === Number(row.user_id);
      if (!isOwner && !await resolveHrPrivilege(this.prisma, authUser)) {
        throw new ForbiddenException('Tidak boleh membatalkan pengajuan ini.');
      }
    } else {
      await this.requirePrivileged(authUser);
    }

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_leave_requests
      SET status = ${nextStatus}, review_note = ${note ?? null},
          reviewed_by = ${authUser.id}, reviewed_at = now(),
          updated_at = now(), updated_by = ${authUser.id}
      WHERE id = ${id} AND deleted_at IS NULL
    `);
    return { success: true, data: { id, status: nextStatus } };
  }
}
