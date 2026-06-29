import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpEhsAuditsController } from './erp-mdp-ehs-audits.controller';
import { ErpMdpEhsAuditsService } from './erp-mdp-ehs-audits.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpEhsAuditsController],
  providers: [ErpMdpEhsAuditsService],
  exports: [ErpMdpEhsAuditsService],
})
export class ErpMdpEhsAuditsModule {}
