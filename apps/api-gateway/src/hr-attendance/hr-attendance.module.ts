import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrAttendanceController } from './hr-attendance.controller';
import { HrAttendanceService } from './hr-attendance.service';

@Module({
  imports: [PrismaModule],
  controllers: [HrAttendanceController],
  providers: [HrAttendanceService],
})
export class HrAttendanceModule {}
