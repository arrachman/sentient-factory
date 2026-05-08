import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicPsikologController } from './clinic-psikolog.controller';
import { ClinicPsikologService } from './clinic-psikolog.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicPsikologController],
  providers: [ClinicPsikologService],
  exports: [ClinicPsikologService],
})
export class ClinicPsikologModule {}
