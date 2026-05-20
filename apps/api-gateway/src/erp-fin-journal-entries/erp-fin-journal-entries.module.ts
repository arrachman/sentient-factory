import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpFinJournalEntriesController } from './erp-fin-journal-entries.controller';
import { ErpFinJournalEntriesService } from './erp-fin-journal-entries.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpFinJournalEntriesController],
  providers: [ErpFinJournalEntriesService],
  exports: [ErpFinJournalEntriesService],
})
export class ErpFinJournalEntriesModule {}
