import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicClientController } from './clinic-client.controller';
import { ClinicClientService } from './clinic-client.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicClientController],
  providers: [ClinicClientService],
  exports: [ClinicClientService],
})
export class ClinicClientModule {}
