import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpReasonCodesController } from './erp-mdp-reason-codes.controller';
import { ErpMdpReasonCodesService } from './erp-mdp-reason-codes.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpReasonCodesController],
  providers: [ErpMdpReasonCodesService],
  exports: [ErpMdpReasonCodesService],
})
export class ErpMdpReasonCodesModule {}
