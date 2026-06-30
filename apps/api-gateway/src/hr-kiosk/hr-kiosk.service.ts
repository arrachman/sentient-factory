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
import { FaceEnrollmentService } from '../hr-attendance/face-enrollment.service';
import { hashKioskPin, verifyKioskPin } from './kiosk-pin.util';
import { KioskClockDto, SetKioskPinDto } from './dto/kiosk.dto';

type AuthUser = { id: number; roles?: string[] };

@Injectable()
export class HrKioskService {
  constructor(
    private prisma: PrismaService,
    private faceEnrollment: FaceEnrollmentService,
  ) {}

  private async requirePrivileged(a: AuthUser) {
    if (!(await resolveHrPrivilege(this.prisma, a))) throw new ForbiddenException('Mode kiosk hanya admin/manager.');
  }

  /** Roster of active employees for the kiosk picker (no secrets returned). */
  async getRoster(a: AuthUser) {
    await this.requirePrivileged(a);
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT
        hu.user_id AS "appUserId",
        hu.employee_code AS "employeeCode",
        coalesce(u.full_name, u.username) AS "fullName",
        (hu.kiosk_pin_hash IS NOT NULL) AS "hasPin",
        hu.face_enrollment_status AS "faceEnrollmentStatus"
      FROM public.hr_users hu
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE hu.deleted_at IS NULL AND hu.is_active = true
      ORDER BY coalesce(u.full_name, u.username)`);
    return { success: true, data: normalizeHrDates(rows) };
  }

  async setPin(a: AuthUser, appUserId: number, dto: SetKioskPinDto) {
    await this.requirePrivileged(a);
    const profile = await getHrProfileByAppUserId(this.prisma, appUserId);
    if (!profile) throw new NotFoundException('Karyawan tidak terdaftar di HR.');
    const hash = hashKioskPin(dto.pin);
    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_users
      SET kiosk_pin_hash = ${hash}, kiosk_pin_set_at = now(), updated_at = now(), updated_by = ${a.id}
      WHERE id = ${Number(profile.hrUserId)}`);
    return { success: true };
  }

  async clearPin(a: AuthUser, appUserId: number) {
    await this.requirePrivileged(a);
    const profile = await getHrProfileByAppUserId(this.prisma, appUserId);
    if (!profile) throw new NotFoundException('Karyawan tidak terdaftar di HR.');
    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_users
      SET kiosk_pin_hash = NULL, kiosk_pin_set_at = NULL, updated_at = now(), updated_by = ${a.id}
      WHERE id = ${Number(profile.hrUserId)}`);
    return { success: true };
  }

  async clock(a: AuthUser, dto: KioskClockDto) {
    await this.requirePrivileged(a);
    if (!dto.appUserId) {
      throw new BadRequestException('Pilih karyawan terlebih dahulu.');
    }
    const profileRow = await this.prisma.$queryRaw<
      Array<{ hrUserId: number; pinHash: string | null; fullName: string | null }>
    >(Prisma.sql`
      SELECT hu.id AS "hrUserId", hu.kiosk_pin_hash AS "pinHash",
             coalesce(u.full_name, u.username) AS "fullName"
      FROM public.hr_users hu
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE hu.user_id = ${dto.appUserId} AND hu.deleted_at IS NULL AND hu.is_active = true
      LIMIT 1`);
    const profile = profileRow[0];
    if (!profile) throw new NotFoundException('Karyawan tidak ditemukan / nonaktif.');

    const method = dto.pin ? 'kiosk_pin' : 'kiosk_face';
    if (dto.pin && !verifyKioskPin(dto.pin, profile.pinHash)) {
      await this.faceEnrollment.insertAttendanceEvent(profile.hrUserId, a.id, {
        eventType: `clock_${dto.action}_attempt`,
        result: 'rejected',
        reasonCode: 'kiosk_pin_mismatch',
        metadata: { kioskOperatorId: a.id, method },
      });
      throw new BadRequestException('PIN salah.');
    }

    const worksite = await this.resolveWorksite(dto.worksiteId);
    return dto.action === 'in'
      ? this.openSession(a, profile, worksite, dto, method)
      : this.closeSession(a, profile, worksite, dto, method);
  }

  private async resolveWorksite(worksiteId: number) {
    const rows = await this.prisma.$queryRaw<
      Array<{ id: number; latitude: number; longitude: number; name: string; code: string }>
    >(Prisma.sql`
      SELECT id, latitude, longitude, name, code FROM public.hr_worksites
      WHERE id = ${worksiteId} AND deleted_at IS NULL LIMIT 1`);
    if (!rows[0]) throw new BadRequestException('Worksite kiosk tidak ditemukan.');
    return rows[0];
  }

  private async openSession(
    a: AuthUser,
    profile: { hrUserId: number },
    worksite: { id: number; latitude: number; longitude: number; code: string },
    dto: KioskClockDto,
    method: string,
  ) {
    const active = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id FROM public.hr_attendance_sessions
      WHERE user_id = ${profile.hrUserId} AND deleted_at IS NULL
        AND work_date = CURRENT_DATE AND clock_out_at IS NULL
      ORDER BY id DESC LIMIT 1`);
    if (active.length > 0) throw new BadRequestException('Karyawan sudah clock-in hari ini.');

    const inserted = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      INSERT INTO public.hr_attendance_sessions (
        user_id, work_date, clock_in_at, clock_in_latitude, clock_in_longitude,
        clock_in_worksite_id, clock_in_status, clock_in_face_score, created_at, created_by, updated_by
      ) VALUES (
        ${profile.hrUserId}, CURRENT_DATE, now(), ${worksite.latitude}, ${worksite.longitude},
        ${worksite.id}, 'success', ${dto.faceScore ?? null}, now(), ${a.id}, ${a.id}
      ) RETURNING id`);
    const sessionId = inserted[0]?.id ?? null;
    await this.faceEnrollment.insertAttendanceEvent(profile.hrUserId, a.id, {
      sessionId,
      eventType: 'clock_in',
      result: 'success',
      faceScore: dto.faceScore ?? null,
      metadata: { kioskOperatorId: a.id, method, worksiteCode: worksite.code },
    });
    return { success: true, data: { sessionId, action: 'in', method } };
  }

  private async closeSession(
    a: AuthUser,
    profile: { hrUserId: number },
    worksite: { id: number; latitude: number; longitude: number; code: string },
    dto: KioskClockDto,
    method: string,
  ) {
    const active = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id FROM public.hr_attendance_sessions
      WHERE user_id = ${profile.hrUserId} AND deleted_at IS NULL
        AND work_date = CURRENT_DATE AND clock_out_at IS NULL
      ORDER BY id DESC LIMIT 1`);
    const sessionId = active[0]?.id;
    if (!sessionId) throw new BadRequestException('Tidak ada sesi clock-in aktif hari ini.');

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_attendance_sessions SET
        clock_out_at = now(), clock_out_latitude = ${worksite.latitude},
        clock_out_longitude = ${worksite.longitude}, clock_out_worksite_id = ${worksite.id},
        clock_out_status = 'success', clock_out_face_score = ${dto.faceScore ?? null},
        total_work_minutes = round(extract(epoch FROM (now() - clock_in_at)) / 60)::int,
        updated_at = now(), updated_by = ${a.id}
      WHERE id = ${sessionId}`);
    await this.faceEnrollment.insertAttendanceEvent(profile.hrUserId, a.id, {
      sessionId,
      eventType: 'clock_out',
      result: 'success',
      faceScore: dto.faceScore ?? null,
      metadata: { kioskOperatorId: a.id, method, worksiteCode: worksite.code },
    });
    return { success: true, data: { sessionId, action: 'out', method } };
  }
}
