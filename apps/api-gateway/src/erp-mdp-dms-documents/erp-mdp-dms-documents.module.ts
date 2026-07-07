import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpDmsDocumentsController } from './erp-mdp-dms-documents.controller';
import { ErpMdpDmsDocumentsService } from './erp-mdp-dms-documents.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpDmsDocumentsController],
  providers: [ErpMdpDmsDocumentsService],
  exports: [ErpMdpDmsDocumentsService],
})
export class ErpMdpDmsDocumentsModule {}
