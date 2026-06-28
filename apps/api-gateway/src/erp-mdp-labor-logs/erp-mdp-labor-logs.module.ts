import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpLaborLogsController } from './erp-mdp-labor-logs.controller';
import { ErpMdpLaborLogsService } from './erp-mdp-labor-logs.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpLaborLogsController],
  providers: [ErpMdpLaborLogsService],
  exports: [ErpMdpLaborLogsService],
})
export class ErpMdpLaborLogsModule {}
