import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { ClockAttendanceDto } from './dto/clock-attendance.dto';
import { requireHrProfileByAppUserId } from './hr-attendance-helpers';
import { persistSnapshot } from './hr-attendance-snapshot';
import { AttendanceSettingsService } from './attendance-settings.service';
import { FaceEnrollmentService } from './face-enrollment.service';
import { WorksiteService } from './worksite.service';
import { diffMinutes } from './attendance-clock.utils';

type AuthUser = {
  id: number;
  roles?: string[];
};

const DEFAULT_FACE_VERIFY_MIN_SIMILARITY = 0.82;
const DEFAULT_FACE_LIVENESS_MIN_SCORE = 0.75;

@Injectable()
export class AttendanceClockService {
  constructor(
    private prisma: PrismaService,
    private settingsService: AttendanceSettingsService,
    private faceEnrollmentService: FaceEnrollmentService,
    private worksiteService: WorksiteService,
  ) {}

  async clockIn(authUser: AuthUser, dto: ClockAttendanceDto) {
    const profile = await requireHrProfileByAppUserId(this.prisma, authUser.id);
    const actorId = toAuditUserId(authUser.id);
    const inputEmbedding = this.faceEnrollmentService.requireFaceEmbedding(dto.faceEmbedding);
    const verifyThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'face_verify_confidence_threshold',
      DEFAULT_FACE_VERIFY_MIN_SIMILARITY,
    );
    const livenessThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'face_liveness_threshold',
      DEFAULT_FACE_LIVENESS_MIN_SCORE,
    );
    const snapshotUrl = dto.snapshotDataUrl
      ? await persistSnapshot('clock-in', `user-${authUser.id}`, dto.snapshotDataUrl)
      : null;

    const activeSessionRows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id
      FROM public.hr_attendance_sessions
      WHERE user_id = ${profile.hrUserId}
        AND deleted_at IS NULL
        AND work_date = CURRENT_DATE
        AND clock_out_at IS NULL
      ORDER BY id DESC
      LIMIT 1
    `);

    if (activeSessionRows.length > 0) {
      await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
        eventType: 'clock_in_attempt',
        result: 'rejected',
        reasonCode: 'already_clocked_in',
        latitude: dto.latitude,
        longitude: dto.longitude,
        faceScore: dto.faceScore,
        livenessScore: dto.livenessScore,
        snapshotUrl,
        deviceInfo: dto.deviceInfo,
        metadata: dto.metadata,
      });

      throw new BadRequestException(
        'Current user already has an active attendance session for today.',
      );
    }

    if ((dto.livenessScore ?? 0) < livenessThreshold) {
      await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
        eventType: 'clock_in_attempt',
        result: 'rejected',
        reasonCode: 'liveness_not_verified',
        latitude: dto.latitude,
        longitude: dto.longitude,
        faceScore: dto.faceScore,
        livenessScore: dto.livenessScore,
        snapshotUrl,
        deviceInfo: dto.deviceInfo,
        metadata: {
          ...(dto.metadata ?? {}),
          livenessThreshold,
          faceDetectionCount: dto.faceDetectionCount ?? null,
          faceDetectionMode: dto.faceDetectionMode ?? null,
        },
      });
      throw new BadRequestException(
        'Verifikasi wajah asli belum berhasil. Kedipkan mata sekali lalu coba lagi.',
      );
    }

    const activeEnrollment = await this.faceEnrollmentService.requireActiveFaceEnrollment(
      profile.hrUserId,
    );
    const similarity = this.faceEnrollmentService.compareFaceEmbedding(
      activeEnrollment.embedding,
      inputEmbedding,
    );

    if (similarity < verifyThreshold) {
      await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
        eventType: 'clock_in_attempt',
        result: 'rejected',
        reasonCode: 'face_mismatch',
        latitude: dto.latitude,
        longitude: dto.longitude,
        faceScore: similarity,
        livenessScore: dto.livenessScore,
        snapshotUrl,
        deviceInfo: dto.deviceInfo,
        metadata: {
          ...(dto.metadata ?? {}),
          embeddingSimilarity: similarity,
          faceDetectionCount: dto.faceDetectionCount ?? null,
          faceDetectionMode: dto.faceDetectionMode ?? null,
        },
      });

      throw new BadRequestException('Wajah tidak cocok dengan data wajah terdaftar.');
    }

    const assignedWorksites = await this.worksiteService.getAssignedWorksites(profile.hrUserId);
    const worksiteResolution = this.worksiteService.resolveWorksiteForCoordinates(
      assignedWorksites,
      dto.latitude,
      dto.longitude,
    );
    const worksite = worksiteResolution.worksite;
    const distanceMeters = worksiteResolution.distanceMeters;
    const insideGeofence = worksiteResolution.insideGeofence;
    const clockInStatus = insideGeofence ? 'success' : 'manual_review';
    const reasonCode = insideGeofence ? (dto.reasonCode ?? null) : 'outside_geofence';

    const inserted = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      INSERT INTO public.hr_attendance_sessions (
        user_id,
        work_date,
        clock_in_at,
        clock_in_latitude,
        clock_in_longitude,
        clock_in_worksite_id,
        clock_in_status,
        clock_in_face_score,
        clock_in_liveness_score,
        created_at,
        created_by,
        updated_by
      )
      VALUES (
        ${profile.hrUserId},
        CURRENT_DATE,
        now(),
        ${dto.latitude},
        ${dto.longitude},
        ${worksite?.id ?? null},
        ${clockInStatus},
        ${similarity},
        ${dto.livenessScore ?? null},
        now(),
        ${actorId},
        ${actorId}
      )
      RETURNING id
    `);

    const sessionId = inserted[0]?.id ?? null;

    await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
      sessionId,
      eventType: 'clock_in',
      result: clockInStatus,
      reasonCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
      faceScore: similarity,
      livenessScore: dto.livenessScore,
      snapshotUrl,
      deviceInfo: dto.deviceInfo,
      metadata: {
        ...(dto.metadata ?? {}),
        distanceMeters,
        worksiteCode: worksite?.code ?? null,
        embeddingSimilarity: similarity,
        faceDetectionCount: dto.faceDetectionCount ?? null,
        faceDetectionMode: dto.faceDetectionMode ?? null,
      },
    });

    return {
      success: true,
      data: {
        sessionId,
        status: clockInStatus,
        reasonCode,
        distanceMeters,
        insideGeofence,
      },
    };
  }

  async clockOut(authUser: AuthUser, dto: ClockAttendanceDto) {
    const profile = await requireHrProfileByAppUserId(this.prisma, authUser.id);
    const actorId = toAuditUserId(authUser.id);
    const inputEmbedding = this.faceEnrollmentService.requireFaceEmbedding(dto.faceEmbedding);
    const verifyThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'face_verify_confidence_threshold',
      DEFAULT_FACE_VERIFY_MIN_SIMILARITY,
    );
    const livenessThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'face_liveness_threshold',
      DEFAULT_FACE_LIVENESS_MIN_SCORE,
    );
    const snapshotUrl = dto.snapshotDataUrl
      ? await persistSnapshot('clock-out', `user-${authUser.id}`, dto.snapshotDataUrl)
      : null;

    const activeSessionRows = await this.prisma.$queryRaw<
      Array<{ id: number; clock_in_at: Date | string | null }>
    >(Prisma.sql`
      SELECT id, clock_in_at
      FROM public.hr_attendance_sessions
      WHERE user_id = ${profile.hrUserId}
        AND deleted_at IS NULL
        AND work_date = CURRENT_DATE
        AND clock_out_at IS NULL
      ORDER BY id DESC
      LIMIT 1
    `);

    if (activeSessionRows.length === 0) {
      await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
        eventType: 'clock_out_attempt',
        result: 'rejected',
        reasonCode: 'no_active_session',
        latitude: dto.latitude,
        longitude: dto.longitude,
        faceScore: dto.faceScore,
        livenessScore: dto.livenessScore,
        snapshotUrl,
        deviceInfo: dto.deviceInfo,
        metadata: dto.metadata,
      });
      throw new BadRequestException('Current user has no active attendance session.');
    }

    const activeSession = activeSessionRows[0];

    if ((dto.livenessScore ?? 0) < livenessThreshold) {
      await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
        sessionId: activeSession.id,
        eventType: 'clock_out_attempt',
        result: 'rejected',
        reasonCode: 'liveness_not_verified',
        latitude: dto.latitude,
        longitude: dto.longitude,
        faceScore: dto.faceScore,
        livenessScore: dto.livenessScore,
        snapshotUrl,
        deviceInfo: dto.deviceInfo,
        metadata: {
          ...(dto.metadata ?? {}),
          livenessThreshold,
          faceDetectionCount: dto.faceDetectionCount ?? null,
          faceDetectionMode: dto.faceDetectionMode ?? null,
        },
      });
      throw new BadRequestException(
        'Verifikasi wajah asli belum berhasil. Kedipkan mata sekali lalu coba lagi.',
      );
    }

    const activeEnrollment = await this.faceEnrollmentService.requireActiveFaceEnrollment(
      profile.hrUserId,
    );
    const similarity = this.faceEnrollmentService.compareFaceEmbedding(
      activeEnrollment.embedding,
      inputEmbedding,
    );

    if (similarity < verifyThreshold) {
      await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
        sessionId: activeSession.id,
        eventType: 'clock_out_attempt',
        result: 'rejected',
        reasonCode: 'face_mismatch',
        latitude: dto.latitude,
        longitude: dto.longitude,
        faceScore: similarity,
        livenessScore: dto.livenessScore,
        snapshotUrl,
        deviceInfo: dto.deviceInfo,
        metadata: {
          ...(dto.metadata ?? {}),
          embeddingSimilarity: similarity,
          faceDetectionCount: dto.faceDetectionCount ?? null,
          faceDetectionMode: dto.faceDetectionMode ?? null,
        },
      });
      throw new BadRequestException('Wajah tidak cocok dengan data wajah terdaftar.');
    }

    const assignedWorksites = await this.worksiteService.getAssignedWorksites(profile.hrUserId);
    const worksiteResolution = this.worksiteService.resolveWorksiteForCoordinates(
      assignedWorksites,
      dto.latitude,
      dto.longitude,
    );
    const worksite = worksiteResolution.worksite;
    const distanceMeters = worksiteResolution.distanceMeters;
    const insideGeofence = worksiteResolution.insideGeofence;
    const clockOutStatus = insideGeofence ? 'success' : 'manual_review';
    const reasonCode = insideGeofence ? (dto.reasonCode ?? null) : 'outside_geofence';

    const minutesWorked = diffMinutes(activeSession.clock_in_at);

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_attendance_sessions
      SET
        clock_out_at = now(),
        clock_out_latitude = ${dto.latitude},
        clock_out_longitude = ${dto.longitude},
        clock_out_worksite_id = ${worksite?.id ?? null},
        clock_out_status = ${clockOutStatus},
        clock_out_face_score = ${similarity},
        clock_out_liveness_score = ${dto.livenessScore ?? null},
        total_work_minutes = ${minutesWorked},
        updated_at = now(),
        updated_by = ${actorId}
      WHERE id = ${activeSession.id}
    `);

    await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
      sessionId: activeSession.id,
      eventType: 'clock_out',
      result: clockOutStatus,
      reasonCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
      faceScore: similarity,
      livenessScore: dto.livenessScore,
      snapshotUrl,
      deviceInfo: dto.deviceInfo,
      metadata: {
        ...(dto.metadata ?? {}),
        distanceMeters,
        worksiteCode: worksite?.code ?? null,
        minutesWorked,
        embeddingSimilarity: similarity,
        faceDetectionCount: dto.faceDetectionCount ?? null,
        faceDetectionMode: dto.faceDetectionMode ?? null,
      },
    });

    return {
      success: true,
      data: {
        sessionId: activeSession.id,
        status: clockOutStatus,
        reasonCode,
        distanceMeters,
        totalWorkMinutes: minutesWorked,
      },
    };
  }

}
