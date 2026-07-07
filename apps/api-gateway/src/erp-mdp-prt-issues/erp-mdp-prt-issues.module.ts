import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpPrtIssuesController } from './erp-mdp-prt-issues.controller';
import { ErpMdpPrtIssuesService } from './erp-mdp-prt-issues.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpPrtIssuesController],
  providers: [ErpMdpPrtIssuesService],
  exports: [ErpMdpPrtIssuesService],
})
export class ErpMdpPrtIssuesModule {}
