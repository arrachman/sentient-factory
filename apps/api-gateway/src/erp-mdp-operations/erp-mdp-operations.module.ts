import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpOperationsController } from './erp-mdp-operations.controller';
import { ErpMdpOperationsService } from './erp-mdp-operations.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpOperationsController],
  providers: [ErpMdpOperationsService],
  exports: [ErpMdpOperationsService],
})
export class ErpMdpOperationsModule {}
