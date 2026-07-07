import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpQmsResultsController } from './erp-mdp-qms-results.controller';
import { ErpMdpQmsResultsService } from './erp-mdp-qms-results.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpQmsResultsController],
  providers: [ErpMdpQmsResultsService],
  exports: [ErpMdpQmsResultsService],
})
export class ErpMdpQmsResultsModule {}
