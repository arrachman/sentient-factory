import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpBranchesController } from './erp-branches.controller';
import { ErpBranchesService } from './erp-branches.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpBranchesController],
  providers: [ErpBranchesService],
  exports: [ErpBranchesService],
})
export class ErpBranchesModule {}
