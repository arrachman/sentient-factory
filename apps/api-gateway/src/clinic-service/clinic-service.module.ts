import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicServiceController } from './clinic-service.controller';
import { ClinicServiceService } from './clinic-service.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicServiceController],
  providers: [ClinicServiceService],
  exports: [ClinicServiceService],
})
export class ClinicServiceModule {}
