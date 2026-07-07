import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpQmsNonconformancesController } from './erp-mdp-qms-nonconformances.controller';
import { ErpMdpQmsNonconformancesService } from './erp-mdp-qms-nonconformances.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpQmsNonconformancesController],
  providers: [ErpMdpQmsNonconformancesService],
  exports: [ErpMdpQmsNonconformancesService],
})
export class ErpMdpQmsNonconformancesModule {}
