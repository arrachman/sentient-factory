import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrHolidaysController } from './hr-holidays.controller';
import { HrHolidaysService } from './hr-holidays.service';

@Module({
  imports: [PrismaModule],
  controllers: [HrHolidaysController],
  providers: [HrHolidaysService],
})
export class HrHolidaysModule {}
