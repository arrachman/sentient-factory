import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import {
  getHrProfileByAppUserId,
  resolveHrPrivilege,
  normalizeHrDates,
} from './hr-attendance-helpers';

type AuthUser = {
  id: number;
  roles?: string[];
};

type HrAssignedWorksite = {
  id: number;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  isPrimary: boolean;
};

type HrWorksiteAssignmentSummary = {
  id: number;
  name: string;
  code: string;
  radiusMeters: number;
  isPrimary: boolean;
};

@Injectable()
export class UserWorksiteService {
  constructor(private prisma: PrismaService) {}

  async getAssignedWorksites(hrUserId: number) {
    const [primaryRows, extraRows] = await Promise.all([
      this.prisma.$queryRaw<
        Array<{
          id: number;
          name: string;
          code: string;
          latitude: number;
          longitude: number;
          radiusMeters: number;
        }>
      >(Prisma.sql`
        SELECT
          w.id,
          w.name,
          w.code,
          w.latitude,
          w.longitude,
          w.radius_meters AS "radiusMeters"
        FROM public.hr_users hu
        JOIN public.hr_worksites w ON w.id = hu.default_worksite_id
        WHERE hu.id = ${hrUserId}
          AND hu.deleted_at IS NULL
          AND w.deleted_at IS NULL
        LIMIT 1
      `),
      this.prisma.$queryRaw<
        Array<{
          id: number;
          name: string;
          code: string;
          latitude: number;
          longitude: number;
          radiusMeters: number;
        }>
      >(Prisma.sql`
        SELECT
          w.id,
          w.name,
          w.code,
          w.latitude,
          w.longitude,
          w.radius_meters AS "radiusMeters"
        FROM public.hr_user_worksites huw
        JOIN public.hr_worksites w ON w.id = huw.worksite_id
        WHERE huw.user_id = ${hrUserId}
          AND huw.deleted_at IS NULL
          AND w.deleted_at IS NULL
        ORDER BY huw.id ASC
      `),
    ]);

    const map = new Map<number, HrAssignedWorksite>();
    const primary = primaryRows[0];
    if (primary) {
      map.set(primary.id, {
        ...primary,
        isPrimary: true,
      });
    }

    for (const row of extraRows) {
      if (!map.has(row.id)) {
        map.set(row.id, {
          ...row,
          isPrimary: false,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      if (a.isPrimary !== b.isPrimary) {
        return a.isPrimary ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
  }

  async getAssignedWorksiteMap(hrUserIds: number[]) {
    const uniqueHrUserIds = Array.from(
      new Set(hrUserIds.filter((value) => Number.isFinite(value) && value > 0)),
    );
    if (uniqueHrUserIds.length === 0) {
      return new Map<number, HrWorksiteAssignmentSummary[]>();
    }

    const rows = await this.prisma.$queryRaw<
      Array<{
        hrUserId: number;
        worksiteId: number;
        worksiteName: string;
        worksiteCode: string;
        radiusMeters: number;
        isPrimary: boolean;
        assignedAt: Date | string | null;
      }>
    >(Prisma.sql`
      WITH assigned AS (
        SELECT
          hu.id AS "hrUserId",
          hu.default_worksite_id AS "worksiteId",
          hu.created_at AS "assignedAt",
          true AS "isPrimary"
        FROM public.hr_users hu
        WHERE hu.deleted_at IS NULL
          AND hu.default_worksite_id IS NOT NULL
          AND hu.id IN (${Prisma.join(uniqueHrUserIds)})
        UNION ALL
        SELECT
          huw.user_id AS "hrUserId",
          huw.worksite_id AS "worksiteId",
          huw.assigned_at AS "assignedAt",
          false AS "isPrimary"
        FROM public.hr_user_worksites huw
        WHERE huw.deleted_at IS NULL
          AND huw.user_id IN (${Prisma.join(uniqueHrUserIds)})
      )
      SELECT
        a."hrUserId",
        w.id AS "worksiteId",
        w.name AS "worksiteName",
        w.code AS "worksiteCode",
        w.radius_meters AS "radiusMeters",
        a."isPrimary",
        a."assignedAt"
      FROM assigned a
      JOIN public.hr_worksites w ON w.id = a."worksiteId"
      WHERE w.deleted_at IS NULL
      ORDER BY a."hrUserId" ASC, a."isPrimary" DESC, a."assignedAt" ASC, w.name ASC
    `);

    const result = new Map<number, HrWorksiteAssignmentSummary[]>();
    for (const row of rows) {
      if (!row.worksiteId) {
        continue;
      }

      const current = result.get(row.hrUserId) ?? [];
      if (current.some((worksite) => worksite.id === row.worksiteId)) {
        continue;
      }

      current.push({
        id: Number(row.worksiteId),
        name: String(row.worksiteName ?? ''),
        code: String(row.worksiteCode ?? ''),
        radiusMeters: Number(row.radiusMeters ?? 0),
        isPrimary: Boolean(row.isPrimary),
      });
      result.set(row.hrUserId, current);
    }

    for (const [hrUserId, worksites] of result) {
      worksites.sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) {
          return a.isPrimary ? -1 : 1;
        }

        return a.name.localeCompare(b.name);
      });
      result.set(hrUserId, worksites);
    }

    return result;
  }

  async syncAssignedWorksites(
    targetHrUserId: number,
    worksiteIds: number[],
    actorId: number | null,
  ) {
    const uniqueWorksiteIds = Array.from(
      new Set(worksiteIds.filter((value) => Number.isFinite(value) && value > 0)),
    );
    if (uniqueWorksiteIds.length === 0) {
      throw new BadRequestException('Pilih minimal satu tempat kerja.');
    }

    const activeWorksites = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id
      FROM public.hr_worksites
      WHERE deleted_at IS NULL
        AND id IN (${Prisma.join(uniqueWorksiteIds)})
    `);

    if (activeWorksites.length !== uniqueWorksiteIds.length) {
      throw new BadRequestException('Salah satu tempat kerja tidak valid atau sudah tidak aktif.');
    }

    const primaryWorksiteId = uniqueWorksiteIds[0];
    const insertAssignments = uniqueWorksiteIds.map((worksiteId) =>
      this.prisma.$executeRaw(Prisma.sql`
        INSERT INTO public.hr_user_worksites (
          user_id,
          worksite_id,
          assigned_at,
          created_at,
          created_by,
          updated_by
        )
        VALUES (
          ${targetHrUserId},
          ${worksiteId},
          now(),
          now(),
          ${actorId},
          ${actorId}
        )
      `),
    );

    await this.prisma.$transaction([
      this.prisma.$executeRaw(Prisma.sql`
        UPDATE public.hr_users
        SET
          default_worksite_id = ${primaryWorksiteId},
          updated_at = now(),
          updated_by = ${actorId}
        WHERE id = ${targetHrUserId}
      `),
      this.prisma.$executeRaw(Prisma.sql`
        UPDATE public.hr_user_worksites
        SET
          deleted_at = now(),
          deleted_by = ${actorId},
          updated_at = now(),
          updated_by = ${actorId}
        WHERE user_id = ${targetHrUserId}
          AND deleted_at IS NULL
      `),
      ...insertAssignments,
    ]);
  }

  async getAttendanceUsers(authUser: AuthUser) {
    if (!await resolveHrPrivilege(this.prisma, authUser)) {
      throw new BadRequestException('Daftar pegawai hanya tersedia untuk manager atau admin.');
    }

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT
        hu.id AS "hrUserId",
        hu.user_id AS "appUserId",
        hu.employee_code AS "employeeCode",
        hu.face_enrollment_status AS "faceEnrollmentStatus",
        hu.employee_role_type AS "employeeRoleType",
        hu.is_active AS "isActive",
        u.username,
        u.full_name AS "fullName",
        hw.name AS "defaultWorksiteName"
      FROM public.hr_users hu
      JOIN public.m0_users u ON u.id = hu.user_id
      LEFT JOIN public.hr_worksites hw ON hw.id = hu.default_worksite_id
      WHERE hu.deleted_at IS NULL
        AND hu.is_active = true
      ORDER BY coalesce(u.full_name, u.username) ASC, u.username ASC
    `);

    const assignedWorksites = await this.getAssignedWorksiteMap(
      rows.map((row) => Number(row.hrUserId)),
    );

    return {
      success: true,
      data: normalizeHrDates(
        rows.map((row) => ({
          ...row,
          assignedWorksites: assignedWorksites.get(Number(row.hrUserId)) ?? [],
        })),
      ),
    };
  }

  async getUserWorksites(authUser: AuthUser, targetAppUserId: number) {
    if (!await resolveHrPrivilege(this.prisma, authUser)) {
      throw new BadRequestException('Daftar tempat kerja hanya tersedia untuk manager atau admin.');
    }

    const profile = await getHrProfileByAppUserId(this.prisma, targetAppUserId);
    if (!profile) {
      throw new NotFoundException('HR attendance profile not found for selected user.');
    }

    const assignedWorksites = await this.getAssignedWorksites(Number(profile.hrUserId));

    return {
      success: true,
      data: {
        hrUserId: Number(profile.hrUserId),
        appUserId: Number(profile.appUserId),
        employeeCode: profile.employeeCode,
        fullName: profile.fullName,
        username: profile.username,
        defaultWorksiteId: profile.defaultWorksiteId,
        assignedWorksites: normalizeHrDates(assignedWorksites),
      },
    };
  }

  async updateUserWorksites(
    authUser: AuthUser,
    targetAppUserId: number,
    dto: { worksiteIds: number[] },
  ) {
    if (!await resolveHrPrivilege(this.prisma, authUser)) {
      throw new BadRequestException(
        'Mengubah tempat kerja hanya tersedia untuk manager atau admin.',
      );
    }

    const profile = await getHrProfileByAppUserId(this.prisma, targetAppUserId);
    if (!profile) {
      throw new NotFoundException('HR attendance profile not found for selected user.');
    }

    const actorId = toAuditUserId(authUser.id);
    await this.syncAssignedWorksites(Number(profile.hrUserId), dto.worksiteIds, actorId);

    const assignedWorksites = await this.getAssignedWorksites(Number(profile.hrUserId));
    const updatedProfile = await getHrProfileByAppUserId(this.prisma, targetAppUserId);

    return {
      success: true,
      message: 'Tempat kerja pegawai berhasil diperbarui.',
      data: {
        hrUserId: Number(profile.hrUserId),
        appUserId: Number(profile.appUserId),
        defaultWorksiteId: updatedProfile?.defaultWorksiteId ?? null,
        assignedWorksites: normalizeHrDates(assignedWorksites),
      },
    };
  }
}
