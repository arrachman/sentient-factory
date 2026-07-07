import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpWmsPicksController } from './erp-mdp-wms-picks.controller';
import { ErpMdpWmsPicksService } from './erp-mdp-wms-picks.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpWmsPicksController],
  providers: [ErpMdpWmsPicksService],
  exports: [ErpMdpWmsPicksService],
})
export class ErpMdpWmsPicksModule {}
