import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrWorkforceController } from './hr-workforce.controller';
import { ShiftService } from './shift.service';
import { ProjectService } from './project.service';

@Module({
  imports: [PrismaModule],
  controllers: [HrWorkforceController],
  providers: [ShiftService, ProjectService],
})
export class HrWorkforceModule {}
