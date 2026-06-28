import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpMntWorkOrdersController } from './erp-mdp-mnt-work-orders.controller';
import { ErpMdpMntWorkOrdersService } from './erp-mdp-mnt-work-orders.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpMntWorkOrdersController],
  providers: [ErpMdpMntWorkOrdersService],
  exports: [ErpMdpMntWorkOrdersService],
})
export class ErpMdpMntWorkOrdersModule {}
