import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ErpMdpMntSparePartsController } from './erp-mdp-mnt-spare-parts.controller';
import { ErpMdpMntSparePartsService } from './erp-mdp-mnt-spare-parts.service';

@Module({
  imports: [PrismaModule],
  controllers: [ErpMdpMntSparePartsController],
  providers: [ErpMdpMntSparePartsService],
  exports: [ErpMdpMntSparePartsService],
})
export class ErpMdpMntSparePartsModule {}
