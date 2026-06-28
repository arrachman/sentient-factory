import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpMntFailureCodesController } from './erp-mdp-mnt-failure-codes.controller';
import { ErpMdpMntFailureCodesService } from './erp-mdp-mnt-failure-codes.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpMntFailureCodesController],
  providers: [ErpMdpMntFailureCodesService],
  exports: [ErpMdpMntFailureCodesService],
})
export class ErpMdpMntFailureCodesModule {}
