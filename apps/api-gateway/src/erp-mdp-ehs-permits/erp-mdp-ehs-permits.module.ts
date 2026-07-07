import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpEhsPermitsController } from './erp-mdp-ehs-permits.controller';
import { ErpMdpEhsPermitsService } from './erp-mdp-ehs-permits.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpEhsPermitsController],
  providers: [ErpMdpEhsPermitsService],
  exports: [ErpMdpEhsPermitsService],
})
export class ErpMdpEhsPermitsModule {}
