import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpAuditModule } from '../erp-audit/erp-audit.module';
import { ErpItemPermissionsController } from './item-permissions.controller';
import { ErpItemPermissionsService } from './item-permissions.service';

@Module({
  imports: [PrismaModule, ErpAuditModule],
  controllers: [ErpItemPermissionsController],
  providers: [ErpItemPermissionsService],
  exports: [ErpItemPermissionsService],
})
export class ErpItemPermissionsModule {}
