import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpWmsHandlingUnitsController } from './erp-mdp-wms-handling-units.controller';
import { ErpMdpWmsHandlingUnitsService } from './erp-mdp-wms-handling-units.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpWmsHandlingUnitsController],
  providers: [ErpMdpWmsHandlingUnitsService],
  exports: [ErpMdpWmsHandlingUnitsService],
})
export class ErpMdpWmsHandlingUnitsModule {}
