import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpDmsAcknowledgementsController } from './erp-mdp-dms-acknowledgements.controller';
import { ErpMdpDmsAcknowledgementsService } from './erp-mdp-dms-acknowledgements.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpDmsAcknowledgementsController],
  providers: [ErpMdpDmsAcknowledgementsService],
  exports: [ErpMdpDmsAcknowledgementsService],
})
export class ErpMdpDmsAcknowledgementsModule {}
