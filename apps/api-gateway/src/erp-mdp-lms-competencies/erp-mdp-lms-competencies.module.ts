import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpLmsCompetenciesController } from './erp-mdp-lms-competencies.controller';
import { ErpMdpLmsCompetenciesService } from './erp-mdp-lms-competencies.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpLmsCompetenciesController],
  providers: [ErpMdpLmsCompetenciesService],
  exports: [ErpMdpLmsCompetenciesService],
})
export class ErpMdpLmsCompetenciesModule {}
