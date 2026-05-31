import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CashBankPostingService } from './cash-bank-posting.service';
import { ErpFinCashBankTransactionsController } from './erp-fin-cash-bank-transactions.controller';
import { ErpFinCashBankTransactionsService } from './erp-fin-cash-bank-transactions.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpFinCashBankTransactionsController],
  providers: [ErpFinCashBankTransactionsService, CashBankPostingService],
  exports: [ErpFinCashBankTransactionsService],
})
export class ErpFinCashBankTransactionsModule {}
