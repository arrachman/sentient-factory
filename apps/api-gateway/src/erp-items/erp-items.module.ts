import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpAuditModule } from '../erp-audit/erp-audit.module';
import { ErpItemsController } from './erp-items.controller';
import { ErpItemsService } from './erp-items.service';

@Module({
  imports: [PrismaModule, ErpAuditModule],
  controllers: [ErpItemsController],
  providers: [ErpItemsService],
  exports: [ErpItemsService],
})
export class ErpItemsModule {}
