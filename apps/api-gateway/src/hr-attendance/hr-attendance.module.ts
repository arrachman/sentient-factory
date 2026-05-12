import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrAttendanceController } from './hr-attendance.controller';
import { HrAttendanceService } from './hr-attendance.service';
import { AttendanceClockService } from './attendance-clock.service';
import { AttendanceQueryService } from './attendance-query.service';
import { AttendanceReviewService } from './attendance-review.service';
import { AttendanceSettingsService } from './attendance-settings.service';
import { FaceEnrollmentService } from './face-enrollment.service';
import { WorksiteService } from './worksite.service';

@Module({
  imports: [PrismaModule],
  controllers: [HrAttendanceController],
  providers: [
    HrAttendanceService,
    AttendanceClockService,
    AttendanceQueryService,
    AttendanceReviewService,
    AttendanceSettingsService,
    FaceEnrollmentService,
    WorksiteService,
  ],
})
export class HrAttendanceModule {}
