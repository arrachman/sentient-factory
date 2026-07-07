import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpProductionLogsController } from './erp-mdp-production-logs.controller';
import { ErpMdpProductionLogsService } from './erp-mdp-production-logs.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpProductionLogsController],
  providers: [ErpMdpProductionLogsService],
  exports: [ErpMdpProductionLogsService],
})
export class ErpMdpProductionLogsModule {}
