import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpWmsTasksController } from './erp-mdp-wms-tasks.controller';
import { ErpMdpWmsTasksService } from './erp-mdp-wms-tasks.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpWmsTasksController],
  providers: [ErpMdpWmsTasksService],
  exports: [ErpMdpWmsTasksService],
})
export class ErpMdpWmsTasksModule {}
