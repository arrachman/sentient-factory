import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpDmsRevisionsController } from './erp-mdp-dms-revisions.controller';
import { ErpMdpDmsRevisionsService } from './erp-mdp-dms-revisions.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpDmsRevisionsController],
  providers: [ErpMdpDmsRevisionsService],
  exports: [ErpMdpDmsRevisionsService],
})
export class ErpMdpDmsRevisionsModule {}
