import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrAttendanceModule } from '../hr-attendance/hr-attendance.module';
import { HrKioskController } from './hr-kiosk.controller';
import { HrKioskService } from './hr-kiosk.service';

@Module({
  imports: [PrismaModule, HrAttendanceModule],
  controllers: [HrKioskController],
  providers: [HrKioskService],
})
export class HrKioskModule {}
