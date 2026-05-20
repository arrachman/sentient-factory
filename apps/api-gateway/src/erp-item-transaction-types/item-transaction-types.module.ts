import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpAuditModule } from '../erp-audit/erp-audit.module';
import { ErpItemTransactionTypesController } from './item-transaction-types.controller';
import { ErpItemTransactionTypesService } from './item-transaction-types.service';

@Module({
  imports: [PrismaModule, ErpAuditModule],
  controllers: [ErpItemTransactionTypesController],
  providers: [ErpItemTransactionTypesService],
  exports: [ErpItemTransactionTypesService],
})
export class ErpItemTransactionTypesModule {}
