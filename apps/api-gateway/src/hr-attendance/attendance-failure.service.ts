import { Injectable } from '@nestjs/common';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { ReportAttendanceFailureDto } from './dto/report-attendance-failure.dto';
import { requireHrProfileByAppUserId } from './hr-attendance-helpers';
import { persistSnapshot } from './hr-attendance-snapshot';
import { FaceEnrollmentService } from './face-enrollment.service';

type AuthUser = {
  id: number;
  roles?: string[];
};

@Injectable()
export class AttendanceFailureService {
  constructor(
    private prisma: PrismaService,
    private faceEnrollmentService: FaceEnrollmentService,
  ) {}

  async reportAttendanceFailure(authUser: AuthUser, dto: ReportAttendanceFailureDto) {
    const profile = await requireHrProfileByAppUserId(this.prisma, authUser.id);
    const actorId = toAuditUserId(authUser.id);
    const snapshotUrl = dto.snapshotDataUrl
      ? await persistSnapshot('attempt-failures', `user-${authUser.id}`, dto.snapshotDataUrl)
      : null;

    await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
      eventType: dto.eventType,
      result: 'rejected',
      reasonCode: dto.reasonCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
      faceScore: dto.faceScore,
      livenessScore: dto.livenessScore,
      snapshotUrl,
      deviceInfo: dto.deviceInfo,
      metadata: dto.metadata,
    });

    return {
      success: true,
      message: 'Attendance failure attempt recorded.',
      data: {
        eventType: dto.eventType,
        reasonCode: dto.reasonCode,
        snapshotUrl,
      },
    };
  }
}
