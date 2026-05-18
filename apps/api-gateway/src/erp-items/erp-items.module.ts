import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpItemsController } from './erp-items.controller';
import { ErpItemsService } from './erp-items.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpItemsController],
  providers: [ErpItemsService],
  exports: [ErpItemsService],
})
export class ErpItemsModule {}
