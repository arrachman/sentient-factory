import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrAttendanceController } from './hr-attendance.controller';
import { HrAttendanceService } from './hr-attendance.service';
import { AttendanceClockService } from './attendance-clock.service';
import { AttendanceFailureService } from './attendance-failure.service';
import { AttendanceQueryService } from './attendance-query.service';
import { AttendanceDashboardService } from './attendance-dashboard.service';
import { AttendanceReviewService } from './attendance-review.service';
import { AttendanceSettingsService } from './attendance-settings.service';
import { FaceEnrollmentService } from './face-enrollment.service';
import { FaceIdentificationService } from './face-identification.service';
import { UserWorksiteService } from './user-worksite.service';
import { WorksiteService } from './worksite.service';

@Module({
  imports: [PrismaModule],
  controllers: [HrAttendanceController],
  providers: [
    HrAttendanceService,
    AttendanceClockService,
    AttendanceFailureService,
    AttendanceQueryService,
    AttendanceDashboardService,
    AttendanceReviewService,
    AttendanceSettingsService,
    FaceEnrollmentService,
    FaceIdentificationService,
    UserWorksiteService,
    WorksiteService,
  ],
  exports: [FaceEnrollmentService],
})
export class HrAttendanceModule {}
