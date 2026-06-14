import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHrWorksiteDto } from './dto/create-hr-worksite.dto';
import { QueryHrWorksiteDto } from './dto/query-hr-worksite.dto';
import { UpdateHrWorksiteDto } from './dto/update-hr-worksite.dto';
import { normalizeHrDates } from './hr-attendance-helpers';
import { UserWorksiteService } from './user-worksite.service';

type AuthUser = {
  id: number;
  roles?: string[];
};

type HrWorksiteRow = {
  id: number;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

@Injectable()
export class WorksiteService {
  constructor(
    private prisma: PrismaService,
    private userWorksiteService: UserWorksiteService,
  ) {}

  // ---------------------------------------------------------------------------
  // Delegation — consumed by attendance-clock, attendance-query, face-enrollment
  // ---------------------------------------------------------------------------

  getAssignedWorksites(hrUserId: number) {
    return this.userWorksiteService.getAssignedWorksites(hrUserId);
  }

  getAssignedWorksiteMap(hrUserIds: number[]) {
    return this.userWorksiteService.getAssignedWorksiteMap(hrUserIds);
  }

  // ---------------------------------------------------------------------------
  // User-facing (delegated from hr-attendance.service facade)
  // ---------------------------------------------------------------------------

  getAttendanceUsers(authUser: AuthUser) {
    return this.userWorksiteService.getAttendanceUsers(authUser);
  }

  getUserWorksites(authUser: AuthUser, targetAppUserId: number) {
    return this.userWorksiteService.getUserWorksites(authUser, targetAppUserId);
  }

  updateUserWorksites(
    authUser: AuthUser,
    targetAppUserId: number,
    dto: { worksiteIds: number[] },
  ) {
    return this.userWorksiteService.updateUserWorksites(authUser, targetAppUserId, dto);
  }

  // ---------------------------------------------------------------------------
  // Geo helpers — used by attendance-clock
  // ---------------------------------------------------------------------------

  resolveWorksiteForCoordinates(
    worksites: HrWorksiteRow[],
    latitude: number | null | undefined,
    longitude: number | null | undefined,
  ) {
    if (!worksites.length || latitude == null || longitude == null) {
      return {
        worksite: worksites[0] ?? null,
        distanceMeters: null as number | null,
        insideGeofence: false,
      };
    }

    const scored = worksites
      .map((worksite) => ({
        worksite,
        distanceMeters: this.calculateDistanceMeters(
          latitude,
          longitude,
          worksite.latitude,
          worksite.longitude,
        ),
      }))
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    const inside = scored.filter((entry) => entry.distanceMeters <= entry.worksite.radiusMeters);
    return {
      worksite: inside[0]?.worksite ?? scored[0]?.worksite ?? null,
      distanceMeters: inside[0]?.distanceMeters ?? scored[0]?.distanceMeters ?? null,
      insideGeofence: inside.length > 0,
    };
  }

  calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const earthRadius = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(earthRadius * c);
  }

  // ---------------------------------------------------------------------------
  // Admin CRUD
  // ---------------------------------------------------------------------------

  async getWorksites(query: QueryHrWorksiteDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const search = query.search?.trim() ?? '';

    const searchClause = search
      ? Prisma.sql`AND (w.name ILIKE ${`%${search}%`} OR w.code ILIKE ${`%${search}%`})`
      : Prisma.empty;

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT
        w.id,
        w.name,
        w.code,
        w.latitude,
        w.longitude,
        w.radius_meters AS "radiusMeters",
        w.is_active AS "isActive",
        w.created_at AS "createdAt"
      FROM public.hr_worksites w
      WHERE w.deleted_at IS NULL
      ${searchClause}
      ORDER BY w.id DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `);

    const countRows = await this.prisma.$queryRaw<Array<{ total: bigint | number }>>(Prisma.sql`
      SELECT count(*)::bigint AS total
      FROM public.hr_worksites w
      WHERE w.deleted_at IS NULL
      ${searchClause}
    `);

    const total = Number(countRows[0]?.total ?? 0);

    return {
      success: true,
      data: normalizeHrDates(rows),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async createWorksite(dto: CreateHrWorksiteDto, authUser: AuthUser) {
    const exists = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id
      FROM public.hr_worksites
      WHERE deleted_at IS NULL
        AND code = ${dto.code}
      LIMIT 1
    `);

    if (exists.length > 0) {
      throw new BadRequestException('Worksite code already exists.');
    }

    await this.prisma.$executeRaw(Prisma.sql`
      INSERT INTO public.hr_worksites (
        name,
        code,
        latitude,
        longitude,
        radius_meters,
        is_active,
        created_at,
        created_by,
        updated_by
      )
      VALUES (
        ${dto.name},
        ${dto.code},
        ${dto.latitude},
        ${dto.longitude},
        ${dto.radiusMeters},
        ${dto.isActive ?? true},
        now(),
        ${toAuditUserId(authUser.id)},
        ${toAuditUserId(authUser.id)}
      )
    `);

    return { success: true, message: 'Worksite created.' };
  }

  async updateWorksite(id: number, dto: UpdateHrWorksiteDto, authUser: AuthUser) {
    const existing = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id
      FROM public.hr_worksites
      WHERE id = ${id}
        AND deleted_at IS NULL
      LIMIT 1
    `);

    if (existing.length === 0) {
      throw new NotFoundException('Worksite not found.');
    }

    if (dto.code) {
      const duplicate = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
        SELECT id
        FROM public.hr_worksites
        WHERE deleted_at IS NULL
          AND code = ${dto.code}
          AND id <> ${id}
        LIMIT 1
      `);
      if (duplicate.length > 0) {
        throw new BadRequestException('Worksite code already exists.');
      }
    }

    const sets: Prisma.Sql[] = [];
    if (typeof dto.name !== 'undefined') sets.push(Prisma.sql`name = ${dto.name}`);
    if (typeof dto.code !== 'undefined') sets.push(Prisma.sql`code = ${dto.code}`);
    if (typeof dto.latitude !== 'undefined') sets.push(Prisma.sql`latitude = ${dto.latitude}`);
    if (typeof dto.longitude !== 'undefined') sets.push(Prisma.sql`longitude = ${dto.longitude}`);
    if (typeof dto.radiusMeters !== 'undefined')
      sets.push(Prisma.sql`radius_meters = ${dto.radiusMeters}`);
    if (typeof dto.isActive !== 'undefined') sets.push(Prisma.sql`is_active = ${dto.isActive}`);
    sets.push(Prisma.sql`updated_at = now()`);
    sets.push(Prisma.sql`updated_by = ${toAuditUserId(authUser.id)}`);

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_worksites
      SET ${Prisma.join(sets, ', ')}
      WHERE id = ${id}
    `);

    return { success: true, message: 'Worksite updated.' };
  }

  async removeWorksite(id: number, authUser: AuthUser) {
    const existing = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id
      FROM public.hr_worksites
      WHERE id = ${id}
        AND deleted_at IS NULL
      LIMIT 1
    `);

    if (existing.length === 0) {
      throw new NotFoundException('Worksite not found.');
    }

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_worksites
      SET
        deleted_at = now(),
        deleted_by = ${toAuditUserId(authUser.id)},
        updated_at = now(),
        updated_by = ${toAuditUserId(authUser.id)}
      WHERE id = ${id}
    `);

    return { success: true, message: 'Worksite deleted.' };
  }
}
