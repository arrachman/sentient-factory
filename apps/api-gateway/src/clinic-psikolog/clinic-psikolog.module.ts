import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicWaModule } from '../clinic-wa/clinic-wa.module';
import { ClinicPsikologController } from './clinic-psikolog.controller';
import { ClinicPsikologService } from './clinic-psikolog.service';
import { PsikologDashboardService } from './psikolog-dashboard.service';
import { PsikologAvailabilityService } from './psikolog-availability.service';
import { PsikologListStatsService } from './psikolog-list-stats.service';
import { PsikologCrudService } from './psikolog-crud.service';
import { PsikologMutationService } from './psikolog-mutation.service';

@Module({
  imports: [PrismaModule, ClinicWaModule],
  controllers: [ClinicPsikologController],
  providers: [
    PsikologCrudService,
    PsikologMutationService,
    ClinicPsikologService,
    PsikologDashboardService,
    PsikologAvailabilityService,
    PsikologListStatsService,
  ],
  exports: [ClinicPsikologService],
})
export class ClinicPsikologModule {}
