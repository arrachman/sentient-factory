import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpOeeController } from './erp-mdp-oee.controller';
import { ErpMdpOeeService } from './erp-mdp-oee.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpOeeController],
  providers: [ErpMdpOeeService],
  exports: [ErpMdpOeeService],
})
export class ErpMdpOeeModule {}
