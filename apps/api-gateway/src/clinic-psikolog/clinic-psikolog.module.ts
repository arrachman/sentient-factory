import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicPsikologController } from './clinic-psikolog.controller';
import { ClinicPsikologService } from './clinic-psikolog.service';
import { PsikologDashboardService } from './psikolog-dashboard.service';
import { PsikologAvailabilityService } from './psikolog-availability.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicPsikologController],
  providers: [ClinicPsikologService, PsikologDashboardService, PsikologAvailabilityService],
  exports: [ClinicPsikologService],
})
export class ClinicPsikologModule {}
