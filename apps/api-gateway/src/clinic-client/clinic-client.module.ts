import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicWaModule } from '../clinic-wa/clinic-wa.module';
import { ClinicClientController } from './clinic-client.controller';
import { ClinicClientService } from './clinic-client.service';
import { ClientValidator } from './clinic-client.validator';
import { ClinicEnricher } from './clinic-client.enricher';

@Module({
  imports: [PrismaModule, ClinicWaModule],
  controllers: [ClinicClientController],
  providers: [ClinicClientService, ClientValidator, ClinicEnricher],
  exports: [ClinicClientService],
})
export class ClinicClientModule {}
