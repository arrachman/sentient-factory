import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpAuditModule } from '../erp-audit/erp-audit.module';
import { ErpItemMediaController } from './erp-item-media.controller';
import { ErpItemMediaService } from './erp-item-media.service';
import { ErpItemsController } from './erp-items.controller';
import { ErpItemsService } from './erp-items.service';

@Module({
  imports: [PrismaModule, ErpAuditModule],
  controllers: [ErpItemsController, ErpItemMediaController],
  providers: [ErpItemsService, ErpItemMediaService],
  exports: [ErpItemsService],
})
export class ErpItemsModule {}
