import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpAuditModule } from '../erp-audit/erp-audit.module';
import { ErpItemLocationsController } from './item-locations.controller';
import { ErpItemLocationsService } from './item-locations.service';

@Module({
  imports: [PrismaModule, ErpAuditModule],
  controllers: [ErpItemLocationsController],
  providers: [ErpItemLocationsService],
  exports: [ErpItemLocationsService],
})
export class ErpItemLocationsModule {}
