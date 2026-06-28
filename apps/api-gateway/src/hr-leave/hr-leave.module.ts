import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HrLeaveController } from './hr-leave.controller';
import { HrLeaveService } from './hr-leave.service';

@Module({
  imports: [PrismaModule],
  controllers: [HrLeaveController],
  providers: [HrLeaveService],
})
export class HrLeaveModule {}
